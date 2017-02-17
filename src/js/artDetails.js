// 文章详情

{

    $.showPreloader();

    let qs = {
        id: $.GetQueryString('id'),
        articleId: $.GetQueryString('articleId'),
        articleUrl: `http://www.funying.cn/wx/rest/index/getArticle`,
        messageUrl: `http://www.funying.cn/wx/rest/user/systemMsgDetail`

    }

    $.ajax({
        url: qs.id ? qs.messageUrl : qs.articleUrl,
        data: {
            id: qs.id,
            articleId: qs.articleId,
            openId: $.openId,
            oldOpenId: $.GetQueryString('oldOpenId')
        },
        success: function (res) {
            console.log('详情数据：', res);

            // 文章详情 系统消息
            if (res.STATUS == 1) {
                render(res)
                return
            }

            // 没有数据
            $.alert('文章详情不存在！', function () {
                $.router.back();
            })
        },
        error: (e) => {
            let str = `文章详情获取失败，稍后再试！`
            console.log(str, e);
            $.alert(str, function () {
                $.router.back()
            })
        },
        complete: () => {
            $.hidePreloader();
        }
    });

    function render(res) {
        const data = res.ARTICLE || res.DATA

        $('title').text(data.title)

        $('.text').append(data.context)
        $('.time').text(data.updateTime)
        $('.Title').text(data.title)

        if (qs.articleId) {
            // 加载二维码
            $('#qrcode').attr('src', res.QR_CODE)

            // 判断是否会员，然后隐藏二维码
            if (res.IS_SUBSCRIBE != 1) {
                $('#SUBSCRIBE').init()
            }
        }

        // 分享配置
        $.shareConfig((res) => {
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
                wx.onMenuShareTimeline({ //分享到朋友圈
                    title: data.title
                });
                wx.onMenuShareAppMessage({ //分享给朋友
                    title: data.title,
                    desc: data.context
                });

            });
        })

    }
}