// 无限滚动的懒加载
class LazyLoad {
    constructor(opt) {
        this.opt = opt
        this.loading = false
        this.currentPage = 1

        // 注册'infinite'事件处理函数
        this.opt.$scrollContanier.on('infinite', () => {
            // 如果正在加载，则退出
            if (this.loading) return;

            // 超出最大限制
            if (this.opt.$listContanier.children().length >= this.maxItems) {
                this.finish();
                return;
            }

            // 设置flag
            this.loading = true;

            this.opt.ajax({
                skip: this.currentPage, //当前页
                limit: this.opt.itemsPerLoad //每页条数
            }, (data) => {
                // 重置加载flag
                this.loading = false;

                // 数据加载完
                if (data.length <= 0) {
                    this.finish();
                    return;
                }

                this.currentPage++;
                this.render(data)

                //容器发生改变,如果是js滚动，需要刷新滚动
                $.refreshScroller();
            })

        });
    }

    // 刷新数据
    reload() {
        // 滚动条置顶
        this.opt.$scrollContanier[0].scrollTop = 0;

        // 回复loading的效果
        this.opt.$preloader.html('<div class="preloader"></div>')

        // 当前页从1开始
        this.currentPage = 1;

        // 开启无限加载
        this.loading = false;

        // loading效果
        $.showIndicator()

        this.opt.ajax({
            skip: 1, //当前页
            limit: this.opt.itemsPerLoad //每页条数
        }, (data) => {
            this.opt.$listContanier.empty()
            if (data.length) {
                this.currentPage++;
                this.render(data)
            }else{
                this.finish();
            }
            $.hideIndicator();
        })
    }

    // 加载完成
    finish() {
        // 加载完毕，则注销无限加载事件，以防不必要的加载
        // $.detachInfiniteScroll($('.infinite-scroll'));

        // 在可能重复使用的页面，设置loading，暂时关闭加载
        this.loading = true;

        // 删除加载提示符
        this.opt.$preloader.text('已经到底了！');
    }

    // 进行渲染
    render(data) {
        let html = this.opt.template(data)
        // 添加新条目
        this.opt.$listContanier.append(html);

    }
}

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