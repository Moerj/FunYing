'use strict';

$(function () {
    var $chargeBtn = $('#chargeOk');

    /*$.ajax({
        type: "get",
        url: "url",
        data: "data",
        dataType: "dataType",
        success: function (res) {
            submit(res);
        }
    });*/

    function submit(res) {
        if (res.STATUS == 1) {
            $.msg('充值成功，可以买片啦！', 5000);
            setTimeout(function () {
                $.router.back();
            }, 5000);
        } else {
            $.msg('充值失败，请小主稍后再试！', 5000);
        }
    }

    function addChargeList() {
        var tpl = '';
        var len = 5;
        var priceArry = [20, 30, 50, 100, 200];
        for (var i = 1; i < len; i++) {
            var checked = i == 1 ? 'checked' : '';
            tpl += '\n                <li>\n                    <input type="radio" name="chargeRadio" id="chargeRadio-' + i + '" ' + checked + '>\n                    <label class="splitline" for="chargeRadio-' + i + '"><span class="price">' + priceArry[i].toFixed(2) + '</span><i class="fa fa-check"></i></label>\n                </li>\n            ';
        }
        $('.chargelist').append(tpl);
    }
    addChargeList();
});
//# sourceMappingURL=charge.js.map
