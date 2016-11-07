'use strict';

{
    var createProfitInList = function createProfitInList(data) {
        var index = data.index;
        var length = data.length;
        var tpl = '';
        for (var i = 0; i < length; i++) {
            tpl += '\n            <li>\n                <div class="info">\n                    <img src="../images/index-banner.jpg" alt="">\n                    <div class="text">\n                        <span class="name">哇哈哈</span>\n                        <span class="num">+20.00</span>\n                    </div>\n                </div>\n            </li>\n            ';
        }
        $('.profit-in').eq(index).find('.list').append(tpl);
    };

    $('.childPageEnter').click(function () {
        var $this = $(this);
        var index = $this.index();
    });

    createProfitInList({
        index: 0,
        length: 3
    });
    createProfitInList({
        index: 1,
        length: 2
    });
    createProfitInList({
        index: 2,
        length: 5
    });
}
//# sourceMappingURL=profit.js.map
