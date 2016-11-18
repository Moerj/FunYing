{

    function pageInit() {

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
                            <span class="text2">更新到第${d.updateSite}集</span>
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

            ajax: (data, callback) => {
                $.ajax({
                    url: 'http://wechat.94joy.com/wx/rest/user/myMovie',
                    data: {
                        openId: $.openId,
                        state: 1 //我的影片
                    },
                    success: (res) => {
                        // console.log('我的影片：',res);
                        if (res.DATA) {
                            callback(res.DATA)
                        } else {
                            console.log('我的影片没有数据');
                        }
                    },
                    error: (e) => {
                        console.log('我的影片加载失败', e);
                        // $.alert('刷新失败，请稍后再试！')
                    },
                    complete: () => {
                        if ($contanier.find('.box').length == 0) {
                            $contanier.hide()
                        }
                    }
                });
            }
        })
    }



    // 点击个人中心的收益明细入口后，才加载收益明细模块数据
    $('#myMovieEntry').one('click', function () {
        pageInit()
    })

    // 初始已进入此模块
    if (location.hash.indexOf('page-myMovie') > 0) {
        pageInit()
    }


}