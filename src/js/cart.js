// 购物车

setTimeout(() => {
    const $contanier = $('.list')
    const $payBtn = $('#payBtn')
    const $totalPrice = $('#totalPrice')
    let selectedMovieId = []

    new ScrollLoad({

        scrollContanier: $contanier, //滚动父容器
        // maxload: 10,
        // perload: 7,

        // 配置渲染模板
        template: (data) => {
            let html = '';
            for (let i = 0; i < data.length; i++) {
                let d = data[i]
                html += `
                <li>
                    <label for="list-${i+1}">
                        <span class="checkbox">
                            <input type="checkbox" class="select" id="list-${i+1}" movieId="${d.id}">
                            <label for="list-${i+1}"></label>
                        </span>
                        <div class="listcontent">
                            <div class="imgbox">
                                <img src="${d.poster}">
                            </div>
                            <div class="info">
                                <h4 class="Title">${d.title}</h4>
                                <span class="text">
                                    ${d.introduction}
                                </span>
                                <p>
                                    <span class="site">${$.getUpdateStatus(d.updateStatus,d.updateSite)}</span>
                                    <span class="price">${$.formatAmount(d.price)}</span>
                                </p>
                            </div>
                            <span class="delete" movieId="${d.id}">删除</span>
                        </div>
                    </label>
                </li>
                `
            }
            return html
        },

        ajax: (data, callback) => {
            let newData = $.extend({}, data, {
                state: 0 //购物车
            })

            $.ajax({
                url: 'http://www.funying.cn/wx/rest/user/myMovie',
                data: newData,
                cache: false,
                success: (res) => {
                    console.log(res);
                    if (res.STATUS == 1 && res.DATA.length > 0) {
                        callback(res.DATA)
                        $('.headerTools,.tools').init()
                    } else {
                        console.log('购物车接口没有数据');
                    }
                },
                error: (e) => {
                    console.log(e);
                    $.alert('刷新失败，请稍后再试！')
                },
                complete: () => {
                    // 如果没有数据，隐藏掉容器，这样会显示出购物车为空的背景图片
                    if ($contanier.children('li').length == 0) {
                        $contanier.hide();
                    }
                }
            });
        }
    })

    // 删除请求
    function deleteOneMovie(deleteBtn) {
        // 确保是jq对象
        let $deleteBtn = $(deleteBtn)

        for (let i = 0; i < $deleteBtn.length; i++) {
            let movieId = $($deleteBtn[i]).attr('movieId')
            console.log('deleteId:' + movieId);
            $.ajax({
                url: "http://www.funying.cn/wx/rest/user/delMyMovie",
                data: {
                    openId: $.openId,
                    movieId: movieId
                },
                success: (res) => {
                    console.log(res);
                    if (res.STATUS == 1) {

                    } else {

                    }
                },
                error: () => {

                }
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
        const $this = $(this)
        $('.select').prop('checked', $this.prop('checked'))
        changeBtnStatus()
    })

    // 有list被改变
    $(document).on('change', '.select', function () {
        changeBtnStatus()
    })

    // 编辑状态
    $('.edit').click(function () {
        editMode = !editMode;
        if (editMode) {
            $(this).text('完成')
            $('.deleteAll').show()
            $payBtn.hide()
        } else {
            $(this).text('编辑')
            $('.deleteAll').hide()
            $payBtn.show()
        }
    })

    // 刷新操作按钮状态
    function changeBtnStatus() {
        selectedMovieId = []
        hasSelect = false;
        let payTotal = 0


        $('.select').each((i, el) => {
            let $el = $(el)
            if ($el.prop('checked')) {
                hasSelect = true;

                // 记录选择的电影ID
                selectedMovieId.push($el.attr('movieid'))

                // 统计价格
                let price = parseFloat($el.parents('label').find('.price').text())
                payTotal += price
            }
        })
        if (hasSelect) {
            $('.tools .btn').addClass('active')
            $totalPrice.text($.formatAmount(payTotal))
        } else {
            $('.tools .btn').removeClass('active')
            $totalPrice.text(0)
        }
    }


    // 删除单个
    $(document).on('click', '.delete', function () {
        // $.confirm('确认删除选中商品？', () => {
        deleteOneMovie(this)
        changeBtnStatus()
        deleteEmpty()
            // });
    })

    // 删除全部
    $('.deleteAll').click(function () {
        $.confirm('确认删除所选商品？', () => {
            deleteOneMovie($('.select:checked'))
            changeBtnStatus()
            deleteEmpty()
        });
    })

    // 全部删完后设置购物车空状态
    function deleteEmpty() {
        let $list = $('.list>li')
        if ($list.length == 0) {
            $('.list,.tools,.headerTools').hide();
        }
    }

    // 触摸滑动事件
    // 左滑 显示单个删除
    $contanier
        .on('swipeLeft', 'li', function () {
            $('.delete').removeClass('show')
            $(this).find('.delete').addClass('show')
        })
        .on('swipeRight', 'li', function () {
            $(this).find('.delete').removeClass('show')
        })

    // 支付
    $payBtn.click(function () {

        let productId = selectedMovieId[0]
        if (selectedMovieId.length > 1) {
            for (let i = 1; i < selectedMovieId.length; i++) {
                productId += ',' + selectedMovieId[i]
            }
        }

        $.payment({
            productId: productId,
            success: () => {

                $.msg({
                    text: '恭喜，您已购买成功! 5s后跳转"我的影片"，可以去看片了',
                    timeout: 5000,
                    callback: () => {
                        // 跳转到我的影片
                        window.location = 'me.html#page-myMovie'
                    }
                })

            },
            wxPay: {
                type: 1, //影片购买
                title: `购物车-影片购买`
            }
        })

    })


}, 100)