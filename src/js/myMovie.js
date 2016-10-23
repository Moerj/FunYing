{
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
    createMyMovie();


    // 清空所有电影列表
    function emptyMyMovie() {
        $('.myMovieList').empty().addClass('empty');
    }
}