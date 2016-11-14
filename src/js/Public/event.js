
// 绑定事件=================
// 影视详情跳转
$(document).on('click', '.getMovie', function () {
    function _updateDetailsPage(res) {
        let $page = $('.movieDetails')
        $page.find('.pic').attr('src', res.MOVIE.poster)
    }

    let $this = $(this)
    let movieId = $this.attr('movieId')
    $.ajax({
        type: "get",
        url: "http://wechat.94joy.com/wx/rest/index/getMovie",
        data: {
            movieId: movieId
        },
        success: function (res) {
            console.log(res);
            _updateDetailsPage(res);
        },
        error: function (e) {
            console.log('影视详情页获取失败。', e);
        }
    });
})