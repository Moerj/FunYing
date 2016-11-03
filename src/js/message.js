$(function () {

    const $contanier = $('.message-contanier ul')
    const $emptyBackground = $contanier.find('.empty')

    new ScrollLoad({

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
            let newData = $.extend({}, data, {
                openId: window.openId
            })
            $.ajax({
                type: "get",
                // url: '../json/message.json',
                url: 'http://118.178.136.60:8001/rest/user/systemMsg',
                data: newData,
                success: (res) => {
                    // console.log(res);
                    if (res.DATA) {
                        callback(res.DATA)
                    } else {
                        console.log('路由页面没有数据>>');
                    }
                },
                error: (e) => {
                    console.log(e);
                    $.alert('刷新失败，请稍后再试！')
                },
                complete: () => {
                    showEmpty()
                }
            });
        }
    })

    function showEmpty() {
        if ($contanier.children('.messageList').length == 0) {
            $contanier.hide();
        }
    }

    function deleteOneMsg(deleteBtn) {
        let $deleteBtn = $(deleteBtn)
        let msgId = ''
        $deleteBtn.parents('.messageList').remove();
        showEmpty()
        // $.ajax({
        //     url: "http://118.178.136.60:8001/rest/user/delSystemMsg",
        //     data: {
        //         openId: window.openId,
        //         msgId: msgId
        //     },
        //     dataType: "dataType",
        //     success: function (res) {
        //         console.log(res);
        //     }
        // });
    }



    $(document)
        .on('swipeLeft', '.message', function () {
            $(this).addClass('showDelete')
        })
        .on('swipeRight', '.message', function () {
            $(this).removeClass('showDelete')
        })
        .on('click', '.messageList .delete', function () {
            deleteOneMsg(this);
            return false; //防冒泡
        })


})