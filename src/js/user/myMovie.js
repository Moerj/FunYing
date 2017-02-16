setTimeout(function () {



    function myMovieLoad() {

        const $contanier = $('.myMovieList')


        new ScrollLoad({

            scrollContanier: $contanier, //滚动父容器

            // 配置渲染模板
            template: (data) => {
                let html = '';
                for (let i = 0; i < data.length; i++) {
                    let d = data[i]
                    html += `
                    <a class="box external" href="${$.getMovDetails(d.id)}">
                        <div class="imgbox">
                            <img src="${d.poster}" alt="">
                        </div>
                        <div class="info">
                            <span class="Title">${d.title}</span>
                            <p class="text">${d.introduction}</p>
                            <span class="text2">${$.getUpdateStatus(d.updateStatus,d.updateSite)}</span>
                        </div>
                        <span class="info2">
                            <span>下单时间: ${d.updateTime}</span>
                            <span class="price">${d.price}</span>
                        </span>
                    </a>
                    `
                }
                return html
            },

            ajax: function (callback) {

                $.ajax({
                    url: 'http://www.funying.cn/wx/rest/user/myMovie',
                    data: {
                        state: 1, //我的影片
                        openId: $.openId,
                        skip: this.currentPage, //当前页
                        limit: this.perload //每页条数
                    },
                    success: (res) => {
                        console.log('我的影片：', res);
                        if (res.DATA.length) {
                            callback(res.DATA)
                        } else {
                            $contanier.hide()
                            console.log('我的影片没有数据');
                        }

                    },
                    error: (e) => {
                        console.warn('我的影片加载失败', e);
                        $.alert('加载失败，请稍后再试！')
                    }
                });
            }
        })
    }



    $.pageInit({
        hash: 'page-myMovie',
        entry: '#entry-myMovie',
        init: () => {
            myMovieLoad()
        }
    })


}, 100);