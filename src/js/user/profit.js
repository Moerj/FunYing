// 收益明细
{
    $('.childPageEnter').click(function () {
        let $this = $(this)
        let index = $this.index()

    })

    function createProfitInList(data) {
        let index = data.index
        let length = data.length;
        let tpl = ``
        for (let i = 0; i < length; i++) {
            tpl += `
            <li>
                <div class="info">
                    <img src="../images/index-banner.jpg" alt="">
                    <div class="text">
                        <span class="name">哇哈哈</span>
                        <span class="num">+20.00</span>
                    </div>
                </div>
            </li>
            `
        }
        $('.profit-in').eq(index).find('.list').append(tpl)
    }
    createProfitInList({
        index:0,
        length:3
    })
    createProfitInList({
        index:1,
        length:2
    })
    createProfitInList({
        index:2,
        length:5
    })
}