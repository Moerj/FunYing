'use strict';

{
    (function () {

        // 充值金额列表
        var addChargeList = function addChargeList() {
            var tpl = '';
            var len = 5;
            var priceArry = [20, 30, 50, 100, 200];
            for (var i = 1; i < len; i++) {
                var checked = i == 1 ? 'checked' : '';
                tpl += '\n                <li>\n                    <input type="radio" name="chargeRadio" id="chargeRadio-' + i + '" ' + checked + ' data-price=' + priceArry[i] * 100 + '>\n                    <label class="splitline" for="chargeRadio-' + i + '"><span class="price">' + priceArry[i].toFixed(2) + '</span><i class="fa fa-check"></i></label>\n                </li>\n            ';
            }
            $('.chargelist').append(tpl);
        };

        // 选择充值面额，人民币-分
        var selectedPrice = function selectedPrice() {
            return parseInt($('input[type=radio]:checked').attr('data-price'));
        };

        // 统一下单接口


        var $chargeBtn = $('#chargeOk');
        var topay = {};
        addChargeList();$.ajax({
            url: "http://118.178.136.60:8001/rest/pay/toPay",
            data: {
                total_fee: selectedPrice(), //订单金额
                openId: $.openId,
                type: 2, //充值
                title: '个人中心-余额充值'
            },
            success: function success(res) {
                topay = res;
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
                    jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            },
            error: function error(e) {
                console.log('充值失败', e);
            }
        });

        // 确认充值
        $chargeBtn.click(function () {
            $.alert(topay.prepay_id)
            wx.chooseWXPay({
                appId: topay.appId,
                timestamp: topay.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符  
                nonceStr: topay.nonceStr, // 支付签名随机串，不长于 32 位  
                package: 'prepay_id=' + topay.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）  
                signType: topay.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'  
                paySign: topay.paySign, // 支付签名  
                success: function success(res) {
                    // 支付成功后的回调函数  
                    if (res.errMsg == "chooseWXPay:ok") {
                        //支付成功  
                        alert('支付成功');
                    } else {
                        alert(res.errMsg);
                    }
                },
                cancel: function cancel(res) {
                    //支付取消  
                    alert('支付取消');
                }
            });
        });
    })();
}
$('#feedbackSubmit').click(function () {

    $.ajax({
        url: "http://wechat.94joy.com/wx/rest/user/addFeedBack",
        data: {
            openId: $.openId,
            content: $('#feedbackText').val()
        },
        success: function success(res) {
            console.log(res);
            if (res.STATUS == 1) {
                $.msg({
                    text: '小编已接到圣旨，谢谢反馈！',
                    timeout: 3000,
                    callback: function callback() {
                        $.router.back();
                    }
                });
            } else {
                $.msg('反馈出现了问题，估计系统繁忙，请稍后试试！');
            }
        },
        error: function error(e) {
            console.log(e);
            $.msg('系统繁忙，请稍后试试！');
        }
    });
});
// 个人中心

