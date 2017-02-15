setTimeout(function() {


    // 筛选参数，页面独有
    sessionStorage.sort = sessionStorage.sort || 1 //排序 1.更新时间 2.人气排行
    sessionStorage.first_type = sessionStorage.first_type || '' //地区 直接传中文字符，'全部'传空
    sessionStorage.type = sessionStorage.type || '' //电影类型，同地区

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
                        <img src="${d.poster}" alt="">
                        <div class="status">${$.getUpdateStatus(d.updateStatus,d.updateSite)}</div>
                    </div>
                    <p class="name">${d.title}</p>
                </a>
                `
            }

            return html
        },

        ajax: (data, callback) => {

            // 合并入筛选参数
            data = $.extend({}, data, {
                sort: Number(sessionStorage.sort),
                first_type: sessionStorage.first_type,
                type: sessionStorage.type
            })

            $.ajax({
                url: 'http://www.funying.cn/wx/rest/find/all',
                data: data,
                success: function(res) {
                    console.log('发现', res);
                    if (res.DATA) {

                        callback(res.DATA)

                    } else {
                        $.alert('没有数据了')
                    }
                },
                error: function(e) {
                    console.log(e);
                    $.alert('刷新失败，请稍后再试！')
                }
            });
        }
    })

    window.findLoader = loader


    // 顶部筛选
    let $selectSwitch = $('.select-switch')

    function toggleArrow(eqIndex) {
        $selectSwitch.eq(eqIndex).find('.fa').toggleClass('isopen')
    }

    function setSelectName(eqIndex, value) {
        $selectSwitch.eq(eqIndex).find('b').text(value)
    }

    // 排序
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
            sessionStorage.sort = picker.value[0] == '更新时间' ? 1 : 2
            loader.reload()

            // 设置文本
            let value = picker.value
            setSelectName(sortIndex, value)

            loader.cleanCache()
        }
    });

    // 类型
    const areaIndex = 1
    const areaValues = ['全部', `电影`, `电视剧`, `动画`, `演唱会`, `娱乐`, `体育`, `游戏`, `周边`, `其他`]
    $selectSwitch.eq(areaIndex).picker({
        toolbarTemplate: `<header class="find-select"></header>`,
        cols: [{
            textAlign: 'center',
            values: areaValues
        }],
        onOpen: () => {
            toggleArrow(areaIndex)
        },
        onClose: (picker) => {
            toggleArrow(areaIndex)
            sessionStorage.first_type = picker.value[0] == '全部' ? '' : picker.value[0]
            loader.reload()

            // 设置文本
            let value = picker.value == '全部' ? '类型' : picker.value
            setSelectName(areaIndex, value)

            loader.cleanCache()

            // 控制fun类的picker
            let cols = $selectSwitch.eq(typeIndex)[0].__eleData.picker.params.cols[0]
            switch (value[0]) {
                case '电影':
                    cols.values = ['全部',`动作`,`喜剧`,`爱情`,`科幻`,`悬疑`,`恐怖`]
                    break;
                case '动画':
                    cols.values = ['全部',`欧美`,`日本`,`华语`]
                    break;
                case '电视剧':
                    cols.values = ['全部',`韩国`,`欧美`,`日本`,`华语`]
                    break;
                case '演唱会':
                    cols.values = ['全部']
                    break;
                case '娱乐':
                    cols.values = ['全部']
                    break;
                case '综艺':
                    cols.values = ['全部']
                    break;
                case '其他':
                    cols.values = ['全部']
                    break;
            
                default://全部
                    cols.values = areaValues
                    break;
            }

        }
    });
    if (sessionStorage.first_type !== '') {
        setSelectName(areaIndex, sessionStorage.first_type)
    }

    // fun类
    const typeIndex = 2
    const typeValues = [`全部`, `经典`, `华语`, `欧美`, `韩国`, `日本`, `动作`, `喜剧`, `爱情`, `科幻`, `悬疑`, `恐怖`, `豆瓣高分`, `冷门佳片`]
    $selectSwitch.eq(typeIndex).picker({
        toolbarTemplate: `<header class="find-select"></header>`,
        cols: [{
            textAlign: 'center',
            values: typeValues
        }],
        onOpen: () => {
            toggleArrow(typeIndex)
        },
        onClose: (picker) => {
            toggleArrow(typeIndex)
            sessionStorage.type = picker.value[0] == '全部' ? '' : picker.value[0]
            loader.reload()

            // 设置文本
            let value = picker.value == '全部' ? 'fun类' : picker.value
            setSelectName(typeIndex, value)

            loader.cleanCache()
        }
    })
    if (sessionStorage.type !== '') {
        setSelectName(typeIndex, sessionStorage.type)
    }


    // 选中筛选内容，并收起筛选器
    $(document).on('click', '.picker-item', function() {
        $.closeModal(".picker-modal.modal-in")
    })


}, 100)
