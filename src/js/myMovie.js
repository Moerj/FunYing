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
                <a class="box external" href="${$.url.movDetails + d.id}">
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
                    $contanier.toggleClass('empty',!!!$contanier.children().length)
                    $.hideIndicator()
                }
            });
        }
    })

}