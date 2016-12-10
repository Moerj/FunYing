{
    const $chargeBtn = $('#chargeOk')

    // 充值金额列表
    function addChargeList() {
        let tpl = ``
        let priceArry = [20, 50, 100, 200]
        for (let i = 0; i < priceArry.length; i++) {
            let checked = i == 0 ? 'checked' : '';
            let index = i+1
            tpl += `
                <li>
                    <input type="radio" name="chargeRadio" id="chargeRadio-${index}" ${checked} data-productId=${index}>
                    <label class="splitline" for="chargeRadio-${index}"><span class="price">${$.formatAmount(priceArry[i])}</span><i class="fa fa-check"></i></label>
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