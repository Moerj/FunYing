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
                tpl += '\n                <li>\n                    <input type="radio" name="chargeRadio" id="chargeRadio-' + i + '" ' + checked + ' data-productId=' + i + '>\n                    <label class="splitline" for="chargeRadio-' + i + '"><span class="price">' + priceArry[i].toFixed(2) + '</span><i class="fa fa-check"></i></label>\n                </li>\n            ';
            }
            $('.chargelist').append(tpl);
        };

        // 获取充值面额ID
        var selectedProductId = function selectedProductId() {
            return $('input[type=radio]:checked').attr('data-productId');
        };

        var $chargeBtn = $('#chargeOk');
        addChargeList();

        $chargeBtn.click(function () {

            $.wxPay({
                type: 2,
                productId: selectedProductId(), //面额ID
                title: '个人中心-余额充值'

            }, function () {
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
                    callback: function callback() {
                        $.page_me_reload(); //刷新个人中心数据
                        $.router.back();
                    }
                });
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

                        // 根据id 加载后台数据
                        for (var key in data) {
                            $('#' + key).text(data[key]);
                        }

                        // 充值页面的余额
                        $('#rechargeAmount-2').init(data['rechargeAmount'].toFixed(2));

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

                        // 生成echart
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
                        _updateImg('http://wechat.94joy.com/img' + data[0].result);
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
                            $.page_me_reload(); //刷新个人中心数据
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