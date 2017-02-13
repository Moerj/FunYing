'use strict';

// 影视详情
setTimeout(function () {

    var movieId = $.GetQueryString('movieId');
    var $addCart = $('#addCart'); //加入购物车按钮
    var $feedback = $('#detail-tab3'); //反馈快捷标签
    var $feedbackContext = $('#feedbackContext'); //反馈的内容
    var $feedbackSubmit = $('#feedbackSubmit'); //反馈提交按钮
    var $tabs = $('.tabs'); //tab区域

    // 开启loading效果
    $.showPreloader();
    // 迷你laoding
    // $.showIndicator();

    // 影视详情页
    var $details = $('.details');

    // 加入购物车
    function addCart() {
        $addCart.prop('disabled', true);

        function _fail() {
            $.alert('加入购物车失败，请稍后再试！');
            $addCart.prop('disabled', false);
        }

        $.ajax({
            url: "http://www.funying.cn/wx/rest/index/addMovie",
            data: {
                openId: $.openId,
                movieId: movieId
            },
            success: function success(res) {
                // console.log(res);
                if (res.STATUS == 1) {
                    $.toast('加入购物车成功');
                } else {
                    _fail();
                }
            },
            error: function error() {
                _fail();
            }
        });
    }

    // 打开视频
    function openVedio(url) {
        // $.alert('打开视频：' + url)
        window.location.href = url;
    }

    // 页面添加数据
    function _updateDetailsPage(data) {
        var mov = data.MOVIE; //当前电影数据
        var series = data.MOVIE_SERIES; //当前电影选集数据

        // 页面标题
        $('title').text(data.MOVIE.title);

        // 加载二维码
        $('#qrcode').attr('src', data.QR_CODE);

        // 显示底部按钮
        $tabs.removeClass('isBuy');

        // 作为分享页
        if (!$.openId) {
            $('.tab-link').last().hide(); //我要报错标签页
        }

        // 二维码隐藏
        if (data.IS_SUBSCRIBE == 1) {
            $('#qrcodeBox').remove(); //二维码
        }

        // 是否显示我要报错
        if (data.IS_SUBSCRIBE == 1 && data.IS_BUY == 1) {
            $('.tab-link').last().init(); //我要报错标签页
        }

        // 是否在购物车
        if (data.IS_CART == 1) {
            $('#addCart').remove();
        }

        // 是否已购
        if (data.IS_BUY == 1) {
            // 隐藏购买按钮，并调整布局
            $tabs.addClass('isBuy');
        } else {
            $('.numbox').hide();
        }

        // 更新状态
        $('#getUpdateStatus').init($.getUpdateStatus(mov.updateStatus, mov.updateSite));

        // 解构绑定后台数据
        for (var key in mov) {
            var $dom = $('#' + key);
            if ($dom.length) {
                if ($dom.attr('id') == 'stills') {
                    // $dom.attr('src', mov.stills)
                    $dom.css({
                        background: 'url("' + mov.stills + '")',
                        bacckgoundSize: 'cover'
                    });
                } else {
                    $dom.html(mov[key]);
                }
            }
        }
        // 格式化价格
        var $price = $('#price');
        $price.init($.formatAmount($price.text()));

        // 构建选集
        var numTpl = '';
        for (var i = 0; i < series.length; i++) {
            numTpl += '\n                <a href="javascript:" class="num">' + (i + 1) + '</a>\n            ';
        }
        $('.numbox').html(numTpl);

        // 购买绑定
        $details.on('click', '.button-group .btn', function () {
            var $this = $(this);

            // 立即购买
            if ($this.hasClass('buy')) {
                if (data.IS_SUBSCRIBE == 1) {
                    // 支付
                    $.payment({
                        productId: movieId,
                        success: function success() {
                            $tabs.addClass('isBuy');
                            $('.numbox').show();
                            $.msg('该影片购买成功,您可以在详情页查看资源地址了！', 5000);
                        },
                        // 微信支付的参数
                        wxPay: {
                            type: 1, //影片购买
                            title: '影视详情-影片购买'
                        }
                    });
                } else {
                    $.msg('您还不是会员，无法购买，先扫描页面下方二维码成为会员吧！');
                }
            }

            // 加入购物车
            if ($this.hasClass('cart')) {
                if (data.IS_SUBSCRIBE == 1) {
                    addCart($this);
                } else {
                    $.msg('您还不是会员，无法加入购物车，先扫描页面下方二维码成为会员吧！');
                }
            }
        });

        // 选集绑定
        $details.on('click', '.num', function () {
            var index = $(this).index();
            var buttons = [{
                text: '主线资源',
                onClick: function onClick() {
                    // $.alert("你选择了“主线资源“");
                    openVedio(series[index].resourceUrl);
                }
            }];
            if (series[index].otherOne) {
                buttons.push({
                    text: '备用地址1',
                    onClick: function onClick() {
                        // $.alert("你选择了“备用地址1“");
                        openVedio(series[index].otherOne);
                    }
                });
            }
            if (series[index].otherTwo) {
                buttons.push({
                    text: '备用地址2',
                    onClick: function onClick() {
                        // $.alert("你选择了“备用地址2“");
                        openVedio(series[index].otherTwo);
                    }
                });
            }
            buttons.push({
                text: '取消'
            });

            $.actions(buttons);
        });

        // 分享配置
        $.shareConfig(function (res) {
            console.log('分享配置', res);
            wx.config({
                // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: res.appId, // 必填，公众号的唯一标识
                timestamp: res.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.noncestr, // 必填，生成签名的随机串
                signature: res.signature, // 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
            });
            wx.ready(function () {
                wx.onMenuShareTimeline({ //分享到朋友圈
                    title: mov.title,
                    imgUrl: mov.stills
                });
                wx.onMenuShareAppMessage({ //分享给朋友
                    title: mov.title,
                    desc: mov.star,
                    imgUrl: mov.stills
                });
            });
        });
    }

    // 初始请求数据
    $.ajax({
        url: "http://www.funying.cn/wx/rest/index/getMovie",
        // cache:false,
        data: {
            movieId: movieId,
            openId: $.openId,
            oldOpenId: $.GetQueryString('oldOpenId')
        },
        success: function success(res) {
            console.log('影视详情数据：', res);
            if (res.STATUS == 1) {
                _updateDetailsPage(res);
            } else {
                $.alert('没有该影片信息！', function () {
                    $.router.back();
                });
            }
        },
        error: function error(e) {
            var str = '影视详情页获取失败，稍后再试！';
            console.log(str, e);
            $.alert(str, function () {
                $.router.back();
            });
        },
        complete: function complete() {
            $.hidePreloader();
        }
    });

    // 我要报错
    $feedback.on('click', '.sub-tag span', function () {
        $feedbackContext.val($feedbackContext.val() + '#' + $(this).text() + '#');
    });

    // 提交问题
    $feedbackSubmit.on('click', function () {
        var $this = $(this);

        if (!$feedbackContext.val()) {
            return;
        }

        $this.prop('disabled', true);

        $.ajax({
            url: "http://www.funying.cn/wx/rest/index/feedback",
            data: {
                context: $('#feedbackContext').val(),
                movieId: movieId
            },
            success: function success() {
                $.msg('谢谢你的反馈！');
                $feedbackContext.val('');
            },
            complete: function complete() {
                $this.prop('disabled', false);
            }
        });
    });

    // 点击我要报错时，隐藏加入购物车和立即购买按钮
    /*$('.tab-link').click(function(){
        let $this = $(this)
        if ($this.text()==='我要报错') {
            $tabs.addClass('isBuy')
        }
        else{
            $tabs.removeClass('isBuy')
        }
    })*/
}, 100);