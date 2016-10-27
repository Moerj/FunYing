{ // picker

    // 筛选参数，页面独有
    let sort = 1 //排序 1.更新时间 2.人气排行
    let area = null //地区 直接传中文字符，'全部'传空
    let type = null //电影类型，同地区

    let loader = new ScrollLoad({

        scrollContanier: '.infinite-scroll', //滚动父容器
        listContanier: '.find-content', //列表容器

        // 配置渲染模板
        template: (data) => {
            let html = '';
            for (let i = 0; i < data.length; i++) {
                let d = data[i]
                html += `
                <a href="./movieDetails.html?movieId=${d.id}" class="find-list external">
                    <div class="imgbox">
                        <img src="${d.poster}" alt="">
                        <div class="status">${d.updateStatus==0?'已完结':'更新中'}</div>
                    </div>
                    <p class="name">${d.title} ${d.updateSite}</p>
                </a>
                `
            }
            return html
        },

        ajax: (data, callback) => {
            // 合并入筛选参数
            data = $.extend({}, data, {
                sort: sort,
                area: area,
                type: type
            })

            $.ajax({
                type: "get",
                url: 'http://118.178.136.60:8001/rest/find/all',
                data: data,
                success: function (res) {
                    if (res.DATA) {
                        callback(res.DATA)
                    } else {
                        $.alert('没有数据了')
                    }
                },
                error: function (e) {
                    console.log(e);
                    $.alert('刷新失败，请稍后再试！')
                }
            });
        }
    })


    // 顶部筛选
    let $selectSwitch = $('.select-switch')
    $selectSwitch.on('click', function (e) {
        e.stopPropagation();
        let $this = $(this)
        let $thisArrow = $this.find('.fa')
        $selectSwitch.find('.fa').not($thisArrow).removeClass('isopen')
        $thisArrow.toggleClass('isopen')
        $selectSwitch.not($this).picker('close')
        if (!$thisArrow.hasClass('isopen')) {
            setTimeout(function () {

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
        onClose: (picker) => {
            sort = picker.value[0] == '更新时间' ? 1 : 2
            loader.reload()
        }
    });
    $selectSwitch.eq(1).picker({
        toolbarTemplate: `<header class="find-select"></header>`,
        cols: [{
            textAlign: 'center',
            values: ['全部', '内地', '韩国']
        }],
        onClose: (picker) => {
            area = picker.value[0] == '全部' ? null : picker.value[0]
            loader.reload()
        }
    });
    $selectSwitch.eq(2).picker({
        toolbarTemplate: `<header class="find-select"></header>`,
        cols: [{
            textAlign: 'center',
            values: ['全部', '电视剧', '电影']
        }],
        onClose: (picker) => {
            type = picker.value[0] == '全部' ? null : picker.value[0]
            loader.reload()
        }
    });


}