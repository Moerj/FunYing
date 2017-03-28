'use strict';

// 文章详情

{
    var render = function render(res) {
        var data = res.ARTICLE || res.DATA;

        $('title').text(data.title);

        $('.text').append(data.context);
        $('.time').text(data.updateTime);
        $('.Title').text(data.title);

        if (qs.articleId) {
            // 加载二维码
            $('#qrcode').attr('src', res.QR_CODE);

            // 判断是否会员，然后隐藏二维码
            if (res.IS_SUBSCRIBE != 1) {
                $('#SUBSCRIBE').init();
            }
        }

        // 分享配置
        $.shareConfig(function (res) {
            // console.log('分享配置', res);
            wx.config({
                // debug: true,
                appId: res.appId, // 必填，公众号的唯一标识
                timestamp: res.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.noncestr, // 必填，生成签名的随机串
                signature: res.signature, // 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
            });
            wx.ready(function () {
                var config = {
                    title: data.title,
                    desc: $.htmlFilter(data.context),
                    imgUrl: $('img')[0].src
                };
                //分享到朋友圈
                wx.onMenuShareTimeline(config);

                //分享给朋友
                wx.onMenuShareAppMessage(config);
            });
        });
    };

    $.showPreloader();

    var qs = {
        id: $.GetQueryString('id'),
        articleId: $.GetQueryString('articleId'),
        articleUrl: 'http://www.funying.cn/wx/rest/index/getArticle',
        messageUrl: 'http://www.funying.cn/wx/rest/user/systemMsgDetail'

    };

    $.ajax({
        url: qs.id ? qs.messageUrl : qs.articleUrl,
        data: {
            id: qs.id,
            articleId: qs.articleId,
            openId: $.openId,
            oldOpenId: $.GetQueryString('oldOpenId')
        },
        success: function success(res) {
            console.log('详情数据：', res);

            // 文章详情 系统消息
            if (res.STATUS == 1) {
                render(res);
                return;
            }

            // 没有数据
            $.alert('文章详情不存在！', function () {
                $.router.back();
            });
        },
        error: function error(e) {
            var str = '\u6587\u7AE0\u8BE6\u60C5\u83B7\u53D6\u5931\u8D25\uFF0C\u7A0D\u540E\u518D\u8BD5\uFF01';
            console.log(str, e);
            $.alert(str, function () {
                $.router.back();
            });
        },
        complete: function complete() {
            $.hidePreloader();
        }
    });
}