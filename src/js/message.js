$(function () {

    const $contanier = $('.message-contanier')
    const $emptyBackground = $contanier.find('.empty')

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
            $(this).addClass('showDelete')
        })
        .on('swipeRight', '.message', function () {
            $(this).removeClass('showDelete')
        })
        .on('click', '.messageList .delete', function () {
            $(this).parents('.messageList').remove();
            if ($contanier.find('.messageList').length == 0) {
                $emptyBackground.show()
            }
            return false;
        })


    function createMessage() {
        let length = 3;
        let tpl = ``
        for (let i = 0; i < length; i++) {
            tpl += `
            <div class="messageList">
                <a href="${$.url.artDetails + 1}" class="message external">
                    <p class="Title">
                        <span class="name">《正义联盟》新版戈登曝光造型</span>
                        <span class="day">9/17</span>
                    </p>
                    <p class="details">DC漫改大作《正义联盟》导演扎克·施奈德昨日曝光该片两张最新宣传照，庆祝今年的蝙蝠侠日（9月17日）hahahahahahahahahahahahahahahahahahahahahahahahaha</p>
                    <span class="delete"></span>
                </a>
            </div>
            `
        }
        $contanier.append(tpl)
        $emptyBackground.hide()
    }
    createMessage()
})