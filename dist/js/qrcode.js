"use strict";

// url加上openid
if (!location.search) {
    var newUrl = location.href + ("?openid=" + $.openId);
    history.replaceState({}, "", newUrl);
}

// 我的二维码
$.ajax({
    url: "http://www.funying.cn/wx/rest/user/getQrcode",
    data: {
        openId: $.openId
    },
    success: function success(res) {
        console.log('二维码', res);

        var $codeImg = $('#myqrcode');

        if (res.STATUS == 1) {
            $codeImg.click(function () {
                // 二维码点击放大
                $(this).toggleClass('qrcodeBig');
            }).init(res.code);
        } else if (res.STATUS == 2) {
            $codeImg.after("<b>" + res.MSG + "</b>");
        }
    },
    error: function error(e) {
        console.error('我的二维码加载失败', e);
    }
});

// 头像
$.ajax({
    url: "http://www.funying.cn/wx/rest/user/index",
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