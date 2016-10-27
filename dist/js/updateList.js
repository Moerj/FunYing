'use strict';

{
    (function () {
        var addItems = function addItems(number, lastIndex) {
            // 生成新条目的HTML
            var html = '';
            for (var i = lastIndex + 1; i <= lastIndex + number; i++) {
                html += '\n            <a href="./movieDetails.html?movieId=" class="find-list">\n                <div class="imgbox">\n                    <img src="../images/index-banner.jpg" alt="">\n                    <div class="status">已完结</div>\n                </div>\n                <p class="name">夏日大作战 ' + i + '</p>\n            </a>\n            ';
            }
            // 添加新条目
            $('.infinite-scroll-bottom .find-content').append(html);
        };
        //预先加载20条


        // infinite-scroll
        // 加载flag
        var loading = false;
        // 最多可加载的条目
        var maxItems = 18;

        // 每次加载添加多少条目
        var itemsPerLoad = 9;

        addItems(itemsPerLoad, 0);

        // 上次加载的序号

        var lastIndex = itemsPerLoad;

        // 注册'infinite'事件处理函数
        $(document).on('infinite', '.infinite-scroll-bottom', function () {

            // 如果正在加载，则退出
            if (loading) return;

            // 设置flag
            loading = true;

            // 模拟1s的加载过程
            setTimeout(function () {
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
    })();
}