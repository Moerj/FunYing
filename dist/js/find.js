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

        ajax: function ajax(callback) {

            var postData = {
                sort: Number(sessionStorage.sort),
                first_type: sessionStorage.first_type,
                type: sessionStorage.type,
                openId: $.openId,
                skip: this.currentPage, //当前页
                limit: this.perload //每页条数
            };

            $.ajax({
                url: 'http://www.funying.cn/wx/rest/find/all',
                data: postData,
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

            // 重新加载loader
            $.showIndicator();
            loader.reload(function () {
                $.hideIndicator();
            });

            // 设置文本
            var value = picker.value;
            setSelectName(sortIndex, value);

            loader.cleanCache();
        }
    });

    // 类型
    var areaIndex = 1;
    var areaValues = ['全部', '\u7535\u5F71', '\u7535\u89C6\u5267', '\u52A8\u753B', '\u6F14\u5531\u4F1A', '\u5A31\u4E50', '\u6E38\u620F', '\u5468\u8FB9', '\u5176\u4ED6'];
    $selectSwitch.eq(areaIndex).picker({
        toolbarTemplate: '<header class="find-select"></header>',
        cols: [{
            textAlign: 'center',
            values: areaValues
        }],
        onOpen: function onOpen() {
            toggleArrow(areaIndex);
        },
        onClose: function onClose(picker) {
            toggleArrow(areaIndex);
            sessionStorage.first_type = picker.value[0] == '全部' ? '' : picker.value[0];

            // 重新加载loader
            $.showIndicator();
            loader.reload(function () {
                $.hideIndicator();
            });

            // 设置文本
            var value = picker.value == '全部' ? '类型' : picker.value;
            setSelectName(areaIndex, value);

            loader.cleanCache();

            // 控制fun类的picker
            var cols = $selectSwitch.eq(typeIndex)[0].__eleData.picker.params.cols[0];
            switch (value[0]) {
                case '电影':
                    cols.values = ['全部', '\u52A8\u4F5C', '\u559C\u5267', '\u7231\u60C5', '\u79D1\u5E7B', '\u60AC\u7591', '\u6050\u6016', '\u5267\u60C5'];
                    break;
                case '动画':
                    cols.values = ['全部', '\u6B27\u7F8E', '\u65E5\u672C', '\u534E\u8BED'];
                    break;
                case '电视剧':
                    cols.values = ['全部', '\u97E9\u56FD', '\u6B27\u7F8E', '\u65E5\u672C', '\u534E\u8BED'];
                    break;
                case '演唱会':
                    cols.values = ['全部'];
                    break;
                case '娱乐':
                    cols.values = ['全部'];
                    break;
                case '综艺':
                    cols.values = ['全部'];
                    break;
                case '其他':
                    cols.values = ['全部'];
                    break;

                default:
                    //全部
                    cols.values = areaValues;
                    break;
            }
        }
    });
    if (sessionStorage.first_type !== '') {
        setSelectName(areaIndex, sessionStorage.first_type);
    }

    // fun类
    var typeIndex = 2;
    var typeValues = ['\u5168\u90E8', '\u7ECF\u5178', '\u534E\u8BED', '\u6B27\u7F8E', '\u97E9\u56FD', '\u65E5\u672C', '\u52A8\u4F5C', '\u559C\u5267', '\u7231\u60C5', '\u79D1\u5E7B', '\u60AC\u7591', '\u6050\u6016', '\u5267\u60C5', '\u8C46\u74E3\u9AD8\u5206', '\u51B7\u95E8\u4F73\u7247'];
    $selectSwitch.eq(typeIndex).picker({
        toolbarTemplate: '<header class="find-select"></header>',
        cols: [{
            textAlign: 'center',
            values: typeValues
        }],
        onOpen: function onOpen() {
            toggleArrow(typeIndex);
        },
        onClose: function onClose(picker) {
            toggleArrow(typeIndex);
            sessionStorage.type = picker.value[0] == '全部' ? '' : picker.value[0];

            // 重新加载loader
            $.showIndicator();
            loader.reload(function () {
                $.hideIndicator();
            });

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