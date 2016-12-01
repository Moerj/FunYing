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
                    <label class="splitline" for="chargeRadio-${i}"><span class="price">${$.formatAmount(priceArry[i])}</span><i class="fa fa-check"></i></label>
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
                // headerImg头像，nickName微信昵称，lucreAmount收益余额，充值余额rechargeAmount  账户余额totalAmount
                console.log('个人中心首页数据：', res);
                if (res.STATUS == 1 && res.DATA) {
                    let data = res.DATA

                    // 根据id 加载后台数据
                    for (let key in data) {
                        $('#' + key).text(data[key])
                    }

                    // 充值页面的余额
                    $('.overage').init($.formatAmount(data['totalAmount']))

                    let rechargeAmountVal = Number($('#rechargeAmount').text())
                    let lucreAmountVal = Number($('#lucreAmount').text())
                    $('.headpic').init(data.headerImg || '../images/icon/user.png')//个人中心用户头像

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
            $('#myqrcode')
            .click(function(){
                // 二维码点击放大
                $(this).toggleClass('qrcodeBig')
            })
            .init(res.code)
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

        // 将ftp返回的图片传给后台进行录入更新
        function _updateImg(imgUrl) {
            $.ajax({
                url: "http://wechat.94joy.com/wx/rest/user/updateImg",
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

        $.showPreloader('正在压缩图片')
        // 压缩
        lrz(fileObj[0],{
            width: 120
        })
        .then(function (rst) {
            // 处理成功会执行
            console.log('图片已压缩：',rst);

            formdata.append("imgFile", rst.file);
            $.showPreloader('正在上传头像')

            // 上传到ftp
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
            
        })
        .catch(function (err) {
            // 处理失败会执行
            $.alert('图片压缩失败，请换一张试试')
            $.hidePreloader();
        })
        .always(function () {
            // 不管是成功失败，都会执行
        });

        
        return false;
    });



}
setTimeout(function() {
    


    function messageInit() {

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
                $.ajax({
                    url: 'http://wechat.94joy.com/wx/rest/user/systemMsg',
                    data: data,
                    success: (res) => {
                        console.log('系统消息：',res);
                        if (res.DATA.length) {
                            callback(res.DATA)
                        } else {
                            console.log('系统消息：没有数据');
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
                    if (res.STATUS == 1) {
                        console.log('id:' + msgId + ' 消息删除成功!');
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

    }

    $.pageInit({
        hash: 'page-message',
        entry: '#entry-message',
        init: () => {
            messageInit()
        }
    })

}, 100);
setTimeout(function() {
    


    function myMovieLoad() {

        const $contanier = $('.myMovieList')


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
                            <img src="${d.stills}" alt="">
                        </div>
                        <div class="info">
                            <span class="Title">${d.title}</span>
                            <p class="text">${d.introduction}</p>
                            <span class="text2">${$.getUpdateStatus(d.updateStatus,d.updateSite)}</span>
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
                        if (res.DATA.length) {
                            callback(res.DATA)
                        } else {
                            console.log('我的影片没有数据');
                        }
                    },
                    error: (e) => {
                        console.warn('我的影片加载失败', e);
                        $.alert('加载失败，请稍后再试！')
                    },
                    complete: () => {
                        if ($contanier.find('.box').length == 0) {
                            $contanier.hide()
                        }
                    }
                });
            }
        })
    }



    $.pageInit({
        hash: 'page-myMovie',
        entry: '#entry-myMovie',
        init: () => {
            myMovieLoad()
        }
    })


}, 100);
// 收益明细
setTimeout(function () {


    // 收益明细页数据
    function entry() {
        new ScrollLoad({

            scrollContanier: '#profitScrollContanier', //滚动父容器
            listContanier: '#profitList',
            // maxload: 10,
            // perload: 7,

            // 配置渲染模板
            template: (data) => {
                let html = '';
                for (let i = 0; i < data.length; i++) {
                    let d = data[i]

                    // 推客名
                    let name = d.one_level_amount || d.second_level_amount || d.three_level_amount || ''

                    let details // 收益详情
                    let classType // 推客等级
                    let amount //额度

                    switch (Number(d.type)) {
                        case 1:
                            classType = 'one'
                            details = `从一级推客${name}获取收益`
                            amount = d.charge_amount
                            break;
                        case 2:
                            classType = 'two'
                            details = `从二级推客${name}获取收益`
                            amount = d.charge_amount
                            break;
                        case 3:
                            classType = 'three'
                            details = `从三级推客${name}获取收益`
                            amount = d.charge_amount
                            break;
                        case 4:
                            details = `提现`
                            amount = d.profit_amount
                            classType = 'other'
                            break;
                        case 5:
                            details = `消费`
                            amount = d.profit_amount
                            classType = 'other'
                            break;
                        case 6:
                            details = `充值`
                            amount = d.charge_amount
                            classType = 'other'
                            break;
                        default:

                            break;
                    }

                    // 时间
                    let addTime = d.add_time.split(' ')
                    let day = addTime[0]
                    let time = addTime[1]


                    // 创建模板
                    html += `
                    <li class=${classType}>
                        <div class="date">
                            <div class="day">${day}</div>
                            <div class="time">${time}</div>
                        </div>
                        <div class="info">
                            <img class="i1" src=${d.image||'../images/icon/user.png'} alt="">
                            <div class="i2">
                                <span class="num">${d.charge_amount?'+':'-'}${amount}</span>
                                <span class="text">${details}</span>
                            </div>
                        </div>
                    </li>
                    `
                }
                return html
            },

            ajax: (data, callback) => {
                $.ajax({
                    url: 'http://wechat.94joy.com/wx/rest/pay/detail',
                    data: data,
                    success: (res) => {
                        console.log('收益明细：', res);
                        if (res.STATUS == 1) {
                            callback(res.data)

                            // 昨日收益
                            let yestAmt = res.yestAmt
                            yestAmt = yestAmt >= 0 ? `+${yestAmt}` : `-${yestAmt}`
                            $('#profit-yestAmt').text($.formatAmount(yestAmt))

                            // 累计收益
                            $('#profit-LucreAmt').text($.formatAmount(res.LucreAmt))

                            // 推客收益总和
                            $('#profit-oneAmt').text($.formatAmount(res.oneAmt))
                            $('#profit-secondAmt').text($.formatAmount(res.secondAmt))
                            $('#profit-threeAmt').text($.formatAmount(res.threeAmt))


                        } else {
                            console.log('收益明细没有数据');
                        }
                    },
                    error: (e) => {
                        console.log(e);
                        $.alert('刷新失败，请稍后再试！')
                    },
                    complete: () => {}
                });
            }
        })
    }


    // 推客明细
    function twitter(pageId, type) {
        let TYPE
        switch (Number(type)) {
            case 1:
                TYPE = '一'
                break;
            case 2:
                TYPE = '二'
                break;
            case 3:
                TYPE = '三'
                break;

            default:
                break;
        }
        $(pageId).find('.pageName').text(`我的${TYPE}级推客`)

        new ScrollLoad({
            scrollContanier: `${pageId} .con2`, //滚动父容器
            listContanier: `${pageId} .list`,
            // maxload: 10,
            // perload: 7,

            // 配置渲染模板
            template: (data) => {
                let html = '';
                for (let i = 0; i < data.length; i++) {
                    let d = data[i]

                    // 推客名
                    let name = d.one_level_amount || d.second_level_amount || d.three_level_amount || '未知推客'

                    // 创建模板
                    html += `
                    <li>
                        <div class="info">
                            <img src=${d.image || '../images/icon/user.png'}>
                            <div class="text">
                                <span class="name">${name}</span>
                                <span class="num">+${d.charge_amount}</span>
                            </div>
                        </div>
                    </li>
                    `
                }
                return html
            },

            ajax: (data, callback) => {
                data = $.extend(data, {
                    type: type
                })
                $.ajax({
                    url: 'http://wechat.94joy.com/wx/rest/pay/twitterDetail',
                    data: data,
                    success: (res) => {
                        console.log(type + '级推客：', res);
                        if (res.STATUS == 1) {
                            callback(res.data)

                            // 昨日收益
                            if (res.month) {
                                let month = $.formatAmount(res.month)
                                month = month >= 0 ? `+${month}` : `-${month}`
                                $(`${pageId} .con1 .num`).text(month)
                            }

                            // 累计收益
                            if (res.totalAmt) {
                                $(`${pageId} .con1 .total`).text($.formatAmount(res.totalAmt))
                            }

                        } else {
                            console.log(`${TYPE}级推客没有数据`);
                        }
                    },
                    error: (e) => {
                        console.log(e);
                        $.alert('刷新失败，请稍后再试！')
                    },
                    complete: () => {}
                });
            }
        })
    }

    function pageLoadAll() {
        entry()
        twitter('#page-profit-1', 1)
        twitter('#page-profit-2', 2)
        twitter('#page-profit-3', 3)
    }


    $.pageInit({
        hash: 'page-profit',
        entry: '#entry-profit',
        init: () => {
            pageLoadAll()
        }
    })


}, 100);
// 提现
{
    const $withdrawOk = $('#withdrawOk') //提现按钮
    const $withdrawInput = $('#withdrawInput') //提现金额输入框

    function ajax_cash() {
        console.log($.openId);
        console.log($withdrawInput.val());
        $.ajax({
            url: "http://wechat.94joy.com/wx/rest/pay/cash",
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