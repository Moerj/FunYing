// 提现
{
    const $withdrawOk = $('#withdrawOk') //提现按钮
    const $withdrawInput = $('#withdrawInput') //提现金额输入框

    function ajax_cash() {
        console.log($.openId);
        console.log($withdrawInput.val());
        $.ajax({
            url: "http://118.178.136.60:8001/rest/pay/cash",
            data: {
                openId: $.openId,
                price: $withdrawInput.val()
            },
            success: function (res) {
                // console.log(res);
                if (res.STATUS == 1) {
                    $.msg('提现成功，荷包胀起来了！',5000)
                    setTimeout(function() {
                        $.page_me_reload();
                        $.router.back();
                    }, 5000);
                } else {
                    $.msg('提现失败，请小主稍后再试！',5000)
                }
            }
        });

    }

    $withdrawOk.click(function () {
        if (!$withdrawInput.val()) {
            $.msg('提现金额不能为空')
            return
        }

        ajax_cash();
    })

    $withdrawInput.on('keyup', function () {
        let boolean = Boolean(!$(this).val())
        $withdrawOk.prop('disabled', boolean)
    })


}