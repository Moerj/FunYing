"use strict";

// updateStatus 更新状态 0未完结1完结
// updateSite 就是更新的集数 数字标识

setTimeout(function () {

    // 开启loading效果
    $.showPreloader();

    // 首页 - 首次进入首页会请求
    $.ajax({
        type: "get",
        dataType: "json",
        url: "http://wechat.94joy.com/wx/rest/index/index",
        success: function success(res) {
            console.log('首页数据', res);

            initBanner(res.headerRes);
            initBest(res.bestMovies);
            initMain(res.mainRes);
            initRankTop(res.rankTop);
        },
        error: function error(e) {
            console.log('首页加载出错', e);
            $.alert('首页加载出错，请稍后再试');
        },
        complete: function complete() {
            // 加载完毕，关闭loading效果
            $.hidePreloader();
        }
    });

    // 加载banner数据
    function initBanner(res) {

        $('#banner img').each(function (i, img) {
            img.src = res[i].pUrl;
        });
        $('#banner a').each(function (i, a) {
            var $a = $(a);
            $a.attr('href', res[i].url);
        });

        // 初始化 swiper组件
        $("#banner").swiper({

            // direction: 'vertical',
            loop: true,

            autoplay: 5000,

            // 如果需要分页器
            pagination: '.swiper-pagination'
        });
    }

    // 加载精品推荐
    function initBest(movs) {
        var tpl = "";
        for (var i = 0; i < movs.length; i++) {
            var mov = movs[i];
            tpl += "\n            <li>\n            <a href=\"" + $.getMovDetails(mov.id) + "\" class=\"external\">\n                <div class=\"imgbox\">\n                    <img src=\"" + mov.stills + "\" />\n                    <p class=\"name\">" + $.getUpdateStatus(mov.updateStatus, mov.updateSite) + "</p>\n                </div>\n                <p class=\"text\">" + mov.introduction + "</p>\n            </a>\n            </li>\n            ";
        }
        $('#rec1 ul').append(tpl);
    }

    // 加载主打推荐 - 跳转文章详情
    function initMain(res) {
        $('.recommended-2 a').each(function (i, el) {
            var $el = $(el);
            $el.attr('href', $.getArtDetails(res[i].id));
            $el.find('img').attr('src', res[i].pictrueUrl);
            $el.find('.titleInfo').text(res[i].title);
            $el.find('.content-text').text(res[i].introduction);
        });
    }

    // 加载今日热门
    function initRankTop(res) {
        var tpl = "";
        for (var i = 0; i < res.length; i++) {
            var mov = res[i];
            tpl += "\n            <li>\n                <a class=\"external flexlist\" href=\"" + $.getMovDetails(mov.id) + "\">\n                    <div class=\"imgbox\">\n                        <img src=\"" + mov.stills + "\" alt=\"\">\n                    </div>\n                    <div class=\"info\">\n                        <span class=\"t\"><span class=\"index\">0" + (i + 1) + "</span>" + mov.title + "</span>\n                        <p class=\"text\">" + mov.introduction + "</p>\n                        <span class=\"text2\">" + $.getUpdateStatus(mov.updateStatus, mov.updateSite) + "</span>\n                    </div>\n                </a>\n            </li>\n            ";
        }
        $('#rankTop').append(tpl);
    }

    // 排行榜
    var rankTab = $('.ranking .tab-link');
    var rankContainer = $('.ranking .hotlist');

    function initRanking(contaier) {
        function _loadRank(contaier, data) {
            var tpl = "";
            for (var i = 0; i < data.length; i++) {
                var mov = data[i];
                tpl += "\n                <li>\n                    <a class=\"external flexlist\" href=\"" + $.getMovDetails(mov.id) + "\">\n                        <div class=\"imgbox\">\n                            <img src=\"" + mov.stills + "\" >\n                        </div>\n                        <div class=\"info\">\n                            <span class=\"t\"><span class=\"index\">" + (i + 1) + "</span>" + mov.title + "</span>\n                            <p class=\"text\">" + mov.introduction + "</p>\n                            <span class=\"text2\">" + $.getUpdateStatus(mov.updateStatus, mov.updateSite) + "</span>\n                        </div>\n                    </a>\n                </li>\n                ";
            }
            $(contaier).empty().append(tpl);
        }
        // 排行
        $.showPreloader();
        var type = rankContainer.index(contaier) + 1;
        $.ajax({
            url: "http://wechat.94joy.com/wx/rest/index/ranking",
            data: {
                type: type
            },
            success: function success(res) {
                console.log("排行type=" + type, res);

                if (res.STATUS == 1) {
                    _loadRank(contaier, res.RANK_LIST);
                } else {
                    // 没有数据
                }
            },
            error: function error(e) {
                console.log('排行加载出错', e);
            },
            complete: function complete() {
                $.hidePreloader();
            }
        });
    }

    rankTab.one('click', function () {
        initRanking(rankContainer[$(this).index()]);
    });
    $('#rank-indexbtn').one('click', function () {
        // 点击排行tab首次加载 今日热门
        initRanking(rankContainer[0]);
    });

    // 搜索功能
    var searchInputs = $('.search-tools input');

    function search(searchName) {
        if (!searchName) {
            console.error('调用搜索失败，因为搜索值为空');
            return;
        }
        sessionStorage.searchName = searchName;
        var $ul = $('.search-list ul');
        $.showPreloader();
        $.ajax({
            url: "http://wechat.94joy.com/wx/rest/index/search",
            data: {
                searchName: searchName
            },
            success: function success(res) {
                // console.log(res);
                var listTpl = "";
                $ul.empty(); //先清空list
                if (res.STATUS == 1) {
                    var movs = res.MOVIES.content;
                    for (var i = 0; i < movs.length; i++) {
                        var mov = res.MOVIES.content[i];
                        var index = mov.id < 10 ? '0' + mov.id : mov.id;
                        listTpl += "\n                            <li>\n                                <a class=\"external flexlist\" href=\"" + $.getMovDetails(mov.id) + "\">\n                                    <div class=\"imgbox\">\n                                        <img src=\"" + mov.stills + "\" />\n                                    </div>\n                                    <div class=\"info\">\n                                        <span class=\"t\"><span class=\"index\">" + index + "</span>" + mov.title + "</span>\n                                        <p class=\"text\">" + mov.introduction + "</p>\n                                        <span class=\"text2\">更新到第" + mov.updateSite + "集</span>\n                                    </div>\n                                </a>\n                            </li>\n                           ";
                    }
                    $ul.append(listTpl);
                    $ul.show();
                } else {
                    $ul.hide();
                }
            },
            error: function error(e) {
                console.log(e);
                $.alert('搜索出错，请稍后再试');
            },
            complete: function complete() {
                $.hidePreloader();
            }
        });
    }

    searchInputs.on('input', function () {
        // 首页和搜索页的输入框双向绑定
        searchInputs.not($(this)).val($(this).val());
    });
    $(document).on('click', '.search', function (e) {
        e.stopPropagation();
        var $this = $(this);
        // 搜索框的展开和收起
        if ($this.hasClass('search-open')) {
            $('.search-tools').toggleClass('search-show');
        }

        // 进行搜索
        if ($this.hasClass('search-btn')) {
            var searchName = $.trim($this.parent().find('input').val());
            if (!searchName) {
                return;
            }
            search(searchName);
        }
    });

    // 返回此页面时，如果搜索框有内容，则需要进行一次搜索
    if (sessionStorage.searchName) {
        search(sessionStorage.searchName);
        searchInputs.val(sessionStorage.searchName);
    }

    // 修复搜索页从影视详情返回，再返回首页时失败
    $(window).on('popstate', function () {
        if (location.hash == "") {
            $('.page').removeClass('page-current');
            $('#index-default').addClass('page-current');
        }
    });

    // 点击记录首页顶部tab
    var $tablist = $('#tablist a');
    $tablist.click(function () {
        var index = $(this).index();
        sessionStorage.indexTab = index;
    });
    if (sessionStorage.indexTab) {
        $tablist.eq(sessionStorage.indexTab).click();
    }
}, 100);