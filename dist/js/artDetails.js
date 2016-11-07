"use strict";

// 文章详情

{
    (function () {
        var render = function render(res) {
            var data = res.ARTICLE;
            // console.log(data);
            $('.text').append(data.context);
            $('.time').text(data.updateTime);
            $('.Title').text(data.title);

            // 判断是否会员，然后隐藏二维码
            if (res.IS_SUBSCRIBE) {
                $('#SUBSCRIBE').hide();
            }
        };

        // 判断是否有oldOpenId  
        // const oldId = sessionStorage.oldOpenId

        // 如果有oldOpenId，将其拼接到url参数，以供分享朋友圈调用参数
        // if (oldId && location.search.indexOf('oldOpenId')==-1) {
        //     let url = window.location.href
        //     history.pushState({}, 0, url + '&oldOpenId=' + oldId);
        // }

        $.showPreloader();

        $.ajax({
            type: "get",
            url: "http://118.178.136.60:8001/rest/index/getArticle",
            data: {
                articleId: $.GetQueryString('articleId'),
                openId: window.openId,
                oldOpenId: window.openId
            },
            success: function success(res) {
                // console.log(res);
                if (res.STATUS == 1) {
                    render(res);
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