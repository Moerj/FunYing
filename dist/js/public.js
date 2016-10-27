'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 无限滚动的懒加载
var LazyLoad = function () {
    function LazyLoad(opt) {
        var _this = this;

        _classCallCheck(this, LazyLoad);

        // 默认参数
        var DEFAULT = {
            maxItems: 1000,
            itemsPerLoad: 27,
            loading: false,
            currentPage: 1,
            $preloader: opt.$scrollContanier.find('.infinite-scroll-preloader')
        };

        opt = $.extend({}, DEFAULT, opt);

        // 将opt参数解构给this
        for (var key in opt) {
            if (opt.hasOwnProperty(key)) {
                this[key] = opt[key];
            }
        }

        // 注册'infinite'事件处理函数
        this.$scrollContanier.on('infinite', function () {
            // 如果正在加载，则退出
            if (_this.loading) return;

            // 超出最大限制
            if (_this.$listContanier.children().length >= _this.maxItems) {
                _this.finish();
                return;
            }

            // 设置flag
            _this.loading = true;

            _this.ajax({
                skip: _this.currentPage, //当前页
                limit: _this.itemsPerLoad //每页条数
            }, function (data) {
                // 重置加载flag
                _this.loading = false;

                // 数据加载完
                if (data.length <= 0) {
                    _this.finish();
                    return;
                }

                _this.currentPage++;
                _this.render(data);

                //容器发生改变,如果是js滚动，需要刷新滚动
                $.refreshScroller();
            });
        });
    }

    // 刷新数据


    _createClass(LazyLoad, [{
        key: 'reload',
        value: function reload() {
            var _this2 = this;

            // 滚动条置顶
            this.$scrollContanier[0].scrollTop = 0;

            // 回复loading的效果
            this.$preloader.html('<div class="preloader"></div>');

            // 当前页从1开始
            this.currentPage = 1;

            // 开启无限加载
            this.loading = false;

            // loading效果
            $.showIndicator();

            this.ajax({
                skip: 1, //当前页
                limit: this.itemsPerLoad //每页条数
            }, function (data) {
                _this2.$listContanier.empty();
                if (data.length) {
                    _this2.currentPage++;
                    _this2.render(data);
                } else {
                    _this2.finish();
                }
                $.hideIndicator();
            });
        }

        // 加载完成

    }, {
        key: 'finish',
        value: function finish() {
            // 加载完毕，则注销无限加载事件，以防不必要的加载
            // $.detachInfiniteScroll($('.infinite-scroll'));

            // 在可能重复使用的页面，设置loading，暂时关闭加载
            this.loading = true;

            // 删除加载提示符
            this.$preloader.text('已经到底了！');
        }

        // 进行渲染

    }, {
        key: 'render',
        value: function render(data) {
            var html = this.template(data);
            // 添加新条目
            this.$listContanier.append(html);
        }
    }]);

    return LazyLoad;
}();

$.url = {
    movDetails: './movieDetails.html?movieId=',
    artDetails: './articleDetails.html?articleId='
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

// 影视详情绑定
$(document).on('click', '.getMovie', function () {
    function _updateDetailsPage(res) {
        var $page = $('.movieDetails');
        $page.find('.pic').attr('src', res.MOVIE.poster);
    }

    var $this = $(this);
    var movieId = $this.attr('movieId');
    $.ajax({
        type: "get",
        url: "http://118.178.136.60:8001/rest/index/getMovie",
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