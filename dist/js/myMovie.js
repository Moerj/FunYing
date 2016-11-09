'use strict';

{
    (function () {
        var $contanier = $('.myMovieList');

        $.showIndicator();

        new ScrollLoad({

            scrollContanier: $contanier, //滚动父容器

            // 配置渲染模板
            template: function template(data) {
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    var d = data[i];
                    html += '\n                <a class="box external" href="' + $.getMovDetails(d.id) + '">\n                    <div class="imgbox">\n                        <img src="' + d.poster + '" alt="">\n                    </div>\n                    <div class="info">\n                        <span class="Title">' + d.title + '</span>\n                        <p class="text">' + d.introduction + '</p>\n                        <span class="text2">更新到第' + d.updateSite + '集</span>\n                    </div>\n                    <span class="info2">\n                        <span>下单时间:<span class="day">9/12</span> <span class="time">9:30</span></span>\n                        <span class="price">' + d.price + '</span>\n                    </span>\n                </a>\n                ';
                }
                return html;
            },

            ajax: function ajax(data, callback) {
                $.ajax({
                    type: "get",
                    url: 'http://118.178.136.60:8001/rest/user/myMovie',
                    // url: '../json/message.json',
                    data: {
                        openId: $.openId,
                        state: 1 //我的影片
                    },
                    success: function success(res) {
                        // console.log(res);
                        if (res.DATA) {
                            callback(res.DATA);
                        } else {
                            console.log('我的影片没有数据');
                        }
                    },
                    error: function error(e) {
                        console.log('我的影片加载失败', e);
                        // $.alert('刷新失败，请稍后再试！')
                    },
                    complete: function complete() {
                        if ($contanier.find('.box').length == 0) {
                            $contanier.hide();
                        }
                    }
                });
            }
        });
    })();
}