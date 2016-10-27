'use strict';

$(function () {
    function createList(data) {
        var tpl = '';
        var len = 6;
        for (var i = 0; i < len; i++) {
            tpl += '\n        <li>\n            <label for="list-' + (i + 1) + '">\n                <span class="checkbox">\n                    <input type="checkbox" class="select" id="list-' + (i + 1) + '">\n                    <label for="list-' + (i + 1) + '"></label>\n                </span>\n                <div class="listcontent">\n                    <div class="imgbox">\n                        <img src="' + '../images/index-banner.jpg' + '">\n                    </div>\n                    <div class="info">\n                        <h4 class="Title">' + '芳芳' + '</h4>\n                        <span class="text">\n                            ' + '每个早上，我都要离开你；每个黄昏，你都要把我追回来。一天一天爱下去。” 电影总是留下貌似圆满的结尾，生活的...' + '\n                        </span>\n                        <p>\n                            <span class="site">更新至第' + 5 + '集</span>\n                            <span class="price">' + Number(10).toFixed(2) + '</span>\n                        </p>\n                    </div>\n                    <span class="delete">删除</span>\n                </div>\n            </label>\n        </li>\n        ';
        }
        $('.list').append(tpl);
    }
    createList();

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
            $('.pay').hide();
            // $('.delete').addClass('show')
        } else {
            $(this).text('编辑');
            $('.deleteAll').hide();
            $('.pay').show();
            // $('.delete').removeClass('show')
        }
    });

    // 刷新操作按钮状态
    function changeBtnStatus() {
        hasSelect = false;
        $('.select').each(function (i, el) {
            if ($(el).prop('checked')) {
                hasSelect = true;
                return false;
            }
        });
        if (hasSelect) {
            $('.tools .btn').addClass('active');
        } else {
            $('.tools .btn').removeClass('active');
        }
    }

    // 删除一行
    $(document).on('click', '.delete', function () {
        $(this).parents('li').remove();
        changeBtnStatus();
        deleteEmpty();
    });

    // 删除全部
    $('.deleteAll').click(function () {
        $('.select:checked').parents('li').remove();
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
    $('.list>li').swipeLeft(function () {
        $(this).find('.delete').addClass('show');
    }).swipeRight(function () {
        $(this).find('.delete').removeClass('show');
    });
});