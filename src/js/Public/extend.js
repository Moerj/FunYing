// jq 对象新增方法 ==================

// dom加载ajax数据
$.fn.init = function (data) {

    if (data) {
        for (let i = 0; i < this.length; i++) {
            let thisJq = $(this[i])
                // console.log(thisJq);
            if (this[i].localName === 'img') {
                thisJq.attr('src', data)
            } else if (thisJq.val() == undefined) {
                thisJq.text(data)
            } else {
                thisJq.val(data)
            }
            thisJq.removeClass('hide').show()
        }
    }else{
        this.removeClass('hide')
    }

}



// $ 下的公共方法 ==============

// 取queryString
$.GetQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// 获取初始openid
$.openId = $.GetQueryString('openid')
if ($.openId === null) { // from sessionStorage
    $.openId = sessionStorage.openId

} else { // from queryString
    sessionStorage.openId = $.openId
}

// 测试用
// if (!$.openId) {
//     $.openId = 'o-IOqxK0lxh9KSLbpxdU8QKILd9Q'
// }




// 生成影视详情的url
$.getMovDetails = function (id) {
    // http://localhost:3000/html/articleDetails.html?articleId=1&oldOpenId=123
    return `./movieDetails.html?movieId=${id}&oldOpenId=${$.openId}`
}

// 生成文章详情
$.getArtDetails = function (id) {
    return `./articleDetails.html?articleId=${id}&oldOpenId=${$.openId}`
}


$.msg = function (opts, timeout) {
    let text = opts.text || opts
    let title = opts.title || '温馨提示'
    let callback = opts.callback

    if (timeout === undefined) {
        timeout = opts.timeout || 2000
    }

    let $tpl = $(`
        <div class="mask">
            <div class="msg">
                <p class="msg-title">${title}</p>
                <p class="msg-text">${text}</p>
            </div>
        </div>
    `);

    $('body').append($tpl)

    if (timeout) {
        setTimeout(function () {
            $tpl.remove()
            if (callback) {
                callback()
            }
        }, timeout);
    }
}

// 付款
$.payment = function (OPTS) {

    // 余额支付
    function _payByRecharge() {
        $.showPreloader('购买中，稍等...');
        $.ajax({
            url: "http://wechat.94joy.com/wx/rest/pay/payByRecharge",
            data: {
                openId: $.openId,
                movieId: OPTS.movieId
            },
            success: (res) => {
                console.log('余额支付接口', res);
                if (res.STATUS == 1) {
                    OPTS.success();

                } else { // 支付失败
                    $.msg('账户余额不足，请充值或使用微信支付！', 5000)
                }
            },
            error: () => {
                $.msg('系统繁忙，请稍后再尝试支付操作！')
            },
            complete: () => {
                $.hidePreloader();
            }
        });
    }

    var buttons = [{
        text: '账户余额支付',
        onClick: function () {
            _payByRecharge()
        }
    }, {
        text: '微信支付',
        onClick: function () {
            OPTS.wxPay.productId = OPTS.productId
            $.wxPay(OPTS.wxPay, () => {
                OPTS.success();
            })

        }
    }, {
        text: '取消'
    }];
    $.actions(buttons);
}


// 统一下单接口
$.wxPay = function (payOption, payCallback) {
    let data = {
        type: payOption.type, //充值类型 1,影片购买  2，充值
        title: payOption.title,
        openId: $.openId,
        productId: payOption.productId,
        url: location.href.split('#')[0]
    }
    console.log('统一下单接口参数', data);

    $.showIndicator()
    $.ajax({
        url: "http://wechat.94joy.com/movie/rest/pay/toPay",
        data: data,
        success: (res) => {
            console.log('统一下单接口：', res);

            // 微信config接口注入权限验证配置
            wx.config({
                // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: res.appId, // 必填，公众号的唯一标识
                timestamp: res.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.nonceStr, // 必填，生成签名的随机串
                signature: res.signature, // 必填，签名，见附录1
                jsApiList: [
                        "chooseWXPay"
                    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

            // 通过ready接口处理成功验证
            wx.ready(() => {
                // 发起一个微信支付请求
                wx.chooseWXPay({
                    appId: res.appId,
                    timestamp: res.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符  
                    nonceStr: res.nonceStr, // 支付签名随机串，不长于 32 位  
                    package: 'prepay_id=' + res.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）  
                    signType: res.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'  
                    paySign: res.paySign, // 支付签名  
                    success: function (res) {
                        // 支付成功后的回调函数  
                        if (res.errMsg == "chooseWXPay:ok") {

                            //支付成功  
                            payCallback()

                        } else {
                            alert(res.errMsg);
                        }
                    },
                    cancel: function (res) {
                        //支付取消  
                        $.msg('支付取消');
                    },
                    fail: function () {
                        $.msg('充值失败，请小主稍后再试！', 5000)
                    }
                });
            })


        },
        error: (e) => {
            $.alert('充值服务初始化失败，请稍后再试！')
            console.log('充值失败', e);
        },
        complete: () => {
            $.hideIndicator()
        }
    });
}


$.pageInit = function (opt) {

    // 点击入口进入模块
    $(opt.entry).one('click', function () {
        opt.init()
    })

    // 初始刷新已进入此模块
    if (location.hash.indexOf(opt.hash) > 0) {
        opt.init()
        $(opt.entry).off('click')
    }
}

// 格式化价格
$.formatAmount = function(num){
    num = Number(num)
    if (num) {
        return num.toFixed(2)
    }
    return '--'
}

/**
 * @param updateStatus 更新状态 1更新中 0已完结
 * @param updateSite 更新到的集数
 * @return 返回更新状态字符串
 */
$.getUpdateStatus = function(updateStatus,updateSite){
    if (updateStatus==1) {
        return updateSite?`更新到第${updateSite}集`:`更新中`
    }else{
        return `已完结`
    }
}
