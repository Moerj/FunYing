setTimeout(function() {
    


    const $contanier = $('.message-contanier ul')
    // const $emptyBackground = $contanier.find('.empty')

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
                    <a href=${$.getArtDetails(d.id)} class="message external">
                        <p class="Title">
                            <span class="name">${d.title}</span>
                            <span class="day">${d.addTime}</span>
                        </p>
                        <p class="details">${d.context}</p>
                        <span class="delete" msgId=${d.id}></span>
                    </a>
                </li>
                `
            }
            return html
        },

        ajax: (data, callback) => {
            let newData = $.extend({}, data, {
                openId: $.openId
            })
            $.ajax({
                url: 'http://wechat.94joy.com/wx/rest/user/systemMsg',
                data: newData,
                success: (res) => {
                    console.log('系统消息：',res);
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
        let msgId = $deleteBtn.attr('msgId')
        $deleteBtn.parents('.messageList').remove();
        showEmpty()

        $.ajax({
            url: "http://wechat.94joy.com/wx/rest/user/delSystemMsg",
            data: {
                openId: $.openId,
                msgId: msgId
            },
            success: function (res) {
                // console.log(res);
                if (res.STATUS==1) {
                    console.log('id:'+msgId+' 消息删除成功!');
                }
            }
        });
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


},100);