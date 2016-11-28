"use strict";

// 文章详情

{
    (function () {
        var render = function render(res) {
            var data = res.ARTICLE;
            // console.log(data);

            // 页面标题
            $('title').text(data.title);

            $('.text').append(data.context);
            $('.time').text(data.updateTime);
            $('.Title').text(data.title);

            // 加载二维码
            $('#qrcode').attr('src', data.QR_CODE);

            // 判断是否会员，然后隐藏二维码
            if (res.IS_SUBSCRIBE == 1 && $.openId) {
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
                console.log('文章详情数据：', res);
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