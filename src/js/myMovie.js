{
    const $contanier = $('.myMovieList')

    $.showIndicator()

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
                        <span>下单时间:<span class="day">9/12</span> <span class="time">9:30</span></span>
                        <span class="price">${d.price}</span>
                    </span>
                </a>
                `
            }
            return html
        },

        ajax: (data, callback) => {
            $.ajax({
                type: "get",
                url: 'http://118.178.136.60:8001/rest/user/myMovie',
                // url: '../json/message.json',
                data: {
                    openId: $.openId,
                    state: 1 //我的影片
                },
                success: (res) => {
                    // console.log(res);
                    if (res.DATA) {
                        callback(res.DATA)
                    } else {
                        console.log(window.location.hash + '没有数据');
                    }
                },
                error: (e) => {
                    console.log(e);
                    $.alert('刷新失败，请稍后再试！')
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