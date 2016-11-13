// 取queryString
$.GetQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// 获取初始openid
$.openId = $.GetQueryString('openid')
if ($.openId === null) { // from sessionStorage
    $.openId = sessionStorage.openId

} else { // from queryString
    sessionStorage.openId = $.openId
}

// 测试用
$.openId = 'o-IOqxK0lxh9KSLbpxdU8QKILd9Q'


// 无限滚动的懒加载
class ScrollLoad {
    constructor(opt) {
        opt.scrollContanier = $(opt.scrollContanier)
        if (opt.listContanier != undefined) {
            opt.listContanier = $(opt.listContanier)
        }

        // 默认参数
        const DEFAULT = {
            maxload: 1000, //最大条数
            perload: 27, //每次分页条数
            loading: false, //加载等待
            currentPage: 1, //当前页
            listContanier: opt.scrollContanier, //list容器，默认等于scroll容器
            scrollContanier: opt.scrollContanier
        }

        opt = $.extend({}, DEFAULT, opt)

        // 将opt参数解构给this
        for (let key in opt) {
            if (opt.hasOwnProperty(key)) {
                this[key] = opt[key]
            }
        }

        // 创建loading
        this.preloader = $(`
            <div class="infinite-scroll-preloader">
                <div class="preloader"></div>
            </div>
        `).appendTo(this.listContanier)

        // 调整最大页数
        if (this.perload > this.maxload) {
            this.perload = this.maxload
        }

        // 开启滚动监听
        this.scrollContanier.on('scroll', () => {
            this.scroll()
        });

        // 首次加载
        this.ajax({
            skip: 1, //当前页
            limit: this.perload //每页条数
        }, (data) => {
            if (data.length) {
                this.currentPage++;
                this.render(data)
            }
            if (data.length <= this.perload) {
                this.finish();
            }
        })
    }

    // 滚动逻辑
    scroll() {
        // 滚动到接近底部时加载数据
        if (this.scrollContanier.scrollTop() + this.scrollContanier.height() + 100 < this.scrollContanier[0].scrollHeight) {
            return
        }

        // 如果正在加载，则退出
        if (this.loading) return;

        // 超出最大限制
        if (this.listContanier.children().length >= this.maxload) {
            this.finish();
            return;
        }

        // 设置flag
        this.loading = true;

        this.ajax({
            skip: this.currentPage, //当前页
            limit: this.perload //每页条数
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

        })
    }

    // 刷新数据
    reload() {
        // 滚动条置顶
        this.scrollContanier[0].scrollTop = 0;

        // 回复loading的效果
        this.preloader.html('<div class="preloader"></div>')

        // 当前页从1开始
        this.currentPage = 1;

        // 重置状态
        this.loading = false;

        // 开启无限加载
        this.scrollContanier.on('scroll', () => {
            this.scroll()
        })

        // loading效果
        $.showIndicator()

        this.ajax({
            skip: 1, //当前页
            limit: this.perload //每页条数
        }, (data) => {
            this.listContanier.empty()
            if (data.length) {
                this.currentPage++;
                this.render(data)
            } else {
                this.finish();
            }
            $.hideIndicator();
        })
    }

    // 加载完成
    finish() {
        // 关闭滚动监听
        this.scrollContanier.off('scroll')

        // 删除加载提示符
        this.preloader.text('已经到底了！');
    }

    // 进行渲染
    render(data) {
        // 根据每页条数限制data长度
        // 后台返回的数据，有可能超过自定分页长度
        if (this.perload < data.length) {
            data.length = this.perload
        }
        let html = this.template(data)

        // 添加新条目
        this.listContanier.append(html);

        // 将loader移动到列表末
        this.preloader.appendTo(this.listContanier)

    }
}


// $ 下的公共方法

// 生成影视详情的url
$.getMovDetails = function (id) {
    // http://localhost:3000/html/articleDetails.html?articleId=1&oldOpenId=123
    return `./movieDetails.html?movieId=${id}&oldOpenId=${$.openId}`
}

// 生成文章详情
$.getArtDetails = function (id) {
    return `./articleDetails.html?articleId=${id}&oldOpenId=${$.openId}`
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

// 付款
$.payment = function (movieId) {

    // 余额支付
    function _payByRecharge() {
        $.ajax({
            url: "http://118.178.136.60:8001/rest/pay/payByRecharge",
            data: {
                openId: $.openId,
                movieId: movieId
            },
            success: function (res) {
                console.log('余额支付接口',res);
                if (res.STATUS == 1) {
                    let name = location.pathname.split('/')
                    name = name[name.length - 1]

                    // 购物车页面
                    if (name == 'cart.html') {
                        $.msg({
                            text: '恭喜，您已购买成功! 5s后跳转"我的影片"，可以去看片了',
                            timeout: 5000,
                            callback: () => {
                                // 跳转到我的影片
                                window.location = 'me.html#page-myMovie'
                            }
                        })

                    } else { // 影视详情页
                        // 删除购买按钮
                        $('#isbuy').remove()
                        $.msg('该影片购买成功,您可以在详情页查看资源地址了！', 5000)
                    }

                } else { // 支付失败
                    $.msg('账户余额不足，请充值或使用微信支付！', 5000)
                }
            },
            error: function () {
                $.msg('系统繁忙，请稍后再尝试支付操作！')
            }
        });
    }

    var buttons = [{
        text: '账户余额支付',
        onClick: function () {
            _payByRecharge()
        }
    }, {
        text: '微信支付',
        onClick: function () {
            $.alert("你选择了“微信支付“");
        }
    }, {
        text: '取消'
    }];
    $.actions(buttons);
}


// jq 对象新增方法
$.fn.init = function (data) {

    for (let i = 0; i < this.length; i++) {
        let thisJq = $(this[i])
            // console.log(thisJq);
        if (this[i].localName === 'img') {
            thisJq.attr('src', data)
        } else if (thisJq.val() == undefined) {
            thisJq.text(data)
        } else {
            thisJq.val(data)
        }
        thisJq.removeClass('hide').show()
    }

}

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