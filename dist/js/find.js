'use strict';

setTimeout(function () {

    // 筛选参数，页面独有
    var sort = 1; //排序 1.更新时间 2.人气排行
    var area = null; //地区 直接传中文字符，'全部'传空
    var type = null; //电影类型，同地区

    var loader = new ScrollLoad({

        scrollContanier: '.infinite-scroll', //滚动父容器
        listContanier: '.find-content', //列表容器

        // 配置渲染模板
        template: function template(data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                html += '\n                <a href="' + $.getMovDetails(d.id) + '" class="find-list external">\n                    <div class="imgbox">\n                        <img src="' + d.stills + '" alt="">\n                        <div class="status">' + $.getUpdateStatus(d.updateStatus) + '</div>\n                    </div>\n                    <p class="name">' + d.title + ' ' + d.updateSite + '</p>\n                </a>\n                ';
            }
            return html;
        },

        ajax: function ajax(data, callback) {
            // 合并入筛选参数
            data = $.extend({}, data, {
                sort: sort,
                area: area,
                type: type
            });

            $.ajax({
                url: 'http://wechat.94joy.com/wx/rest/find/all',
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

    // 顶部筛选
    var $selectSwitch = $('.select-switch');
    function toggleArrow(eqIndex) {
        $selectSwitch.eq(eqIndex).find('.fa').toggleClass('isopen');
    }

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
            sort = picker.value[0] == '更新时间' ? 1 : 2;
            loader.reload();

            var value = picker.value;
            $selectSwitch.eq(sortIndex).find('b').text(value);
        }
    });

    var areaIndex = 1;
    $selectSwitch.eq(areaIndex).picker({
        toolbarTemplate: '<header class="find-select"></header>',
        cols: [{
            textAlign: 'center',
            values: ['全部', '内地', '韩国']
        }],
        onOpen: function onOpen() {
            toggleArrow(areaIndex);
        },
        onClose: function onClose(picker) {
            toggleArrow(areaIndex);
            area = picker.value[0] == '全部' ? null : picker.value[0];
            loader.reload();

            var value = picker.value == '全部' ? '地区' : picker.value;
            $selectSwitch.eq(areaIndex).find('b').text(value);
        }
    });

    var typeIndex = 2;
    $selectSwitch.eq(typeIndex).picker({
        toolbarTemplate: '<header class="find-select"></header>',
        cols: [{
            textAlign: 'center',
            values: ['全部', '电视剧', '电影']
        }],
        onOpen: function onOpen() {
            toggleArrow(typeIndex);
        },
        onClose: function onClose(picker) {
            toggleArrow(typeIndex);
            type = picker.value[0] == '全部' ? null : picker.value[0];
            loader.reload();

            var value = picker.value == '全部' ? '类型' : picker.value;
            $selectSwitch.eq(typeIndex).find('b').text(value);
        }
    });

    // 选中筛选内容，并收起筛选器
    $(document).on('click', '.picker-item', function () {
        $.closeModal(".picker-modal.modal-in");
    });
});