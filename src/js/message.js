$(function () {

    const $contanier = $('.message-contanier ul')
    const $emptyBackground = $contanier.find('.empty')

    $.showIndicator()

    let loader = new ScrollLoad({

        scrollContanier: $contanier, //滚动父容器
        // maxload: 10,
        // perload: 7,

        // 配置渲染模板
        template: (data) => {
            let html = '';
            for (let i = 0; i < data.length; i++) {
                let d = data[i]
                html += `
                <li class="messageList">
                    <a href="${$.url.artDetails + d.id}" class="message external">
                        <p class="Title">
                            <span class="name">${d.title}</span>
                            <span class="day">${d.addTime}</span>
                        </p>
                        <p class="details">${d.introduction}</p>
                        <span class="delete"></span>
                    </a>
                </li>
                `
            }
            return html
        },

        ajax: (data, callback) => {
            $.ajax({
                type: "get",
                url: '../json/message.json',
                data: data,
                success: (res) => {
                    if (res.DATA) {
                        callback(res.DATA)
                    } else {
                        $.alert('没有数据了')
                    }
                },
                error: (e) => {
                    console.log(e);
                    $.alert('刷新失败，请稍后再试！')
                },
                complete: () => {
                    if ($contanier.children().length == 0) {
                        $contanier.hide();
                    }
                    $.hideIndicator()
                }
            });
        }
    })



    $(document)
        .on('swipeLeft', '.message', function () {
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


})