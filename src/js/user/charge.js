{
    const $chargeBtn = $('#chargeOk')
    let topay = {}

    // 充值金额列表
    function addChargeList() {
        let tpl = ``
        let len = 5
        let priceArry = [20, 30, 50, 100, 200]
        for (let i = 1; i < len; i++) {
            let checked = i == 1 ? 'checked' : '';
            tpl += `
                <li>
                    <input type="radio" name="chargeRadio" id="chargeRadio-${i}" ${checked} data-price=${priceArry[i]*100}>
                    <label class="splitline" for="chargeRadio-${i}"><span class="price">${priceArry[i].toFixed(2)}</span><i class="fa fa-check"></i></label>
                </li>
            `
        }
        $('.chargelist').append(tpl)
    }
    addChargeList()

    // 选择充值面额，人民币-分
    function selectedPrice() {
        return parseInt($('input[type=radio]:checked').attr('data-price'))
    }

    // 统一下单接口
    $.ajax({
        url: "http://118.178.136.60:8001/rest/pay/toPay",
        data: {
            total_fee: selectedPrice(),//订单金额
            openId: $.openId,
            type: 2, //充值
            title: `个人中心-余额充值`
        },
        success: (res) => {
            topay = res
            console.log(res);
            // if (res.STATUS == 1) {
            //     $.msg('充值成功，可以买片啦！', 5000)
            //     setTimeout(function () {
            //         $.router.back();
            //     }, 5000);
            // } else {
            //     $.msg('充值失败，请小主稍后再试！', 5000)
            // }

            wx.config({
                // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: res.appId, // 必填，公众号的唯一标识
                timestamp: res.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.nonceStr, // 必填，生成签名的随机串
                signature: res.paySign, // 必填，签名，见附录1
                jsApiList: [
                        "chooseWXPay"
                    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

        },
        error: (e) => {
            console.log('充值失败', e);
        }
    });

    // 确认充值
    $chargeBtn.click(function () {
        wx.chooseWXPay({
            appId: topay.appId,
            timestamp: topay.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符  
            nonceStr: topay.nonceStr, // 支付签名随机串，不长于 32 位  
            package: 'prepay_id=' + topay.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）  
            signType: topay.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'  
            paySign: topay.paySign, // 支付签名  
            success: function (res) {
                // 支付成功后的回调函数  
                if (res.errMsg == "chooseWXPay:ok") {
                    //支付成功  
                    alert('支付成功');
                } else {
                    alert(res.errMsg);
                }
            },
            cancel: function (res) {
                //支付取消  
                alert('支付取消');
            }
        });
    })



}