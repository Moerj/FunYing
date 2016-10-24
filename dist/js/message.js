'use strict';

$(function () {

    var $contanier = $('.message-contanier');
    var $emptyBackground = $contanier.find('.empty');

    // $.showIndicator()

    // $.ajax({
    //     type: "get",
    //     url: "url",
    //     data: "data",
    //     success: function (response) {
    //         $.hideIndicator()
    //     }
    // });

    $(document).on('swipeLeft', '.message', function () {
        $(this).addClass('showDelete');
    }).on('swipeRight', '.message', function () {
        $(this).removeClass('showDelete');
    }).on('click', '.messageList .delete', function () {
        $(this).parents('.messageList').remove();
        if ($contanier.find('.messageList').length == 0) {
            $emptyBackground.show();
        }
    });

    function createMessage() {
        var length = 3;
        var tpl = '';
        for (var i = 0; i < length; i++) {
            tpl += '\n            <div class="messageList">\n                <a href="#" class="message">\n                    <p class="Title">\n                        <span class="name">《正义联盟》新版戈登曝光造型</span>\n                        <span class="day">9/17</span>\n                    </p>\n                    <p class="details">DC漫改大作《正义联盟》导演扎克·施奈德昨日曝光该片两张最新宣传照，庆祝今年的蝙蝠侠日（9月17日）hahahahahahahahahahahahahahahahahahahahahahahahaha</p>\n                    <span class="delete"></span>\n                </a>\n            </div>\n            ';
        }
        $contanier.append(tpl);
        $emptyBackground.hide();
    }
    createMessage();
});
//# sourceMappingURL=message.js.map
