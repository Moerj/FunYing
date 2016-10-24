$.url = {
    movDetails: `./movieDetails.html?movieId=`,
    artDetails: `./articleDetails.html?articleId=`
}

$.msg = function (opts, timeout) {
    let text = opts.text || opts
    let title = opts.title || '温馨提示'
    let callback = opts.callback

    if (timeout === undefined) {
        timeout = opts.timeout || 2000
    }

    let $tpl = $(`
        <div class="mask">
            <div class="msg">
                <p class="msg-title">${title}</p>
                <p class="msg-text">${text}</p>
            </div>
        </div>
    `);

    $('body').append($tpl)

    if (timeout) {
        setTimeout(function () {
            $tpl.remove()
            if (callback) {
                callback()
            }
        }, timeout);
    }
}



// 影视详情绑定
$(document).on('click', '.getMovie', function () {
    function _updateDetailsPage(res) {
        let $page = $('.movieDetails')
        $page.find('.pic').attr('src', res.MOVIE.poster)
    }

    let $this = $(this)
    let movieId = $this.attr('movieId')
    $.ajax({
        type: "get",
        url: "http://118.178.136.60:8001/rest/index/getMovie",
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