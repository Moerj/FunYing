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

    // 确认充值
    $chargeBtn.click(function () {
        $.ajax({
            url: "http://118.178.136.60:8001/rest/pay/toPay",
            data: {
                total_fee: selectedPrice(),
                openId: $.openId,
                // movieId: 1,
                title: `个人中心-余额充值`
            },
            success: function (res) {
                if (res.STATUS == 1) {
                    $.msg('充值成功，可以买片啦！', 5000)
                    setTimeout(function () {
                        $.router.back();
                    }, 5000);
                } else {
                    $.msg('充值失败，请小主稍后再试！', 5000)
                }
            }
        });
    })


    
}