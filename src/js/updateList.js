// 剧情更新

setTimeout(function () {


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
                        <img src="${d.poster}" alt="">
                        <div class="status">${$.getUpdateStatus(d.updateStatus)}</div>
                    </div>
                    <p class="name">${d.title}</p>
                </a>
                `
            }
            return html
        },

        ajax: function (callback) {

            $.ajax({
                type: "get",
                url: 'http://www.funying.cn/wx/rest/find/all',
                data: {
                    sort: 1,
                    openId: $.openId,
                    skip: this.currentPage, //当前页
                    limit: this.perload //每页条数
                },
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