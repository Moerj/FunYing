{

    const $uploadPicker = $('#headpicUpload'); //头像input file
    const $headimg = $('#headerImg'); //头像img

    // 我的页面数据
    $.ajax({
        type: "get",
        url: "http://118.178.136.60:8001/rest/user/index",
        data: {
            openId: openId
        },
        success: function (res) {
            // headerImg头像，nickName微信昵称，lucreAmount收益余额，充值余额rechargeAmount
            // console.log(res);
            if (res.STATUS == 1) {
                let data = res.DATA
                for (let key in data) {
                    $('#' + key).text(data[key])
                }

                let rechargeAmountVal = Number($('#rechargeAmount').text())
                let lucreAmountVal = Number($('#lucreAmount').text())
                let total = (rechargeAmountVal + lucreAmountVal).toFixed(2)
                $('#total').text(total)

                let pieData = [{
                    name: '收益余额',
                    color: '#F36C60',
                    value: lucreAmountVal
                }, {
                    name: '充值余额',
                    color: '#FFC107',
                    value: rechargeAmountVal
                }]

                makePie(pieData);

            }
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

        echarts.init($('.echart')[0]).setOption(option);
    }




    //头像上传
    $uploadPicker.change(function () {
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
                    $.toast("头像上传成功");
                }
            },
            error: (e) => {
                $.alert('上传失败，请稍后再试！')
                console.error(e)
            },
            complete: () => {
                $.hidePreloader();
            }
        });
        return false;
    });



}