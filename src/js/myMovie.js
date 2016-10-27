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
                    $contanier.toggleClass('empty',Boolean($contanier.children().length))
                    $.hideIndicator()
                }
            });
        }
    })

    // 创建电影列表
    function createMyMovie(data) {
        let tpl = ``
        let length = 3;
        for (let i = 0; i < length; i++) {
            tpl += `
            <a class="box" href="#">
                <div class="imgbox">
                    <img src="../images/index-banner.jpg" alt="">
                </div>
                <div class="info">
                    <span class="Title">迷失东京</span>
                    <p class="text">人生在世，孤苦无比，如果得知原有些人和你一般孤苦，是否心里会好受些？看《迷失东京》前，未曾料想会收获这样一种感觉。</p>
                    <span class="text2">更新到第3集</span>
                </div>
                <span class="info2">
                    <span>下单时间:<span class="day">9/12</span><span class="time">9:13</span></span>
                    <span class="price">15.99</span>
                </span>
            </a>
            `
        }
        $('.myMovieList').append(tpl).removeClass('empty')
    }
    // createMyMovie();


    // 清空所有电影列表
    function emptyMyMovie() {
        $('.myMovieList').empty().addClass('empty');
    }
}