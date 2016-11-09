// 影视详情
{
    const movieId = $.GetQueryString('movieId')
    const $addCart = $('#addCart') //加入购物车按钮
    const $buy = $('#buy') //立即购买按钮
    const $feedback = $('#detail-tab3'); //反馈快捷标签
    const $feedbackContext = $('#feedbackContext') //反馈的内容
    const $feedbackSubmit = $('#feedbackSubmit') //反馈提交按钮

    // 开启loading效果
    $.showPreloader();
    // 迷你laoding
    // $.showIndicator();

    // 影视详情页
    let $details = $('.details')


    // 加入购物车
    function addCart() {
        $addCart.prop('disabled', true)

        function _fail() {
            $.alert('加入购物车失败，请稍后再试！')
            $addCart.prop('disabled', false)
        }

        $.ajax({
            url: "http://118.178.136.60:8001/rest/index/addMovie",
            data: {
                openId: $.openId,
                movieId: movieId
            },
            success: function (res) {
                // console.log(res);
                if (res.STATUS == 1) {
                    $.toast('加入购物车成功')
                } else {
                    _fail()
                }
            },
            error: function () {
                _fail()
            }
        });
    }

    // 打开视频
    function openVedio(url) {
        // $.alert('打开视频：' + url)
        window.location.href = url
    }


    // 页面添加数据
    function _updateDetailsPage(data) {
        const mov = data.MOVIE //当前电影数据
        const series = data.MOVIE_SERIES //当前电影选集数据

        // 加载二维码
        $('#qrcode').attr('src', data.QR_CODE)

        // 显示底部按钮
        $('#isbuy').removeClass('hide')

        // 会员隐藏二维码
        if (data.IS_SUBSCRIBE == 1) {
            $('#qrcodeBox').remove()
        }

        // 是否在购物车
        if (data.IS_CART == 1) {
            $('#addCart').remove()
        }

        // 是否已购
        if (data.IS_BUY == 1) {
            $('#isbuy').remove();
        } else {
            $('.numbox').hide();
        }

        // 解构绑定后台数据
        for (let key in mov) {
            let $dom = $('#' + key)
            if ($dom.length) {
                if ($dom[0].localName == 'img') {
                    $dom.attr('src', mov.poster)
                } else {
                    $dom.text(mov[key])
                }
            }
        }
        // 格式化价格
        let $price = $('#price')
        $price.text(Number($price.text()).toFixed(2))

        // 构建选集
        let numTpl = ``
        for (let i = 0; i < series.length; i++) {
            numTpl += `
                <a href="javascript:" class="num">${i+1}</a>
            `
        }
        $('.numbox').html(numTpl)


        // 购买绑定
        $details.on('click', '.button-group .btn', function () {
            let $this = $(this)

            // 立即购买
            if ($this.hasClass('buy')) {
                if (data.IS_SUBSCRIBE == 1) {
                    $.payment()
                } else {
                    $.msg('您还不是会员，无法购买，先扫描页面下方二维码成为会员吧！')
                }
            }

            // 加入购物车
            if ($this.hasClass('cart')) {
                if (data.IS_SUBSCRIBE == 1) {
                    addCart($this)

                } else {
                    $.msg('您还不是会员，无法加入购物车，先扫描页面下方二维码成为会员吧！')
                }
            }
        })

        // 选集绑定
        $details.on('click', '.num', function () {
            let index = $(this).index();
            var buttons = [{
                text: '主线资源',
                // bold: true,
                // color: 'danger',
                onClick: function () {
                    // $.alert("你选择了“主线资源“");
                    openVedio(series[index].resourceUrl)
                }
            }, {
                text: '备用地址1',
                onClick: function () {
                    // $.alert("你选择了“备用地址1“");
                    openVedio(series[index].otherOne)
                }
            }, {
                text: '备用地址2',
                onClick: function () {
                    // $.alert("你选择了“备用地址2“");
                    openVedio(series[index].otherTwo)
                }
            }, {
                text: '取消'
            }];
            $.actions(buttons);
        })
    }


    // 初始请求数据
    $.ajax({
        url: "http://118.178.136.60:8001/rest/index/getMovie",
        data: {
            movieId: movieId,
            openId: $.openId,
            oldOpenId: $.GetQueryString('oldOpenId')
        },
        success: (res) => {
            console.log(res);
            if (res.STATUS == 1) {
                _updateDetailsPage(res);
            } else {
                $.alert('没有该影片信息！', function () {
                    $.router.back()
                })
            }
        },
        error: (e) => {
            let str = `影视详情页获取失败，稍后再试！`
            console.log(str, e);
            $.alert(str, function () {
                $.router.back()
            })
        },
        complete: () => {
            $.hidePreloader();
        }
    });


    // 我要报错
    $feedback.on('click', '.sub-tag span', function () {
        $feedbackContext.val($feedbackContext.val() + '#' + $(this).text() + '#')
    })

    // 提交问题
    $feedbackSubmit.on('click', function () {
        let $this = $(this)

        if (!$feedbackContext.val()) {
            return
        }

        $this.prop('disabled', true)

        $.ajax({
            url: "http://118.178.136.60:8001/rest/index/feedback",
            data: {
                context: $('#feedbackContext').val(),
                movieId: movieId
            },
            success: function () {
                $.msg('谢谢你的反馈！')
                $feedbackContext.val('')
            },
            complete: function () {
                $this.prop('disabled', false)
            }
        });
    })

    // 点击我要报错时，隐藏加入购物车和立即购买按钮
    /*$('.tab-link').click(function(){
        let $this = $(this)
        if ($this.text()==='我要报错') {
            $('#isbuy').hide()
        }
        else{
            $('#isbuy').attr('style','')
        }
    })*/
}