{
    (function () {

        // 账户余额
        var makePie = function makePie(data) {
            // 拼图
            var newdata = [];
            for (var i = 0; i < data.length; i++) {
                newdata.push({
                    value: data[i].value,
                    itemStyle: {
                        normal: {
                            color: data[i].color
                        }
                    }
                });
            }

            var option = {
                silent: true,
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: newdata
                }]
            };

            window.echarts.init($('.echart')[0]).setOption(option);
        };

        //头像上传


        var $uploadPicker = $('#headpicUpload'); //头像input file
        var $headimg = $('#headerImg'); //头像img

        // 我的页面数据
        $.page_me_reload = function () {
            $.ajax({
                url: "http://wechat.94joy.com/wx/rest/user/index",
                data: {
                    openId: $.openId
                },
                success: function success(res) {
                    // headerImg头像，nickName微信昵称，lucreAmount收益余额，充值余额rechargeAmount
                    console.log('个人中心首页数据：', res);
                    if (res.STATUS == 1 && res.DATA) {
                        var data = res.DATA;
                        for (var key in data) {
                            $('#' + key).text(data[key]);
                        }

                        var rechargeAmountVal = Number($('#rechargeAmount').text());
                        var lucreAmountVal = Number($('#lucreAmount').text());
                        var total = (rechargeAmountVal + lucreAmountVal).toFixed(2);
                        $('#total').text(total);
                        $('.headpic').init(data.headerImg);

                        var pieData = [{
                            name: '收益余额',
                            color: '#F36C60',
                            value: lucreAmountVal
                        }, {
                            name: '充值余额',
                            color: '#FFC107',
                            value: rechargeAmountVal
                        }];

                        makePie(pieData);
                    } else {
                        $.alert('用户信息读取失败');
                    }
                }
            });
        };

        $.page_me_reload();

        // 我的二维码
        $.ajax({
            url: "http://wechat.94joy.com/wx/rest/user/getQrcode",
            data: {
                openId: $.openId
            },
            success: function success(res) {
                // console.log(res);
                $('#myqrcode').init(res.code);
            },
            error: function error(e) {
                console.error('我的二维码加载失败', e);
            }
        });$uploadPicker.change(function () {
            function _updateImg(imgUrl) {
                $.ajax({
                    url: "http://118.178.136.60:8001/rest/user/updateImg",
                    data: {
                        openId: $.openId,
                        img: imgUrl
                    },
                    success: function success(res) {
                        if (res.STATUS == 1) {
                            $.toast("头像上传成功");
                        } else {
                            $.alert('上传失败，请稍后再试！');
                        }
                    },
                    error: function error() {
                        $.alert('上传失败，请稍后再试！');
                        console.error('接口部分头像上传失败');
                    },
                    complete: function complete() {
                        $.hidePreloader();
                    }
                });
            }

            var formdata = new FormData();
            var v_this = $(this);
            var fileObj = v_this.get(0).files;
            var url = "http://118.178.136.60:8080/ercsvc-upload/upload";
            var localImgSrc = window.URL.createObjectURL($uploadPicker[0].files[0]);
            formdata.append("imgFile", fileObj[0]);
            $.showPreloader('正在上传头像');
            $.ajax({
                url: url,
                type: 'post',
                data: formdata,
                cache: false,
                contentType: false,
                processData: false,
                dataType: "json",
                success: function success(data) {
                    console.log('上传结果：', data);
                    if (data[0].result) {
                        $headimg.attr('src', localImgSrc); //更新新头像
                        _updateImg('http://wechat.94joy.com/image' + data[0].result);
                    }
                },
                error: function error() {
                    $.alert('上传失败，请稍后再试！');
                    console.error('ftp部分头像上传失败');
                    $.hidePreloader();
                }
            });
            return false;
        });
    })();
}
{
    (function () {
        var showEmpty = function showEmpty() {
            if ($contanier.children('.messageList').length == 0) {
                $contanier.hide();
            }
        };

        var deleteOneMsg = function deleteOneMsg(deleteBtn) {
            var $deleteBtn = $(deleteBtn);
            var msgId = $deleteBtn.attr('msgId');
            $deleteBtn.parents('.messageList').remove();
            showEmpty();

            $.ajax({
                url: "http://wechat.94joy.com/wx/rest/user/delSystemMsg",
                data: {
                    openId: $.openId,
                    msgId: msgId
                },
                success: function success(res) {
                    // console.log(res);
                    if (res.STATUS == 1) {
                        console.log('id:' + msgId + ' 消息删除成功!');
                    }
                }
            });
        };

        var $contanier = $('.message-contanier ul');
        // const $emptyBackground = $contanier.find('.empty')

        new ScrollLoad({

            scrollContanier: $contanier, //滚动父容器
            // maxload: 10,
            // perload: 7,

            // 配置渲染模板
            template: function template(data) {
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    var d = data[i];
                    html += '\n                <li class="messageList">\n                    <a href=' + $.getArtDetails(d.id) + ' class="message external">\n                        <p class="Title">\n                            <span class="name">' + d.title + '</span>\n                            <span class="day">' + d.addTime + '</span>\n                        </p>\n                        <p class="details">' + d.context + '</p>\n                        <span class="delete" msgId=' + d.id + '></span>\n                    </a>\n                </li>\n                ';
                }
                return html;
            },

            ajax: function ajax(data, callback) {
                var newData = $.extend({}, data, {
                    openId: $.openId
                });
                $.ajax({
                    type: "get",
                    // url: '../json/message.json',
                    url: 'http://wechat.94joy.com/wx/rest/user/systemMsg',
                    data: newData,
                    success: function success(res) {
                        // console.log(res);
                        if (res.DATA) {
                            callback(res.DATA);
                        } else {
                            console.log('路由页面没有数据>>');
                        }
                    },
                    error: function error(e) {
                        console.log(e);
                        $.alert('刷新失败，请稍后再试！');
                    },
                    complete: function complete() {
                        showEmpty();
                    }
                });
            }
        });

        $(document).on('swipeLeft', '.message', function () {
            $(this).addClass('showDelete');
        }).on('swipeRight', '.message', function () {
            $(this).removeClass('showDelete');
        }).on('click', '.messageList .delete', function () {
            deleteOneMsg(this);
            return false; //防冒泡
        });
    })();
}
{
    (function () {
        var $contanier = $('.myMovieList');

        $.showIndicator();

        new ScrollLoad({

            scrollContanier: $contanier, //滚动父容器

            // 配置渲染模板
            template: function template(data) {
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    var d = data[i];
                    html += '\n                <a class="box external" href="' + $.getMovDetails(d.id) + '">\n                    <div class="imgbox">\n                        <img src="' + d.poster + '" alt="">\n                    </div>\n                    <div class="info">\n                        <span class="Title">' + d.title + '</span>\n                        <p class="text">' + d.introduction + '</p>\n                        <span class="text2">更新到第' + d.updateSite + '集</span>\n                    </div>\n                    <span class="info2">\n                        <span>下单时间:<span class="day">9/12</span> <span class="time">9:30</span></span>\n                        <span class="price">' + d.price + '</span>\n                    </span>\n                </a>\n                ';
                }
                return html;
            },

            ajax: function ajax(data, callback) {
                $.ajax({
                    type: "get",
                    url: 'http://wechat.94joy.com/wx/rest/user/myMovie',
                    // url: '../json/message.json',
                    data: {
                        openId: $.openId,
                        state: 1 //我的影片
                    },
                    success: function success(res) {
                        // console.log(res);
                        if (res.DATA) {
                            callback(res.DATA);
                        } else {
                            console.log('我的影片没有数据');
                        }
                    },
                    error: function error(e) {
                        console.log('我的影片加载失败', e);
                        // $.alert('刷新失败，请稍后再试！')
                    },
                    complete: function complete() {
                        if ($contanier.find('.box').length == 0) {
                            $contanier.hide();
                        }
                    }
                });
            }
        });
    })();
}
// 收益明细
{
    var createProfitInList = function createProfitInList(data) {
        var index = data.index;
        var length = data.length;
        var tpl = '';
        for (var i = 0; i < length; i++) {
            tpl += '\n            <li>\n                <div class="info">\n                    <img src="../images/index-banner.jpg" alt="">\n                    <div class="text">\n                        <span class="name">哇哈哈</span>\n                        <span class="num">+20.00</span>\n                    </div>\n                </div>\n            </li>\n            ';
        }
        $('.profit-in').eq(index).find('.list').append(tpl);
    };

    $('.childPageEnter').click(function () {
        var $this = $(this);
        var index = $this.index();
    });

    createProfitInList({
        index: 0,
        length: 3
    });
    createProfitInList({
        index: 1,
        length: 2
    });
    createProfitInList({
        index: 2,
        length: 5
    });
}
// 提现
{
    (function () {
        //提现金额输入框

        var ajax_cash = function ajax_cash() {
            console.log($.openId);
            console.log($withdrawInput.val());
            $.ajax({
                url: "http://118.178.136.60:8001/rest/pay/cash",
                data: {
                    openId: $.openId,
                    price: $withdrawInput.val()
                },
                success: function success(res) {
                    // console.log(res);
                    if (res.STATUS == 1) {
                        $.msg('提现成功，荷包胀起来了！', 5000);
                        setTimeout(function () {
                            $.page_me_reload();
                            $.router.back();
                        }, 5000);
                    } else {
                        $.msg('提现失败，请小主稍后再试！', 5000);
                    }
                }
            });
        };

        var $withdrawOk = $('#withdrawOk'); //提现按钮
        var $withdrawInput = $('#withdrawInput');

        $withdrawOk.click(function () {
            if (!$withdrawInput.val()) {
                $.msg('提现金额不能为空');
                return;
            }

            ajax_cash();
        });

        $withdrawInput.on('keyup', function () {
            var boolean = Boolean(!$(this).val());
            $withdrawOk.prop('disabled', boolean);
        });
    })();
}