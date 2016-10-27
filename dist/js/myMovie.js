'use strict';

{
    // 创建电影列表
    var createMyMovie = function createMyMovie(data) {
        var tpl = '';
        var length = 3;
        for (var i = 0; i < length; i++) {
            tpl += '\n            <a class="box" href="#">\n                <div class="imgbox">\n                    <img src="../images/index-banner.jpg" alt="">\n                </div>\n                <div class="info">\n                    <span class="Title">迷失东京</span>\n                    <p class="text">人生在世，孤苦无比，如果得知原有些人和你一般孤苦，是否心里会好受些？看《迷失东京》前，未曾料想会收获这样一种感觉。</p>\n                    <span class="text2">更新到第3集</span>\n                </div>\n                <span class="info2">\n                    <span>下单时间:<span class="day">9/12</span><span class="time">9:13</span></span>\n                    <span class="price">15.99</span>\n                </span>\n            </a>\n            ';
        }
        $('.myMovieList').append(tpl).removeClass('empty');
    };

    // 清空所有电影列表
    var emptyMyMovie = function emptyMyMovie() {
        $('.myMovieList').empty().addClass('empty');
    };

    createMyMovie();
}