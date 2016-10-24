    $('#feedbackSubmit').click(function () {
        $.msg({
            text: '小编已接到圣旨，谢谢反馈！',
            timeout: 3000,
            callback: () => {
                $.router.back();
            }
        })
    })