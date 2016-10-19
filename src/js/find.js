{ // picker

    let $selectSwitch = $('.select-switch')
    $selectSwitch.on('click', function(e) {
        e.stopPropagation();
        let $this = $(this)
        let $thisArrow = $this.find('.fa')
        $selectSwitch.find('.fa').not($thisArrow).removeClass('isopen')
        $thisArrow.toggleClass('isopen')
        $selectSwitch.not($this).picker('close')
        if (!$thisArrow.hasClass('isopen')) {
            setTimeout(function() {

                $this.picker("close")
            });
        }
    })


    $selectSwitch.eq(0).picker({
        toolbarTemplate: `<header class="find-select"></header>`,
        cols: [{
            textAlign: 'center',
            values: ['更新时间', '人气排行']
        }],
        onClose: () => {
            // console.log('默认排序picker关闭');
        }
    });
    $selectSwitch.eq(1).picker({
        toolbarTemplate: `<header class="find-select"></header>`,
        cols: [{
            textAlign: 'center',
            values: ['全部', '内地', '韩国']
        }],
        onClose: () => {}
    });
    $selectSwitch.eq(2).picker({
        toolbarTemplate: `<header class="find-select"></header>`,
        cols: [{
            textAlign: 'center',
            values: ['全部', '电视剧', '电影']
        }],
        onClose: () => {}
    });


}

{ // infinite-scroll
    // 加载flag
    let loading = false;
    // 最多可加载的条目
    let maxItems = 18;

    // 每次加载添加多少条目
    let itemsPerLoad = 9;

    function addItems(number, lastIndex) {
        // 生成新条目的HTML
        let html = '';
        for (let i = lastIndex + 1; i <= lastIndex + number; i++) {
            html += `
            <a href="./movieDetails.html?movieId=" class="find-list">
                <div class="imgbox">
                    <img src="../images/index-banner.jpg" alt="">
                    <div class="status">已完结</div>
                </div>
                <p class="name">夏日大作战 ${i}</p>
            </a>
            `
        }
        // 添加新条目
        $('.infinite-scroll-bottom .find-content').append(html);

    }
    //预先加载20条
    addItems(itemsPerLoad, 0);

    // 上次加载的序号

    let lastIndex = itemsPerLoad ;

    // 注册'infinite'事件处理函数
    $(document).on('infinite', '.infinite-scroll-bottom', function() {

        // 如果正在加载，则退出
        if (loading) return;

        // 设置flag
        loading = true;

        // 模拟1s的加载过程
        setTimeout(function() {
            // 重置加载flag
            loading = false;

            if (lastIndex >= maxItems) {
                // 加载完毕，则注销无限加载事件，以防不必要的加载
                $.detachInfiniteScroll($('.infinite-scroll'));
                // 删除加载提示符
                // $('.infinite-scroll-preloader').remove();
                $('.infinite-scroll-preloader').text('已经到底了！');
                return;
            }

            // 添加新条目
            addItems(itemsPerLoad, lastIndex);
            // 更新最后加载的序号
            lastIndex = $('.find-content>*').length;
            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
        }, 1000);
    });
}
