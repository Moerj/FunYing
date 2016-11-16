{
    const $chargeBtn = $('#chargeOk')

    // 充值金额列表
    function addChargeList() {
        let tpl = ``
        let len = 5
        let priceArry = [20, 30, 50, 100, 200]
        for (let i = 1; i < len; i++) {
            let checked = i == 1 ? 'checked' : '';
            tpl += `
                <li>
                    <input type="radio" name="chargeRadio" id="chargeRadio-${i}" ${checked} data-productId=${i}>
                    <label class="splitline" for="chargeRadio-${i}"><span class="price">${priceArry[i].toFixed(2)}</span><i class="fa fa-check"></i></label>
                </li>
            `
        }
        $('.chargelist').append(tpl)
    }
    addChargeList()


    // 获取充值面额ID
    function selectedProductId() {
        return $('input[type=radio]:checked').attr('data-productId')
    }




    $chargeBtn.click(function () {

        $.wxPay({
            type: 2,
            productId: selectedProductId(), //面额ID
            title: `个人中心-余额充值`

        }, () => {
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
                callback: () => {
                    $.page_me_reload(); //刷新个人中心数据
                    $.router.back();
                }
            })
        })

    })



}
$('#feedbackSubmit').click(function () {

    $.ajax({
        url: "http://wechat.94joy.com/wx/rest/user/addFeedBack",
        data: {
            openId: $.openId,
            content: $('#feedbackText').val()
        },
        success: (res) => {
            console.log(res);
            if (res.STATUS == 1) {
                $.msg({
                    text: '小编已接到圣旨，谢谢反馈！',
                    timeout: 3000,
                    callback: () => {
                        $.router.back();
                    }
                })
            } else {
                $.msg('反馈出现了问题，估计系统繁忙，请稍后试试！')
            }
        },
        error: (e) => {
            console.log(e);
            $.msg('系统繁忙，请稍后试试！')
        }
    });

})
// 个人中心

