'use strict';

// 提现
$(function () {
    var $withdrawOk = $('#withdrawOk'); //提现按钮
    var $withdrawInput = $('#withdrawInput'); //提现金额输入框

    $withdrawOk.click(function () {
        if (!$withdrawInput.val()) {
            $.msg('提现金额不能为空');
        }
    });

    $withdrawInput.on('keyup', function () {
        $withdrawOk.toggleClass('active', Boolean($(this).val()));
    });

    /*$.ajax({
        type: "get",
        url: "url",
        data: "data",
        dataType: "dataType",
        success: function (res) {
            ajax(res);
        }
    });*/

    function ajax(res) {
        if (res.STATUS == 1) {
            $.msg('提现成功，荷包胀起来了！', 5000);
            setTimeout(function () {
                $.router.back();
            }, 5000);
        } else {
            $.msg('提现失败，请小主稍后再试！', 5000);
        }
    }
});
//# sourceMappingURL=withdraw.js.map
