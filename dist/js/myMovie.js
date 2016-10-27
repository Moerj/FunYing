'use strict';

{
    (function () {

        // 创建电影列表
        var createMyMovie = function createMyMovie(data) {
            var tpl = '';
            var length = 3;
            for (var i = 0; i < length; i++) {
                tpl += '\n            <a class="box" href="#">\n                <div class="imgbox">\n                    <img src="../images/index-banner.jpg" alt="">\n                </div>\n                <div class="info">\n                    <span class="Title">迷失东京</span>\n                    <p class="text">人生在世，孤苦无比，如果得知原有些人和你一般孤苦，是否心里会好受些？看《迷失东京》前，未曾料想会收获这样一种感觉。</p>\n                    <span class="text2">更新到第3集</span>\n                </div>\n                <span class="info2">\n                    <span>下单时间:<span class="day">9/12</span><span class="time">9:13</span></span>\n                    <span class="price">15.99</span>\n                </span>\n            </a>\n            ';
            }
            $('.myMovieList').append(tpl).removeClass('empty');
        };
        // createMyMovie();


        // 清空所有电影列表


        var emptyMyMovie = function emptyMyMovie() {
            $('.myMovieList').empty().addClass('empty');
        };

        var $contanier = $('.myMovieList');

        $.showIndicator();

        new ScrollLoad({

            scrollContanier: $contanier, //滚动父容器

            // 配置渲染模板
            template: function template(data) {
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    var d = data[i];
                    html += '\n                <a class="box external" href="' + ($.url.movDetails + d.id) + '">\n                    <div class="imgbox">\n                        <img src="' + d.poster + '" alt="">\n                    </div>\n                    <div class="info">\n                        <span class="Title">' + d.title + '</span>\n                        <p class="text">' + d.introduction + '</p>\n                        <span class="text2">更新到第' + d.updateSite + '集</span>\n                    </div>\n                    <span class="info2">\n                        <span>下单时间:<span class="day">9/12</span> <span class="time">9:30</span></span>\n                        <span class="price">' + d.price + '</span>\n                    </span>\n                </a>\n                ';
                }
                return html;
            },

            ajax: function ajax(data, callback) {
                $.ajax({
                    type: "get",
                    url: '../json/message.json',
                    data: data,
                    success: function success(res) {
                        if (res.DATA) {
                            callback(res.DATA);
                        } else {
                            $.alert('没有数据了');
                        }
                    },
                    error: function error(e) {
                        console.log(e);
                        $.alert('刷新失败，请稍后再试！');
                    },
                    complete: function complete() {
                        $contanier.toggleClass('empty', Boolean($contanier.children().length));
                        $.hideIndicator();
                    }
                });
            }
        });
    })();
}