{
    const $chargeBtn = $('#chargeOk')

    // 充值金额列表
    function addChargeList() {
        let tpl = ``
        let len = 5
        let priceArry = [20, 30, 50, 100, 200]
        for (let i = 1; i < len; i++) {
            let checked = i == 1 ? 'checked' : '';
            tpl += `
                <li>
                    <input type="radio" name="chargeRadio" id="chargeRadio-${i}" ${checked} data-productId=${i}>
                    <label class="splitline" for="chargeRadio-${i}"><span class="price">${$.formatAmount(priceArry[i])}</span><i class="fa fa-check"></i></label>
                </li>
            `
        }
        $('.chargelist').append(tpl)
    }
    addChargeList()


    // 获取充值面额ID
    function selectedProductId() {
        return $('input[type=radio]:checked').attr('data-productId')
    }




    $chargeBtn.click(function () {

        $.wxPay({
            type: 2,
            productId: selectedProductId(), //面额ID
            title: `个人中心-余额充值`

        }, () => {
            /*// 测试
                $('.chargelist .test').remove()
                let div = $('<div class="test" style="white-space: pre-line;font-size:.7rem;"></div>')
                $('.chargelist').append(div)
                div.text(`
                appId: ${res.appId}
                timeStamp: ${res.timestamp}
                nonceStr: ${res.nonceStr}
                package: prepay_id=${res.prepay_id}
                signType: ${res.signType}
                paySign: ${res.paySign}
            `)*/

            $.msg({
                text: '充值成功，可以买片啦！',
                timeout: 5000,
                callback: () => {
                    $.page_me_reload(); //刷新个人中心数据
                    $.router.back();
                }
            })
        })

    })



}