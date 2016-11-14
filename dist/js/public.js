'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 无限滚动的懒加载
var ScrollLoad = function () {
    function ScrollLoad(opt) {
        var _this = this;

        _classCallCheck(this, ScrollLoad);

        opt.scrollContanier = $(opt.scrollContanier);
        if (opt.listContanier != undefined) {
            opt.listContanier = $(opt.listContanier);
        }

        // 默认参数
        var DEFAULT = {
            maxload: 1000, //最大条数
            perload: 27, //每次分页条数
            loading: false, //加载等待
            currentPage: 1, //当前页
            listContanier: opt.scrollContanier, //list容器，默认等于scroll容器
            scrollContanier: opt.scrollContanier
        };

        opt = $.extend({}, DEFAULT, opt);

        // 将opt参数解构给this
        for (var key in opt) {
            if (opt.hasOwnProperty(key)) {
                this[key] = opt[key];
            }
        }

        // 创建loading
        this.preloader = $('\n            <div class="infinite-scroll-preloader">\n                <div class="preloader"></div>\n            </div>\n        ').appendTo(this.listContanier);

        // 调整最大页数
        if (this.perload > this.maxload) {
            this.perload = this.maxload;
        }

        // 开启滚动监听
        this.scrollContanier.on('scroll', function () {
            _this.scroll();
        });

        // 首次加载
        this.ajax({
            skip: 1, //当前页
            limit: this.perload //每页条数
        }, function (data) {
            if (data.length) {
                _this.currentPage++;
                _this.render(data);
            }
            if (data.length <= _this.perload) {
                _this.finish();
            }
        });
    }

    // 滚动逻辑


    _createClass(ScrollLoad, [{
        key: 'scroll',
        value: function scroll() {
            var _this2 = this;

            // 滚动到接近底部时加载数据
            if (this.scrollContanier.scrollTop() + this.scrollContanier.height() + 100 < this.scrollContanier[0].scrollHeight) {
                return;
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
            }, function (data) {
                // 重置加载flag
                _this2.loading = false;

                // 数据加载完
                if (data.length <= 0) {
                    _this2.finish();
                    return;
                }

                _this2.currentPage++;
                _this2.render(data);
            });
        }

        // 刷新数据

    }, {
        key: 'reload',
        value: function reload() {
            var _this3 = this;

            // 滚动条置顶
            this.scrollContanier[0].scrollTop = 0;

            // 回复loading的效果
            this.preloader.html('<div class="preloader"></div>');

            // 当前页从1开始
            this.currentPage = 1;

            // 重置状态
            this.loading = false;

            // 开启无限加载
            this.scrollContanier.on('scroll', function () {
                _this3.scroll();
            });

            // loading效果
            $.showIndicator();

            this.ajax({
                skip: 1, //当前页
                limit: this.perload //每页条数
            }, function (data) {
                _this3.listContanier.empty();
                if (data.length) {
                    _this3.currentPage++;
                    _this3.render(data);
                } else {
                    _this3.finish();
                }
                $.hideIndicator();
            });
        }

        // 加载完成

    }, {
        key: 'finish',
        value: function finish() {
            // 关闭滚动监听
            this.scrollContanier.off('scroll');

            // 内容出现混动条时，才会显示已经到底
            var h1 = this.preloader[0].offsetTop;
            var h2 = this.listContanier.height() - parseInt(this.listContanier.css('padding-top'));
            if (h1 > h2 - 10) {
                this.preloader.text('已经到底了！');
            } else {
                this.preloader.text('');
            }
        }

        // 进行渲染

    }, {
        key: 'render',
        value: function render(data) {
            // 根据每页条数限制data长度
            // 后台返回的数据，有可能超过自定分页长度
            if (this.perload < data.length) {
                data.length = this.perload;
            }
            var html = this.template(data);

            // 添加新条目
            this.listContanier.append(html);

            // 将loader移动到列表末
            this.preloader.appendTo(this.listContanier);
        }
    }]);

    return ScrollLoad;
}();

// 绑定事件=================
// 影视详情跳转


$(document).on('click', '.getMovie', function () {
    function _updateDetailsPage(res) {
        var $page = $('.movieDetails');
        $page.find('.pic').attr('src', res.MOVIE.poster);
    }

    var $this = $(this);
    var movieId = $this.attr('movieId');
    $.ajax({
        type: "get",
        url: "http://wechat.94joy.com/wx/rest/index/getMovie",
        data: {
            movieId: movieId
        },
        success: function success(res) {
            console.log(res);
            _updateDetailsPage(res);
        },
        error: function error(e) {
            console.log('影视详情页获取失败。', e);
        }
    });
});
// $ 下的公共方法 ==============

// 取queryString
$.GetQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};

// 获取初始openid
$.openId = $.GetQueryString('openid');
if ($.openId === null) {
    // from sessionStorage
    $.openId = sessionStorage.openId;
} else {
    // from queryString
    sessionStorage.openId = $.openId;
}

// 测试用
$.openId = 'o-IOqxK0lxh9KSLbpxdU8QKILd9Q';

// 生成影视详情的url
$.getMovDetails = function (id) {
    // http://localhost:3000/html/articleDetails.html?articleId=1&oldOpenId=123
    return './movieDetails.html?movieId=' + id + '&oldOpenId=' + $.openId;
};

// 生成文章详情
$.getArtDetails = function (id) {
    return './articleDetails.html?articleId=' + id + '&oldOpenId=' + $.openId;
};

$.msg = function (opts, timeout) {
    var text = opts.text || opts;
    var title = opts.title || '温馨提示';
    var callback = opts.callback;

    if (timeout === undefined) {
        timeout = opts.timeout || 2000;
    }

    var $tpl = $('\n        <div class="mask">\n            <div class="msg">\n                <p class="msg-title">' + title + '</p>\n                <p class="msg-text">' + text + '</p>\n            </div>\n        </div>\n    ');

    $('body').append($tpl);

    if (timeout) {
        setTimeout(function () {
            $tpl.remove();
            if (callback) {
                callback();
            }
        }, timeout);
    }
};

// 付款
$.payment = function (movieId, paySuccess_callback) {

    // 余额支付
    function _payByRecharge() {
        $.showPreloader('购买中，稍等...');
        $.ajax({
            url: "http://wechat.94joy.com/wx/rest/pay/payByRecharge",
            data: {
                openId: $.openId,
                movieId: movieId
            },
            success: function success(res) {
                console.log('余额支付接口', res);
                if (res.STATUS == 1) {
                    paySuccess_callback();
                } else {
                    // 支付失败
                    $.msg('账户余额不足，请充值或使用微信支付！', 5000);
                }
            },
            error: function error() {
                $.msg('系统繁忙，请稍后再尝试支付操作！');
            },
            complete: function complete() {
                $.hidePreloader();
            }
        });
    }

    var buttons = [{
        text: '账户余额支付',
        onClick: function onClick() {
            _payByRecharge();
        }
    }, {
        text: '微信支付',
        onClick: function onClick() {
            $.alert("你选择了“微信支付“");
        }
    }, {
        text: '取消'
    }];
    $.actions(buttons);
};

// jq 对象新增方法 ==================

// dom加载ajax数据
$.fn.init = function (data) {

    for (var i = 0; i < this.length; i++) {
        var thisJq = $(this[i]);
        // console.log(thisJq);
        if (this[i].localName === 'img') {
            thisJq.attr('src', data);
        } else if (thisJq.val() == undefined) {
            thisJq.text(data);
        } else {
            thisJq.val(data);
        }
        thisJq.removeClass('hide').show();
    }
};