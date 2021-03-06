'use strict';

{

    // 充值金额列表
    var addChargeList = function addChargeList() {
        var tpl = '';
        var priceArry = [20, 50, 100, 200];
        for (var i = 0; i < priceArry.length; i++) {
            var checked = i == 0 ? 'checked' : '';
            var index = i + 1;
            tpl += '\n                <li>\n                    <input type="radio" name="chargeRadio" id="chargeRadio-' + index + '" ' + checked + ' data-productId=' + index + '>\n                    <label class="splitline" for="chargeRadio-' + index + '"><span class="price">' + $.formatAmount(priceArry[i]) + '</span><i class="fa fa-check"></i></label>\n                </li>\n            ';
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
            title: '\u4E2A\u4EBA\u4E2D\u5FC3-\u4F59\u989D\u5145\u503C'

        }, function () {
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
}
$('#feedbackSubmit').click(function () {

    $.ajax({
        url: "http://www.funying.cn/wx/rest/user/addFeedBack",
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
            url: "http://www.funying.cn/wx/rest/user/index",
            data: {
                openId: $.openId
            },
            success: function success(res) {
                // headerImg头像，nickName微信昵称，lucreAmount收益余额，充值余额rechargeAmount  账户余额totalAmount
                console.log('个人中心首页数据：', res);
                if (res.STATUS == 1 && res.DATA) {
                    var data = res.DATA;

                    // 根据id 加载后台数据
                    for (var key in data) {
                        $('#' + key).text(data[key]);
                    }

                    // 生成echart
                    var rechargeAmountVal = Number($('#rechargeAmount').text());
                    var lucreAmountVal = Number($('#lucreAmount').text());
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

                    // 充值页面的余额
                    $('.overage').init($.formatAmount(rechargeAmountVal + lucreAmountVal));

                    // 提现页面余额（可提现金额）
                    $('#withdraw-amount').init(lucreAmountVal);

                    //个人中心用户头像
                    $('.headpic').init(data.headerImg || '../images/icon/user.png');

                    // 二维码url加上openid
                    var $qrcodeLink = $('#entry-qrcode');
                    $qrcodeLink.attr('href', $qrcodeLink.attr('href') + ('?openid=' + $.openId));
                } else {
                    $.alert(res.MSG);
                }
            }
        });
    };

    $.page_me_reload();$uploadPicker.change(function () {

        // 将ftp返回的图片传给后台进行录入更新
        function _updateImg(imgUrl) {
            $.ajax({
                url: "http://www.funying.cn/wx/rest/user/updateImg",
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

        $.showPreloader('正在压缩图片');
        // 压缩
        lrz(fileObj[0], {
            width: 120
        }).then(function (rst) {
            // 处理成功会执行
            console.log('图片已压缩：', rst);

            formdata.append("imgFile", rst.file);
            $.showPreloader('正在上传头像');

            // 上传到ftp
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
                        _updateImg('http://www.funying.cn/img' + data[0].result);
                    }
                },
                error: function error() {
                    $.alert('上传失败，请稍后再试！');
                    console.error('ftp部分头像上传失败');
                    $.hidePreloader();
                }
            });
        }).catch(function (err) {
            // 处理失败会执行
            $.alert('图片压缩失败，请换一张试试');
            $.hidePreloader();
        }).always(function () {
            // 不管是成功失败，都会执行
        });

        return false;
    });
}
setTimeout(function () {

    function messageInit() {

        var $contanier = $('.message-contanier ul');

        new ScrollLoad({

            cache: false,

            scrollContanier: $contanier, //滚动父容器
            // maxload: 10,
            // perload: 7,

            // 配置渲染模板
            template: function template(data) {
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    var d = data[i];
                    if (d) {
                        html += '\n                        <li class="messageList">\n                            <a href=' + ('./articleDetails.html?id=' + d.id + '&oldOpenId=' + $.openId) + ' class="message external">\n                                <p class="Title">\n                                    <span class="name">' + (d.title ? d.title : '') + '</span>\n                                    <span class="day">' + d.addTime + '</span>\n                                </p>\n                                <p class="details">' + d.context + '</p>\n                                <span class="delete" msgId=' + d.id + '></span>\n                            </a>\n                        </li>\n                        ';
                    }
                }
                return html;
            },

            ajax: function ajax(callback) {

                $.ajax({
                    url: 'http://www.funying.cn/wx/rest/user/systemMsg',
                    data: {
                        openId: $.openId,
                        skip: this.currentPage, //当前页
                        limit: this.perload //每页条数
                    },
                    success: function success(res) {
                        console.log('系统消息：', res);
                        if (res.DATA.length) {
                            callback(res.DATA);
                        } else {
                            console.log('系统消息：没有数据');
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

        function showEmpty() {
            if ($contanier.children('.messageList').length == 0) {
                $contanier.hide();
            }
        }

        function deleteOneMsg(deleteBtn) {
            var $deleteBtn = $(deleteBtn);
            var msgId = $deleteBtn.attr('msgId');
            $deleteBtn.parents('.messageList').remove();
            showEmpty();

            $.ajax({
                url: "http://www.funying.cn/wx/rest/user/delSystemMsg",
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
        }

        $(document).on('swipeLeft', '.message', function () {
            $(this).addClass('showDelete');
        }).on('swipeRight', '.message', function () {
            $(this).removeClass('showDelete');
        }).on('click', '.messageList .delete', function () {
            deleteOneMsg(this);
            return false; //防冒泡
        });
    }

    $.pageInit({
        hash: 'page-message',
        entry: '#entry-message',
        init: function init() {
            messageInit();
        }
    });
}, 100);
setTimeout(function () {

    function myMovieLoad() {

        var $contanier = $('.myMovieList');

        new ScrollLoad({

            cache: false,

            scrollContanier: $contanier, //滚动父容器

            // 配置渲染模板
            template: function template(data) {
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    var d = data[i];
                    html += '\n                    <a class="box external" href="' + $.getMovDetails(d.id) + '">\n                        <div class="imgbox">\n                            <img src="' + d.poster + '" alt="">\n                        </div>\n                        <div class="info">\n                            <span class="Title">' + d.title + '</span>\n                            <p class="text">' + d.introduction + '</p>\n                            <span class="text2">' + $.getUpdateStatus(d.updateStatus, d.updateSite) + '</span>\n                        </div>\n                        <span class="info2">\n                            <span>\u4E0B\u5355\u65F6\u95F4: ' + d.updateTime + '</span>\n                            <span class="price">' + d.price + '</span>\n                        </span>\n                    </a>\n                    ';
                }
                return html;
            },

            ajax: function ajax(callback) {

                $.ajax({
                    url: 'http://www.funying.cn/wx/rest/user/myMovie',
                    data: {
                        state: 1, //我的影片
                        openId: $.openId,
                        skip: this.currentPage, //当前页
                        limit: this.perload //每页条数
                    },
                    success: function success(res) {
                        console.log('我的影片：', res);
                        if (res.DATA.length) {
                            callback(res.DATA);
                        } else {
                            $contanier.hide();
                            console.log('我的影片没有数据');
                        }
                    },
                    error: function error(e) {
                        console.warn('我的影片加载失败', e);
                        $.alert('加载失败，请稍后再试！');
                    }
                });
            }
        });
    }

    $.pageInit({
        hash: 'page-myMovie',
        entry: '#entry-myMovie',
        init: function init() {
            myMovieLoad();
        }
    });
}, 100);
// 收益明细
setTimeout(function () {

    // 收益明细页数据
    function entry() {
        new ScrollLoad({

            cache: false,

            scrollContanier: '#profitScrollContanier', //滚动父容器
            listContanier: '#profitList',
            // maxload: 10,
            // perload: 7,

            // 配置渲染模板
            template: function template(data) {
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    var d = data[i];

                    // 推客名
                    var name = d.one_level_amount || d.second_level_amount || d.three_level_amount || '';

                    var details = void 0; // 收益详情
                    var classType = void 0; // 推客等级
                    var amount = void 0; //额度

                    switch (Number(d.type)) {
                        case 1:
                            classType = 'one';
                            details = '\u4ECE\u4E00\u7EA7\u63A8\u5BA2' + name + '\u83B7\u53D6\u6536\u76CA';
                            amount = d.charge_amount;
                            break;
                        case 2:
                            classType = 'two';
                            details = '\u4ECE\u4E8C\u7EA7\u63A8\u5BA2' + name + '\u83B7\u53D6\u6536\u76CA';
                            amount = d.charge_amount;
                            break;
                        case 3:
                            classType = 'three';
                            details = '\u4ECE\u4E09\u7EA7\u63A8\u5BA2' + name + '\u83B7\u53D6\u6536\u76CA';
                            amount = d.charge_amount;
                            break;
                        case 4:
                            details = '\u63D0\u73B0';
                            amount = d.profit_amount;
                            classType = 'other';
                            break;
                        case 5:
                            details = '\u6D88\u8D39';
                            amount = d.profit_amount;
                            classType = 'other';
                            break;
                        case 6:
                            details = '\u5145\u503C';
                            amount = d.charge_amount;
                            classType = 'other';
                            break;
                        default:

                            break;
                    }

                    // 时间
                    var addTime = d.add_time.split(' ');
                    var day = addTime[0];
                    var time = addTime[1];

                    // 创建模板
                    html += '\n                    <li class=' + classType + '>\n                        <div class="date">\n                            <div class="day">' + day + '</div>\n                            <div class="time">' + time + '</div>\n                        </div>\n                        <div class="info">\n                            <img class="i1" src=' + (d.image || '../images/icon/user.png') + ' alt="">\n                            <div class="i2">\n                                <span class="num">' + (d.charge_amount ? '+' : '-') + amount + '</span>\n                                <span class="text">' + details + '</span>\n                            </div>\n                        </div>\n                    </li>\n                    ';
                }
                return html;
            },

            ajax: function ajax(callback) {

                $.ajax({
                    url: 'http://www.funying.cn/wx/rest/pay/detail',
                    data: {
                        openId: $.openId,
                        skip: this.currentPage, //当前页
                        limit: this.perload //每页条数
                    },
                    success: function success(res) {
                        console.log('收益明细：', res);
                        if (res.STATUS == 1) {
                            callback(res.data);

                            // 昨日收益
                            var yestAmt = res.yestAmt;
                            yestAmt = yestAmt >= 0 ? '+' + yestAmt : '-' + yestAmt;
                            $('#profit-yestAmt').text($.formatAmount(yestAmt));

                            // 累计收益
                            // $('#profit-LucreAmt').text($.formatAmount(res.LucreAmt))
                            $('#profit-LucreAmt').text($.formatAmount(res.oneAmt + res.secondAmt + res.threeAmt));

                            // 推客收益总和
                            $('#profit-oneAmt').text($.formatAmount(res.oneAmt));
                            $('#profit-secondAmt').text($.formatAmount(res.secondAmt));
                            $('#profit-threeAmt').text($.formatAmount(res.threeAmt));
                        } else {
                            console.log('收益明细没有数据');
                        }
                    },
                    error: function error(e) {
                        console.log(e);
                        $.alert('刷新失败，请稍后再试！');
                    },
                    complete: function complete() {}
                });
            }
        });
    }

    // 推客明细
    function twitter(pageId, type) {
        var TYPE = void 0;
        switch (Number(type)) {
            case 1:
                TYPE = '一';
                break;
            case 2:
                TYPE = '二';
                break;
            case 3:
                TYPE = '三';
                break;

            default:
                break;
        }
        $(pageId).find('.pageName').text('\u6211\u7684' + TYPE + '\u7EA7\u63A8\u5BA2');

        new ScrollLoad({
            scrollContanier: pageId + ' .con2', //滚动父容器
            listContanier: pageId + ' .list',
            cache: false,
            // maxload: 10,
            // perload: 7,

            // 配置渲染模板
            template: function template(data) {
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    var d = data[i];

                    // 推客名
                    var name = d.one_level_amount || d.second_level_amount || d.three_level_amount || '未知推客';

                    // 创建模板
                    html += '\n                    <li>\n                        <div class="info">\n                            <img src=' + (d.image || '../images/icon/user.png') + '>\n                            <div class="text">\n                                <span class="name">' + name + '</span>\n                                <span class="num">+' + d.charge_amount + '</span>\n                            </div>\n                        </div>\n                    </li>\n                    ';
                }
                return html;
            },

            ajax: function ajax(callback) {

                $.ajax({
                    url: 'http://www.funying.cn/wx/rest/pay/twitterDetail',
                    data: {
                        type: type,
                        openId: $.openId,
                        skip: this.currentPage, //当前页
                        limit: this.perload //每页条数
                    },
                    success: function success(res) {
                        console.log(type + '级推客：', res);
                        if (res.STATUS == 1) {
                            callback(res.data);

                            // 昨日收益
                            if (res.month) {
                                var month = $.formatAmount(res.month);
                                month = month >= 0 ? '+' + month : '-' + month;
                                $(pageId + ' .con1 .num').text(month);
                            }

                            // 累计收益
                            if (res.totalAmt) {
                                $(pageId + ' .con1 .total').text($.formatAmount(res.totalAmt));
                            }
                        } else {
                            console.log(TYPE + '\u7EA7\u63A8\u5BA2\u6CA1\u6709\u6570\u636E');
                        }
                    },
                    error: function error(e) {
                        console.log(e);
                        $.alert('刷新失败，请稍后再试！');
                    },
                    complete: function complete() {}
                });
            }
        });
    }

    function pageLoadAll() {
        entry();
        twitter('#page-profit-1', 1);
        twitter('#page-profit-2', 2);
        twitter('#page-profit-3', 3);
    }

    $.pageInit({
        hash: 'page-profit',
        entry: '#entry-profit',
        init: function init() {
            pageLoadAll();
        }
    });
}, 100);
// 提现
{
    //提现金额输入框

    var ajax_cash = function ajax_cash() {
        console.log($.openId);
        console.log($withdrawInput.val());
        $.showIndicator();
        $.ajax({
            url: "http://www.funying.cn/wx/rest/pay/cash",
            data: {
                openId: $.openId,
                price: $withdrawInput.val()
            },
            success: function success(res) {
                // console.log(res);
                if (res.STATUS == 1) {
                    $.msg('预约提现成功！', 5000);
                    setTimeout(function () {
                        $.page_me_reload(); //刷新个人中心数据
                        $.router.back();
                    }, 5000);
                } else {
                    $.msg('提现失败，请小主稍后再试！', 5000);
                }
            },
            error: function error() {
                $.alert('提现失败，服务器繁忙！');
            },
            complete: function complete() {
                $.hideIndicator();
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
        if ($withdrawInput.val() < 10) {
            $.msg('提现金额不能低于限制');
            return;
        }

        ajax_cash();
    });

    $withdrawInput.on('keyup', function () {
        var boolean = Boolean(!$(this).val());
        $withdrawOk.prop('disabled', boolean);
    });
}