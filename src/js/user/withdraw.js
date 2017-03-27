// 提现
{
    const $withdrawOk = $('#withdrawOk') //提现按钮
    const $withdrawInput = $('#withdrawInput') //提现金额输入框

    function ajax_cash() {
        console.log($.openId);
        console.log($withdrawInput.val());
        $.showIndicator()
        $.ajax({
            url: "http://www.funying.cn/wx/rest/pay/cash",
            data: {
                openId: $.openId,
                price: $withdrawInput.val()
            },
            success:  (res) =>{
                // console.log(res);
                if (res.STATUS == 1) {
                    $.msg('预约提现成功！',5000)
                    setTimeout(function() {
                        $.page_me_reload();//刷新个人中心数据
                        $.router.back();
                    }, 5000);
                } else {
                    $.msg('提现失败，请小主稍后再试！',5000)
                }
            },
            error:() => {
                $.alert('提现失败，服务器繁忙！')
            },
            complete:() => {
                $.hideIndicator()
            }
        });

    }

    $withdrawOk.click(function () {
        if (!$withdrawInput.val()) {
            $.msg('提现金额不能为空')
            return
        }
        if ($withdrawInput.val()<10) {
            $.msg('提现金额不能低于限制')
            return
        }

        ajax_cash();
    })

    $withdrawInput.on('keyup', function () {
        let boolean = Boolean(!$(this).val())
        $withdrawOk.prop('disabled', boolean)
    })


}