{

    const $uploadPicker = $('#headpicUpload'); //头像input file
    const $headimg = $('#headerImg'); //头像img

    // 我的页面数据
    $.page_me_reload = function () {
        $.ajax({
            url: "http://wechat.94joy.com/wx/rest/user/index",
            data: {
                openId: $.openId
            },
            success: function (res) {
                // headerImg头像，nickName微信昵称，lucreAmount收益余额，充值余额rechargeAmount
                console.log('个人中心首页数据：', res);
                if (res.STATUS == 1 && res.DATA) {
                    let data = res.DATA

                    // 根据id 加载后台数据
                    for (let key in data) {
                        $('#' + key).text(data[key])
                    }

                    // 充值页面的余额
                    $('#rechargeAmount-2').init(data['rechargeAmount'].toFixed(2))

                    let rechargeAmountVal = Number($('#rechargeAmount').text())
                    let lucreAmountVal = Number($('#lucreAmount').text())
                    let total = (rechargeAmountVal + lucreAmountVal).toFixed(2)
                    $('#total').text(total)
                    $('.headpic').init(data.headerImg)

                    let pieData = [{
                        name: '收益余额',
                        color: '#F36C60',
                        value: lucreAmountVal
                    }, {
                        name: '充值余额',
                        color: '#FFC107',
                        value: rechargeAmountVal
                    }]

                    // 生成echart
                    makePie(pieData);

                } else {
                    $.alert('用户信息读取失败')
                }
            }
        });
    }

    $.page_me_reload()


    // 我的二维码
    $.ajax({
        url: "http://wechat.94joy.com/wx/rest/user/getQrcode",
        data: {
            openId: $.openId
        },
        success: function (res) {
            // console.log(res);
            $('#myqrcode').init(res.code)
        },
        error: function (e) {
            console.error('我的二维码加载失败', e);
        }
    });

    // 账户余额
    function makePie(data) {
        // 拼图
        let newdata = []
        for (let i = 0; i < data.length; i++) {
            newdata.push({
                value: data[i].value,
                itemStyle: {
                    normal: {
                        color: data[i].color
                    }
                }
            })
        }

        let option = {
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
    }




    //头像上传
    $uploadPicker.change(function () {
        function _updateImg(imgUrl) {
            $.ajax({
                url: "http://118.178.136.60:8001/rest/user/updateImg",
                data: {
                    openId: $.openId,
                    img: imgUrl
                },
                success: function (res) {
                    if (res.STATUS == 1) {
                        $.toast("头像上传成功");
                    } else {
                        $.alert('上传失败，请稍后再试！')
                    }
                },
                error: () => {
                    $.alert('上传失败，请稍后再试！')
                    console.error('接口部分头像上传失败')
                },
                complete: () => {
                    $.hidePreloader();
                }
            });
        }

        let formdata = new FormData();
        let v_this = $(this);
        let fileObj = v_this.get(0).files;
        let url = "http://118.178.136.60:8080/ercsvc-upload/upload";
        let localImgSrc = window.URL.createObjectURL($uploadPicker[0].files[0]);
        formdata.append("imgFile", fileObj[0]);
        $.showPreloader('正在上传头像')
        $.ajax({
            url: url,
            type: 'post',
            data: formdata,
            cache: false,
            contentType: false,
            processData: false,
            dataType: "json",
            success: (data) => {
                console.log('上传结果：', data);
                if (data[0].result) {
                    $headimg.attr('src', localImgSrc); //更新新头像
                    _updateImg('http://wechat.94joy.com/img' + data[0].result)
                }
            },
            error: () => {
                $.alert('上传失败，请稍后再试！')
                console.error('ftp部分头像上传失败')
                $.hidePreloader();
            }
        });
        return false;
    });



}
setTimeout(function() {
    


    const $contanier = $('.message-contanier ul')
    // const $emptyBackground = $contanier.find('.empty')

    new ScrollLoad({

        scrollContanier: $contanier, //滚动父容器
        // maxload: 10,
        // perload: 7,

        // 配置渲染模板
        template: (data) => {
            let html = '';
            for (let i = 0; i < data.length; i++) {
                let d = data[i]
                html += `
                <li class="messageList">
                    <a href=${$.getArtDetails(d.id)} class="message external">
                        <p class="Title">
                            <span class="name">${d.title}</span>
                            <span class="day">${d.addTime}</span>
                        </p>
                        <p class="details">${d.context}</p>
                        <span class="delete" msgId=${d.id}></span>
                    </a>
                </li>
                `
            }
            return html
        },

        ajax: (data, callback) => {
            let newData = $.extend({}, data, {
                openId: $.openId
            })
            $.ajax({
                url: 'http://wechat.94joy.com/wx/rest/user/systemMsg',
                data: newData,
                success: (res) => {
                    console.log('系统消息：',res);
                    if (res.DATA) {
                        callback(res.DATA)
                    } else {
                        console.log('路由页面没有数据>>');
                    }
                },
                error: (e) => {
                    console.log(e);
                    $.alert('刷新失败，请稍后再试！')
                },
                complete: () => {
                    showEmpty()
                }
            });
        }
    })

    function showEmpty() {
        if ($contanier.children('.messageList').length == 0) {
            $contanier.hide();
        }
    }

    function deleteOneMsg(deleteBtn) {
        let $deleteBtn = $(deleteBtn)
        let msgId = $deleteBtn.attr('msgId')
        $deleteBtn.parents('.messageList').remove();
        showEmpty()

        $.ajax({
            url: "http://wechat.94joy.com/wx/rest/user/delSystemMsg",
            data: {
                openId: $.openId,
                msgId: msgId
            },
            success: function (res) {
                // console.log(res);
                if (res.STATUS==1) {
                    console.log('id:'+msgId+' 消息删除成功!');
                }
            }
        });
    }



    $(document)
        .on('swipeLeft', '.message', function () {
            $(this).addClass('showDelete')
        })
        .on('swipeRight', '.message', function () {
            $(this).removeClass('showDelete')
        })
        .on('click', '.messageList .delete', function () {
            deleteOneMsg(this);
            return false; //防冒泡
        })


},100);
setTimeout(function() {
    

    const $contanier = $('.myMovieList')

    // $.showIndicator()

    new ScrollLoad({

        scrollContanier: $contanier, //滚动父容器

        // 配置渲染模板
        template: (data) => {
            let html = '';
            for (let i = 0; i < data.length; i++) {
                let d = data[i]
                html += `
                <a class="box external" href="${$.getMovDetails(d.id)}">
                    <div class="imgbox">
                        <img src="${d.poster}" alt="">
                    </div>
                    <div class="info">
                        <span class="Title">${d.title}</span>
                        <p class="text">${d.introduction}</p>
                        <span class="text2">更新到第${d.updateSite}集</span>
                    </div>
                    <span class="info2">
                        <span>下单时间: ${d.updateTime}</span>
                        <span class="price">${d.price}</span>
                    </span>
                </a>
                `
            }
            return html
        },

        ajax: (data, callback) => {
            $.ajax({
                url: 'http://wechat.94joy.com/wx/rest/user/myMovie',
                data: {
                    openId: $.openId,
                    state: 1 //我的影片
                },
                success: (res) => {
                    console.log('我的影片：',res);
                    if (res.DATA) {
                        callback(res.DATA)
                    } else {
                        console.log('我的影片没有数据');
                    }
                },
                error: (e) => {
                    console.log('我的影片加载失败',e);
                    // $.alert('刷新失败，请稍后再试！')
                },
                complete: () => {
                    if ($contanier.find('.box').length == 0) {
                        $contanier.hide()
                    }
                }
            });
        }
    })

},100);
// 收益明细
{
    $('.childPageEnter').click(function () {
        let $this = $(this)
        let index = $this.index()

    })

    function createProfitInList(data) {
        let index = data.index
        let length = data.length;
        let tpl = ``
        for (let i = 0; i < length; i++) {
            tpl += `
            <li>
                <div class="info">
                    <img src="../images/index-banner.jpg" alt="">
                    <div class="text">
                        <span class="name">哇哈哈</span>
                        <span class="num">+20.00</span>
                    </div>
                </div>
            </li>
            `
        }
        $('.profit-in').eq(index).find('.list').append(tpl)
    }
    createProfitInList({
        index:0,
        length:3
    })
    createProfitInList({
        index:1,
        length:2
    })
    createProfitInList({
        index:2,
        length:5
    })
}
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
                        $.page_me_reload();//刷新个人中心数据
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