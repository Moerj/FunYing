'use strict';

// 影视详情
{
    (function () {

        // 加入购物车
        var addCart = function addCart() {
            $addCart.prop('disabled', true);

            function _fail() {
                $.alert('加入购物车失败，请稍后再试！');
                $addCart.prop('disabled', false);
            }

            $.ajax({
                url: "http://wechat.94joy.com/wx/rest/index/addMovie",
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
        };

        // 打开视频


        var openVedio = function openVedio(url) {
            // $.alert('打开视频：' + url)
            window.location.href = url;
        };

        // 页面添加数据


        var _updateDetailsPage = function _updateDetailsPage(data) {
            var mov = data.MOVIE; //当前电影数据
            var series = data.MOVIE_SERIES; //当前电影选集数据

            // 加载二维码
            $('#qrcode').attr('src', data.QR_CODE);

            // 显示底部按钮
            $Buttons.removeClass('hide');

            // 会员隐藏二维码
            if (data.IS_SUBSCRIBE == 1) {
                $('#qrcodeBox').remove();
            }

            // 是否在购物车
            if (data.IS_CART == 1) {
                $('#addCart').remove();
            }

            // 是否已购
            if (data.IS_BUY == 1) {
                $Buttons.remove();
            } else {
                $('.numbox').hide();
            }

            // 解构绑定后台数据
            for (var key in mov) {
                var $dom = $('#' + key);
                if ($dom.length) {
                    if ($dom[0].localName == 'img') {
                        $dom.attr('src', mov.poster);
                    } else {
                        $dom.text(mov[key]);
                    }
                }
            }
            // 格式化价格
            var $price = $('#price');
            $price.text(Number($price.text()).toFixed(2));

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
                        $.payment(movieId, function () {
                            $Buttons.remove();
                            $.msg('该影片购买成功,您可以在详情页查看资源地址了！', 5000);
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
                    // bold: true,
                    // color: 'danger',
                    onClick: function onClick() {
                        // $.alert("你选择了“主线资源“");
                        openVedio(series[index].resourceUrl);
                    }
                }, {
                    text: '备用地址1',
                    onClick: function onClick() {
                        // $.alert("你选择了“备用地址1“");
                        openVedio(series[index].otherOne);
                    }
                }, {
                    text: '备用地址2',
                    onClick: function onClick() {
                        // $.alert("你选择了“备用地址2“");
                        openVedio(series[index].otherTwo);
                    }
                }, {
                    text: '取消'
                }];
                $.actions(buttons);
            });
        };

        // 初始请求数据


        var movieId = $.GetQueryString('movieId');
        var $addCart = $('#addCart'); //加入购物车按钮
        var $Buttons = $('#isbuy'); //立即购买按钮
        var $feedback = $('#detail-tab3'); //反馈快捷标签
        var $feedbackContext = $('#feedbackContext'); //反馈的内容
        var $feedbackSubmit = $('#feedbackSubmit'); //反馈提交按钮

        // 开启loading效果
        $.showPreloader();
        // 迷你laoding
        // $.showIndicator();

        // 影视详情页
        var $details = $('.details');$.ajax({
            url: "http://wechat.94joy.com/wx/rest/index/getMovie",
            data: {
                movieId: movieId,
                openId: $.openId,
                oldOpenId: $.GetQueryString('oldOpenId')
            },
            success: function success(res) {
                console.log(res);
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
                url: "http://wechat.94joy.com/wx/rest/index/feedback",
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
                $Buttons.hide()
            }
            else{
                $Buttons.attr('style','')
            }
        })*/
    })();
}
//# sourceMappingURL=movDetails.js.map
