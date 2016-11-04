// updateStatus 更新状态 0未完结1完结
// updateSite 就是更新的集数 数字标识

$(function () {
    // 开启loading效果
    $.showPreloader();


    // 首页 - 首次进入首页会请求
    $.ajax({
        type: "get",
        dataType: "json",
        url: "http://118.178.136.60:8001/rest/index/index",
        success: (res) => {
            // console.log(res);

            initBanner(res.headerRes)
            initBest(res.bestMovies)
            initMain(res.mainRes)
            initRankTop(res.rankTop)

        },
        error: (e) => {
            console.log('首页加载出错', e);
            $.alert('首页加载出错，请稍后再试');
        },
        complete: () => {
            // 加载完毕，关闭loading效果
            $.hidePreloader();
        }
    })

    // 加载banner数据
    function initBanner(res) {

        $('#banner img').each((i, img) => {
            img.src = res[i].pUrl
        })
        $('#banner a').each((i, a) => {
            let $a = $(a)
            $a.attr('href', $.url.movDetails + res[i].id)
        })

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
        let tpl = ``;
        for (let i = 0; i < movs.length; i++) {
            let mov = movs[i]
            tpl += `
            <li>
            <a href="${$.url.movDetails}${mov.id}" class="external">
                <div class="imgbox">
                    <img src="${mov.poster}" />
                    <p class="name">${mov.updateStatus == 0 ? '更新中' : '已完结'}</p>
                </div>
                <p class="text">${mov.introduction}</p>
            </a>
            </li>
            `
        }
        $('#rec1 ul').append(tpl)
    }

    // 加载主打推荐
    function initMain(res) {
        $('.recommended-2 a').each((i, el) => {
            let $el = $(el)
            $el.attr('href', $.url.artDetails + res[i].id)
            $el.find('img').attr('src', res[i].pictrueUrl)
            $el.find('.titleInfo').text(res[i].title)
            $el.find('.content-text').text(res[i].introduction)
        })
    }

    // 加载今日热门
    function initRankTop(res) {
        let tpl = ``
        for (let i = 0; i < res.length; i++) {
            let mov = res[i]
            tpl += `
            <li>
                <a class="external flexlist" href="${$.url.movDetails}${mov.id}">
                    <div class="imgbox">
                        <img src="${mov.poster}" alt="">
                    </div>
                    <div class="info">
                        <span class="t"><span class="index">0${i+1}</span>${mov.title}</span>
                        <p class="text">${mov.introduction}</p>
                        <span class="text2">更新到第${mov.updateSite}集</span>
                    </div>
                </a>
            </li>
            `
        }
        $('#rankTop').append(tpl)
    }



    // 排行榜
    function initRanking(contaier) {
        function _loadRank(contaier, data) {
            let tpl = ``
            for (let i = 0; i < data.length; i++) {
                let d = data[0]
                tpl += `
                <li>
                    <a class="external flexlist" href="${$.url.movDetails}${d.id}">
                        <div class="imgbox">
                            <img src="${d.poster}" >
                        </div>
                        <div class="info">
                            <span class="t"><span class="index">${i+1}</span>${d.title}</span>
                            <p class="text">${d.introduction}</p>
                            <span class="text2">更新到第${d.updateSite}集</span>
                        </div>
                    </a>
                </li>
                `
            }
            $(contaier).empty().append(tpl)
        }
        // 排行
        $.showPreloader();
        $.ajax({
            type: "get",
            dataType: "json",
            url: "http://118.178.136.60:8001/rest/index/ranking",
            success: (res) => {
                // console.log(res);

                if (res.STATUS == 1) {
                    _loadRank(contaier, res.RANK_LIST)
                } else {
                    // 没有数据
                }

            },
            error: (e) => {
                console.log('排行加载出错', e);
            },
            complete: () => {
                $.hidePreloader();
            }
        })
    }
    let rankTab = $('.ranking .tab-link')
    let rankContainer = $('.ranking .hotlist')
    rankTab.one('click', function () {
        initRanking(rankContainer[$(this).index()])
    })
    $('#rank-indexbtn').one('click', function () {
        // 点击排行tab首次加载 今日热门
        initRanking(rankContainer[0])
    })



    // 搜索功能
    let searchInputs = $('.search-tools input')
    searchInputs.on('input', function () {
        // 首页和搜索页的输入框双向绑定
        searchInputs.not($(this)).val($(this).val())
    })
    $(document).on('click', '.search', function (e) {
        e.stopPropagation();
        let $this = $(this)
            // 搜索框的展开和收起
        if ($this.hasClass('search-open')) {
            $('.search-tools').toggleClass('search-show');
        }

        // 进行搜索
        if ($this.hasClass('search-btn')) {
            let searchName = $.trim($this.parent().find('input').val());
            if (!searchName) {
                return;
            }
            let $ul = $('.search-list ul');
            $.showPreloader();
            $.ajax({
                type: "get",
                url: "http://118.178.136.60:8001/rest/index/search",
                data: {
                    searchName: searchName
                },
                dataType: 'json',
                success: function (res) {
                    // console.log(res);
                    let listTpl = ``;
                    $ul.empty(); //先清空list
                    if (res.STATUS == 1) {
                        let movs = res.MOVIES.content
                        for (let i = 0; i < movs.length; i++) {
                            let mov = res.MOVIES.content[i]
                            let index = mov.id < 10 ? '0' + mov.id : mov.id
                            listTpl += `
                            <li>
                                <a class="external flexlist" href="${$.url.movDetails}${mov.id}">
                                    <div class="imgbox">
                                        <img src="${mov.poster}" />
                                    </div>
                                    <div class="info">
                                        <span class="t"><span class="index">${index}</span>${mov.title}</span>
                                        <p class="text">${mov.introduction}</p>
                                        <span class="text2">更新到第${mov.updateSite}集</span>
                                    </div>
                                </a>
                            </li>
                           `
                        }
                        $ul.append(listTpl)
                        $ul.show();
                    } else {
                        $ul.hide();
                    }
                },
                error: function (e) {
                    console.log(e);
                    $.alert('搜索出错，请稍后再试')
                },
                complete: () => {
                    $.hidePreloader();
                }
            });
        }
    })



});