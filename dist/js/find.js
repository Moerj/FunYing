'use strict';

{
    (function () {
        // 当前页

        var getFindData = function getFindData(data, callback) {
            if (data.loadingModal) {
                $.showIndicator();
            }
            // 合并入筛选参数
            data = $.extend({}, data, {
                sort: sort,
                area: area,
                type: type
            });
            $.ajax({
                type: "get",
                url: "http://118.178.136.60:8001/rest/find/all",
                // url: "../json/find.json",
                data: data,
                success: function success(res) {
                    // console.log(res);
                    if (res.STATUS == 1) {
                        callback(res.DATA);
                    } else {
                        $.alert('没有数据了');
                    }
                },
                error: function error(e) {
                    console.log(e);
                    $.alert('刷新失败，请稍后再试！');
                },
                complete: function complete() {
                    $.hideIndicator();
                }
            });
        };

        // 刷新数据


        var reload = function reload() {
            // 滚动条置顶
            $infiniteScroll[0].scrollTop = 0;

            // 回复loading的效果
            $preloader.html('<div class="preloader"></div>');

            // 当前页从1开始
            currentPage = 1;

            // 开启无限加载
            loading = false;
            getFindData({
                loadingModal: true,
                skip: 1, //当前页
                limit: itemsPerLoad //每页条数
            }, function (data) {
                currentPage++;
                // console.log('开始刷新', data);
                $contanier.empty();
                addItems(data);
            });
        };

        // 加载完成


        var _finish = function _finish() {
            // 加载完毕，则注销无限加载事件，以防不必要的加载
            // $.detachInfiniteScroll($('.infinite-scroll'));

            // 在可能重复使用的页面，设置loading，暂时关闭加载
            loading = true;

            // 删除加载提示符
            $preloader.text('已经到底了！');
        };

        // 顶部筛选


        // infinite-scroll
        var addItems = function addItems(data) {
            // 生成新条目的HTML
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                html += '\n            <a href="./movieDetails.html?movieId=' + d.id + '" class="find-list">\n                <div class="imgbox">\n                    <img src="' + d.poster + '" alt="">\n                    <div class="status">' + (d.updateStatus == 0 ? '已完结' : '更新中') + '</div>\n                </div>\n                <p class="name">' + d.title + ' ' + d.updateSite + '</p>\n            </a>\n            ';
            }
            // 添加新条目
            $contanier.append(html);
        };

        //预先加载


        // picker

        var $infiniteScroll = $('.infinite-scroll'); //滚动父容器
        var $contanier = $('.find-content'); //列表容器
        var $preloader = $infiniteScroll.find('.infinite-scroll-preloader'); //滚动加载loading效果
        var maxItems = 60; // 最多可加载的条目
        var itemsPerLoad = 9; // 每次加载添加多少条目
        var loading = false; // 加载flag
        var sort = 1; //排序 1.更新时间 2.人气排行
        var area = null; //地区 直接传中文字符，'全部'传空
        var type = null;
        var currentPage = 1;var $selectSwitch = $('.select-switch');
        $selectSwitch.on('click', function (e) {
            e.stopPropagation();
            var $this = $(this);
            var $thisArrow = $this.find('.fa');
            $selectSwitch.find('.fa').not($thisArrow).removeClass('isopen');
            $thisArrow.toggleClass('isopen');
            $selectSwitch.not($this).picker('close');
            if (!$thisArrow.hasClass('isopen')) {
                setTimeout(function () {

                    $this.picker("close");
                });
            }
        });
        $selectSwitch.eq(0).picker({
            toolbarTemplate: '<header class="find-select"></header>',
            cols: [{
                textAlign: 'center',
                values: ['更新时间', '人气排行']
            }],
            onClose: function onClose(picker) {
                sort = picker.value[0] == '更新时间' ? 1 : 2;
                reload();
            }
        });
        $selectSwitch.eq(1).picker({
            toolbarTemplate: '<header class="find-select"></header>',
            cols: [{
                textAlign: 'center',
                values: ['全部', '内地', '韩国']
            }],
            onClose: function onClose(picker) {
                area = picker.value[0] == '全部' ? null : picker.value[0];
                reload();
            }
        });
        $selectSwitch.eq(2).picker({
            toolbarTemplate: '<header class="find-select"></header>',
            cols: [{
                textAlign: 'center',
                values: ['全部', '电视剧', '电影']
            }],
            onClose: function onClose(picker) {
                area = picker.value[0] == '全部' ? null : picker.value[0];
                reload();
            }
        });getFindData({
            skip: 1, //当前页
            limit: itemsPerLoad //每页条数
        }, function (data) {
            console.log(data);
            currentPage++;
            addItems(data);
        });

        // 注册'infinite'事件处理函数
        $infiniteScroll.on('infinite', function () {
            // 如果正在加载，则退出
            if (loading) return;

            // 超出最大限制
            if ($(this).children().length >= maxItems) {
                _finish();
                return;
            }

            // 设置flag
            loading = true;

            // console.log(currentPage);
            getFindData({
                skip: currentPage, //当前页
                limit: itemsPerLoad //每页条数
            }, function (data) {
                // 重置加载flag
                loading = false;
                // console.log(data);

                // 数据加载完
                if (data.length <= 0) {
                    _finish();
                    return;
                }

                currentPage++;
                addItems(data);

                //容器发生改变,如果是js滚动，需要刷新滚动
                $.refreshScroller();
            });
        });
    })();
}
//# sourceMappingURL=find.js.map
