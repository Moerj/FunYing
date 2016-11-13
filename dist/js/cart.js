'use strict';

// 购物车

$(function () {
    var $contanier = $('.list');
    var $payBtn = $('#payBtn');
    var $totalPrice = $('#totalPrice');
    var selectedMovieId = [];

    new ScrollLoad({

        scrollContanier: $contanier, //滚动父容器
        // maxload: 10,
        // perload: 7,

        // 配置渲染模板
        template: function template(data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                html += '\n                <li>\n                    <label for="list-' + (i + 1) + '">\n                        <span class="checkbox">\n                            <input type="checkbox" class="select" id="list-' + (i + 1) + '" movieId="' + d.id + '">\n                            <label for="list-' + (i + 1) + '"></label>\n                        </span>\n                        <div class="listcontent">\n                            <div class="imgbox">\n                                <img src="' + d.poster + '">\n                            </div>\n                            <div class="info">\n                                <h4 class="Title">' + d.title + '</h4>\n                                <span class="text">\n                                    ' + d.introduction + '\n                                </span>\n                                <p>\n                                    <span class="site">更新至第' + d.updateSite + '集</span>\n                                    <span class="price">' + Number(d.price).toFixed(2) + '</span>\n                                </p>\n                            </div>\n                            <span class="delete" movieId="' + d.id + '">删除</span>\n                        </div>\n                    </label>\n                </li>\n                ';
            }
            return html;
        },

        ajax: function ajax(data, callback) {
            var newData = $.extend({}, data, {
                openId: $.openId,
                state: 0 //购物车
            });

            $.ajax({
                url: 'http://wechat.94joy.com/wx/rest/user/myMovie',
                data: newData,
                cache: false,
                success: function success(res) {
                    // console.log(res);
                    if (res.DATA) {
                        callback(res.DATA);
                    } else {
                        console.log(window.location.hash + ' 没有数据');
                    }
                },
                error: function error(e) {
                    console.log(e);
                    $.alert('刷新失败，请稍后再试！');
                },
                complete: function complete() {
                    if ($contanier.children('li').length == 0) {
                        $contanier.hide();
                    }
                }
            });
        }
    });

    // 删除请求
    function deleteOneMovie(deleteBtn) {
        // 确保是jq对象
        var $deleteBtn = $(deleteBtn);

        for (var i = 0; i < $deleteBtn.length; i++) {
            var movieId = $($deleteBtn[i]).attr('movieId');
            console.log('deleteId:' + movieId);
            $.ajax({
                url: "http://wechat.94joy.com/wx/rest/user/delMyMovie",
                data: {
                    openId: $.openId,
                    movieId: movieId
                },
                success: function success(res) {
                    console.log(res);
                    if (res.STATUS == 1) {} else {}
                },
                error: function error() {}
            });
        }

        // 不必等待数据的真实删除
        // 删除dom
        $deleteBtn.parents('li').remove();
    }

    // 交互部分==============
    var editMode = false;
    var hasSelect = false;

    // 全选
    $('#selectAll').on('change', function () {
        var $this = $(this);
        $('.select').prop('checked', $this.prop('checked'));
        changeBtnStatus();
    });

    // 有list被改变
    $(document).on('change', '.select', function () {
        changeBtnStatus();
    });

    // 编辑状态
    $('.edit').click(function () {
        editMode = !editMode;
        if (editMode) {
            $(this).text('完成');
            $('.deleteAll').show();
            $payBtn.hide();
        } else {
            $(this).text('编辑');
            $('.deleteAll').hide();
            $payBtn.show();
        }
    });

    // 刷新操作按钮状态
    function changeBtnStatus() {
        selectedMovieId = [];
        hasSelect = false;
        var total = 0;

        $('.select').each(function (i, el) {
            var $el = $(el);
            if ($el.prop('checked')) {
                hasSelect = true;

                // 记录选择的电影ID
                selectedMovieId.push($el.attr('movieid'));

                // 统计价格
                var price = parseFloat($el.parents('label').find('.price').text());
                total += price;
            }
        });
        if (hasSelect) {
            $('.tools .btn').addClass('active');
            $totalPrice.text(total.toFixed(2));
        } else {
            $('.tools .btn').removeClass('active');
            $totalPrice.text(0);
        }
    }

    // 删除单个
    $(document).on('click', '.delete', function () {
        deleteOneMovie(this);
        changeBtnStatus();
        deleteEmpty();
    });

    // 删除全部
    $('.deleteAll').click(function () {
        deleteOneMovie($('.select:checked'));
        changeBtnStatus();
        deleteEmpty();
    });

    // 全部删完后设置购物车空状态
    function deleteEmpty() {
        var $list = $('.list>li');
        if ($list.length == 0) {
            $('.list,.tools,.edit').hide();
        }
    }

    // 触摸滑动事件
    // 左滑 显示单个删除
    $contanier.on('swipeLeft', 'li', function () {
        $('.delete').removeClass('show');
        $(this).find('.delete').addClass('show');
    }).on('swipeRight', 'li', function () {
        $(this).find('.delete').removeClass('show');
    });

    // 支付
    $payBtn.click(function () {

        var movieId = selectedMovieId[0];
        if (selectedMovieId.length > 1) {
            for (var i = 1; i < selectedMovieId.length; i++) {
                movieId += ',' + selectedMovieId[i];
            }
        }

        $.payment(movieId, function () {

            $.msg({
                text: '恭喜，您已购买成功! 5s后跳转"我的影片"，可以去看片了',
                timeout: 5000,
                callback: function callback() {
                    // 跳转到我的影片
                    window.location = 'me.html#page-myMovie';
                }
            });
        });
    });
});