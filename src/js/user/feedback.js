$('#feedbackSubmit').click(function () {

    $.ajax({
        url: "http://www.funying.cn/wx/rest/user/addFeedBack",
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