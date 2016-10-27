'use strict';

$(function () {

    var $contanier = $('.message-contanier ul');
    var $emptyBackground = $contanier.find('.empty');

    $.showIndicator();

    var loader = new ScrollLoad({

        scrollContanier: $contanier, //滚动父容器
        // maxload: 10,
        // perload: 7,

        // 配置渲染模板
        template: function template(data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                html += '\n                <li class="messageList">\n                    <a href="' + ($.url.artDetails + d.id) + '" class="message external">\n                        <p class="Title">\n                            <span class="name">' + d.title + '</span>\n                            <span class="day">' + d.addTime + '</span>\n                        </p>\n                        <p class="details">' + d.introduction + '</p>\n                        <span class="delete"></span>\n                    </a>\n                </li>\n                ';
            }
            return html;
        },

        ajax: function ajax(data, callback) {
            $.ajax({
                type: "get",
                url: '../json/message.json',
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
                },
                complete: function complete() {
                    if ($contanier.children().length == 0) {
                        $contanier.hide();
                    }
                    $.hideIndicator();
                }
            });
        }
    });

    $(document).on('swipeLeft', '.message', function () {
        $(this).addClass('showDelete');
    }).on('swipeRight', '.message', function () {
        $(this).removeClass('showDelete');
    }).on('click', '.messageList .delete', function () {
        $(this).parents('.messageList').remove();
        if ($contanier.find('.messageList').length == 0) {
            $emptyBackground.show();
        }
        return false;
    });
});