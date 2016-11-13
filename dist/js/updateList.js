'use strict';

// 剧情更新

$(function () {

    new ScrollLoad({

        scrollContanier: '.infinite-scroll', //滚动父容器
        listContanier: '.find-content', //列表容器

        // 配置渲染模板
        template: function template(data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                html += '\n                <a href="' + $.getMovDetails(d.id) + '" class="find-list external">\n                    <div class="imgbox">\n                        <img src="' + d.poster + '" alt="">\n                        <div class="status">' + (d.updateStatus == 0 ? '已完结' : '更新中') + '</div>\n                    </div>\n                    <p class="name">' + d.title + ' ' + d.updateSite + '</p>\n                </a>\n                ';
            }
            return html;
        },

        ajax: function ajax(data, callback) {
            // 合并入筛选参数
            data = $.extend({}, data, {
                sort: 1
            });

            $.ajax({
                type: "get",
                url: 'http://wechat.94joy.com/wx/rest/find/all',
                data: data,
                success: function success(res) {
                    if (res.DATA) {
                        callback(res.DATA);
                    } else {
                        $.alert('没有数据了');
                    }
                },
                error: function error(e) {
                    console.log(e);
                    $.alert('刷新失败，请稍后再试！');
                }
            });
        }
    });

    /*
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
        });*/
});