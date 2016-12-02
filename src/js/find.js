setTimeout(function () {



    // 筛选参数，页面独有
    let sort = 1 //排序 1.更新时间 2.人气排行
    let first_type = null //地区 直接传中文字符，'全部'传空
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
                <a href="${$.getMovDetails(d.id)}" class="find-list external">
                    <div class="imgbox">
                        <img src="${d.stills}" alt="">
                        <div class="status">${$.getUpdateStatus(d.updateStatus,d.updateSite)}</div>
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
                first_type: first_type,
                type: type
            })

            $.ajax({
                url: 'http://wechat.94joy.com/wx/rest/find/all',
                data: data,
                success: function (res) {
                    console.log('发现', res);
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

    function toggleArrow(eqIndex) {
        $selectSwitch.eq(eqIndex).find('.fa').toggleClass('isopen')
    }

    const sortIndex = 0
    $selectSwitch.eq(sortIndex).picker({
        toolbarTemplate: `<header class="find-select"></header>`,
        cols: [{
            textAlign: 'center',
            values: ['更新时间', '人气排行']
        }],
        onOpen: () => {
            toggleArrow(sortIndex)
        },
        onClose: (picker) => {
            toggleArrow(sortIndex)
            sort = picker.value[0] == '更新时间' ? 1 : 2
            loader.reload()

            let value = picker.value
            $selectSwitch.eq(sortIndex).find('b').text(value)
        }
    });

    const areaIndex = 1
    $selectSwitch.eq(areaIndex).picker({
        toolbarTemplate: `<header class="find-select"></header>`,
        cols: [{
            textAlign: 'center',
            values: ['全部', `华语`, `爱情`, `游戏`, `科幻`, `悬疑`, `喜剧`, `欧美`, `日本`, `韩国`, `恐怖`, `豆瓣高分`, `经典`, `动作`, `高分冷门`]
        }],
        onOpen: () => {
            toggleArrow(areaIndex)
        },
        onClose: (picker) => {
            toggleArrow(areaIndex)
            first_type = picker.value[0] == '全部' ? null : picker.value[0]
            loader.reload()

            let value = picker.value == '全部' ? '地区' : picker.value
            $selectSwitch.eq(areaIndex).find('b').text(value)
        }
    });

    const typeIndex = 2
    $selectSwitch.eq(typeIndex).picker({
        toolbarTemplate: `<header class="find-select"></header>`,
        cols: [{
            textAlign: 'center',
            values: [
                `全部`, `经典`, '华语', '爱情', '科幻', '悬疑', `喜剧`, `动作`, `欧美`, `日本`, `韩国`, `恐怖`, `豆瓣高分`, `高分冷门`
            ]
        }],
        onOpen: () => {
            toggleArrow(typeIndex)
        },
        onClose: (picker) => {
            toggleArrow(typeIndex)
            type = picker.value[0] == '全部' ? null : picker.value[0]
            loader.reload()

            let value = picker.value == '全部' ? '类型' : picker.value
            $selectSwitch.eq(typeIndex).find('b').text(value)
        }
    });

    // 选中筛选内容，并收起筛选器
    $(document).on('click', '.picker-item', function () {
        $.closeModal(".picker-modal.modal-in")
    })


})