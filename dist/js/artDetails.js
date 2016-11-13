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

        $.showPreloader();

        $.ajax({
            type: "get",
            url: "http://wechat.94joy.com/wx/rest/index/getArticle",
            data: {
                articleId: $.GetQueryString('articleId'),
                openId: $.openId,
                oldOpenId: $.GetQueryString('oldOpenId')
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
//# sourceMappingURL=artDetails.js.map
