'use strict';

$(function () {

    var $contanier = $('.message-contanier ul');
    var $emptyBackground = $contanier.find('.empty');

    new ScrollLoad({

        scrollContanier: $contanier, //滚动父容器
        // maxload: 10,
        // perload: 7,

        // 配置渲染模板
        template: function template(data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                html += '\n                <li class="messageList">\n                    <a href=' + ($.url.artDetails + d.id) + ' class="message external">\n                        <p class="Title">\n                            <span class="name">' + d.title + '</span>\n                            <span class="day">' + d.addTime + '</span>\n                        </p>\n                        <p class="details">' + d.context + '</p>\n                        <span class="delete" msgId=' + d.id + '></span>\n                    </a>\n                </li>\n                ';
            }
            return html;
        },

        ajax: function ajax(data, callback) {
            var newData = $.extend({}, data, {
                openId: window.openId
            });
            $.ajax({
                type: "get",
                // url: '../json/message.json',
                url: 'http://118.178.136.60:8001/rest/user/systemMsg',
                data: newData,
                success: function success(res) {
                    // console.log(res);
                    if (res.DATA) {
                        callback(res.DATA);
                    } else {
                        console.log('路由页面没有数据>>');
                    }
                },
                error: function error(e) {
                    console.log(e);
                    $.alert('刷新失败，请稍后再试！');
                },
                complete: function complete() {
                    showEmpty();
                }
            });
        }
    });

    function showEmpty() {
        if ($contanier.children('.messageList').length == 0) {
            $contanier.hide();
        }
    }

    function deleteOneMsg(deleteBtn) {
        var $deleteBtn = $(deleteBtn);
        var msgId = $deleteBtn.attr('msgId');
        $deleteBtn.parents('.messageList').remove();
        showEmpty();

        $.ajax({
            url: "http://118.178.136.60:8001/rest/user/delSystemMsg",
            data: {
                openId: window.openId,
                msgId: msgId
            },
            success: function success(res) {
                // console.log(res);
                if (res.STATUS == 1) {
                    console.log('id:' + msgId + ' 消息删除成功!');
                }
            }
        });
    }

    $(document).on('swipeLeft', '.message', function () {
        $(this).addClass('showDelete');
    }).on('swipeRight', '.message', function () {
        $(this).removeClass('showDelete');
    }).on('click', '.messageList .delete', function () {
        deleteOneMsg(this);
        return false; //防冒泡
    });
});