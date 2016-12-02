"use strict";

// url加上openid
if (!location.search) {
    var newUrl = location.href + ("?openid=" + $.openId);
    history.replaceState({}, "", newUrl);
}

// 我的二维码
$.ajax({
    url: "http://wechat.94joy.com/wx/rest/user/getQrcode",
    data: {
        openId: $.openId
    },
    success: function success(res) {
        // console.log(res);
        $('#myqrcode').click(function () {
            // 二维码点击放大
            $(this).toggleClass('qrcodeBig');
        }).init(res.code);
    },
    error: function error(e) {
        console.error('我的二维码加载失败', e);
    }
});

// 头像
$.ajax({
    url: "http://wechat.94joy.com/wx/rest/user/index",
    data: {
        openId: $.openId
    },
    success: function success(res) {
        console.log('头像', res);
        if (res.STATUS == 1 && res.DATA) {
            var data = res.DATA;
            $('.headpic').init(data.headerImg); //个人中心用户头像
        } else {
            console.error('头像加载失败');
        }
    },
    error: function error(e) {
        console.error('头像加载失败');
    }
});