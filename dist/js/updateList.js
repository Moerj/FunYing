'use strict';

// 剧情更新

setTimeout(function () {

    new ScrollLoad({

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
                sort: 1
            });

            $.ajax({
                type: "get",
                url: 'http://wechat.94joy.com/wx/rest/find/all',
                data: data,
                success: function success(res) {
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
});