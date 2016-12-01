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
                    $('.headpic').init(data.headerImg || '../images/icon/user.png') //个人中心用户头像

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
        lrz(fileObj[0], {
                width: 120
            })
            .then(function (rst) {
                // 处理成功会执行
                console.log('图片已压缩：', rst);

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