setTimeout(function () {



    function messageInit() {

        const $contanier = $('.message-contanier ul')

        new ScrollLoad({

            cache: false,

            scrollContanier: $contanier, //滚动父容器
            // maxload: 10,
            // perload: 7,

            // 配置渲染模板
            template: (data) => {
                let html = '';
                for (let i = 0; i < data.length; i++) {
                    let d = data[i]
                    if (d) {
                        html += `
                        <li class="messageList">
                            <a href=${`./articleDetails.html?id=${d.id}&oldOpenId=${$.openId}`} class="message external">
                                <p class="Title">
                                    <span class="name">${d.title?d.title:''}</span>
                                    <span class="day">${d.addTime}</span>
                                </p>
                                <p class="details">${d.context}</p>
                                <span class="delete" msgId=${d.id}></span>
                            </a>
                        </li>
                        `
                    }
                }
                return html
            },

            ajax: function (callback) {

                $.ajax({
                    url: 'http://www.funying.cn/wx/rest/user/systemMsg',
                    data: {
                        openId: $.openId,
                        skip: this.currentPage, //当前页
                        limit: this.perload //每页条数
                    },
                    success: (res) => {
                        console.log('系统消息：', res);
                        if (res.DATA.length) {
                            callback(res.DATA)
                        } else {
                            console.log('系统消息：没有数据');
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
                url: "http://www.funying.cn/wx/rest/user/delSystemMsg",
                data: {
                    openId: $.openId,
                    msgId: msgId
                },
                success: function (res) {
                    // console.log(res);
                    if (res.STATUS == 1) {
                        console.log('id:' + msgId + ' 消息删除成功!');
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

    }

    $.pageInit({
        hash: 'page-message',
        entry: '#entry-message',
        init: () => {
            messageInit()
        }
    })

}, 100);