"use strict";

{
    (function () {
        var render = function render(data) {
            // console.log(data);
            $('.text').text(data.context);
            $('.time').text(data.updateTime);
            $('.Title').text(data.title);

            // 判断是否会员，然后隐藏二维码
            // if () {

            // }
        };

        $.showPreloader();

        var idsearch = window.location.search.split('=');
        var id = idsearch[idsearch.length - 1];
        $.ajax({
            type: "get",
            url: "http://118.178.136.60:8001/rest/index/getArticle",
            data: {
                articleId: id
            },
            success: function success(res) {
                console.log(res);
                if (res.STATUS == 1) {
                    render(res.ARTICLE);
                } else {
                    $.alert('文章详情不存在！', function () {
                        $.router.back();
                    });
                }
            },
            error: function error(e) {
                var str = "文章详情获取失败，稍后再试！";
                console.log(str, e);
                $.alert(str, function () {
                    $.router.back();
                });
            },
            complete: function complete() {
                $.hidePreloader();
            }
        });
    })();
}