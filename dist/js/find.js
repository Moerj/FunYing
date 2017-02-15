'use strict';

setTimeout(function () {

    // 筛选参数，页面独有
    sessionStorage.sort = sessionStorage.sort || 1; //排序 1.更新时间 2.人气排行
    sessionStorage.first_type = sessionStorage.first_type || ''; //地区 直接传中文字符，'全部'传空
    sessionStorage.type = sessionStorage.type || ''; //电影类型，同地区

    var loader = new ScrollLoad({

        scrollContanier: '.infinite-scroll', //滚动父容器
        listContanier: '.find-content', //列表容器

        // 配置渲染模板
        template: function template(data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                html += '\n                <a href="' + $.getMovDetails(d.id) + '" class="find-list external">\n                    <div class="imgbox">\n                        <img src="' + d.poster + '" alt="">\n                        <div class="status">' + $.getUpdateStatus(d.updateStatus, d.updateSite) + '</div>\n                    </div>\n                    <p class="name">' + d.title + '</p>\n                </a>\n                ';
            }

            return html;
        },

        ajax: function ajax(data, callback) {

            // 合并入筛选参数
            data = $.extend({}, data, {
                sort: Number(sessionStorage.sort),
                first_type: sessionStorage.first_type,
                type: sessionStorage.type
            });

            $.ajax({
                url: 'http://www.funying.cn/wx/rest/find/all',
                data: data,
                success: function success(res) {
                    console.log('发现', res);
                    if (res.DATA) {

                        callback(res.DATA);
                    } else {
                        $.alert('没有数据了');
                    }
                },
                error: function error(e) {
                    console.log(e);
                    $.alert('刷新失败，请稍后再试！');
                }
            });
        }
    });

    window.findLoader = loader;

    // 顶部筛选
    var $selectSwitch = $('.select-switch');

    function toggleArrow(eqIndex) {
        $selectSwitch.eq(eqIndex).find('.fa').toggleClass('isopen');
    }

    function setSelectName(eqIndex, value) {
        $selectSwitch.eq(eqIndex).find('b').text(value);
    }

    // 排序
    var sortIndex = 0;
    $selectSwitch.eq(sortIndex).picker({
        toolbarTemplate: '<header class="find-select"></header>',
        cols: [{
            textAlign: 'center',
            values: ['更新时间', '人气排行']
        }],
        onOpen: function onOpen() {
            toggleArrow(sortIndex);
        },
        onClose: function onClose(picker) {
            toggleArrow(sortIndex);
            sessionStorage.sort = picker.value[0] == '更新时间' ? 1 : 2;
            loader.reload();

            // 设置文本
            var value = picker.value;
            setSelectName(sortIndex, value);

            loader.cleanCache();
        }
    });

    // 类型
    var areaIndex = 1;
    $selectSwitch.eq(areaIndex).picker({
        toolbarTemplate: '<header class="find-select"></header>',
        cols: [{
            textAlign: 'center',
            values: ['全部', '电影', '电视剧', '动画', '演唱会', '娱乐', '体育', '游戏', '周边', '其他']
        }],
        onOpen: function onOpen() {
            toggleArrow(areaIndex);
        },
        onClose: function onClose(picker) {
            toggleArrow(areaIndex);
            sessionStorage.first_type = picker.value[0] == '全部' ? '' : picker.value[0];
            loader.reload();

            // 设置文本
            var value = picker.value == '全部' ? '类型' : picker.value;
            setSelectName(areaIndex, value);

            loader.cleanCache();
        }
    });
    if (sessionStorage.first_type !== '') {
        setSelectName(areaIndex, sessionStorage.first_type);
    }

    // fun类
    var typeIndex = 2;
    $selectSwitch.eq(typeIndex).picker({
        toolbarTemplate: '<header class="find-select"></header>',
        cols: [{
            textAlign: 'center',
            values: ['全部', '经典', '华语', '欧美', '韩国', '日本', '动作', '喜剧', '爱情', '科幻', '悬疑', '恐怖', '豆瓣高分', '冷门佳片']
        }],
        onOpen: function onOpen() {
            toggleArrow(typeIndex);
        },
        onClose: function onClose(picker) {
            toggleArrow(typeIndex);
            sessionStorage.type = picker.value[0] == '全部' ? '' : picker.value[0];
            loader.reload();

            // 设置文本
            var value = picker.value == '全部' ? 'fun类' : picker.value;
            setSelectName(typeIndex, value);

            loader.cleanCache();
        }
    });
    if (sessionStorage.type !== '') {
        setSelectName(typeIndex, sessionStorage.type);
    }

    // 选中筛选内容，并收起筛选器
    $(document).on('click', '.picker-item', function () {
        $.closeModal(".picker-modal.modal-in");
    });
}, 100);