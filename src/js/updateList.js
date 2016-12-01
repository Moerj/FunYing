// 剧情更新

setTimeout(function(){
    

    new ScrollLoad({

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
                sort: 1
            })

            $.ajax({
                type: "get",
                url: 'http://wechat.94joy.com/wx/rest/find/all',
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



})