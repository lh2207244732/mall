;
(function(w, d) {
    var page = {
        init: function() {
            this.cartBox = d.querySelector('.cart-box')
            this.cartCount = d.querySelector('.cart-count')
            this.cartContent = d.querySelector('.cart-content')
            this.handleCart()
        },
        handleCart: function() {
            var _this = this
                // 显示购物车中商品数量
            this.loadCartsCount()
                // 显示下拉购物车
            this.cartBox.addEventListener('mouseenter', function() {
                    show(_this.cartContent)
                        //添加等待框动画
                    _this.cartContent.innerHTML = '<div class="loader"></div>'
                        // 发送ajax请求
                    utils.ajax({
                        method: 'GET',
                        url: '/carts',
                        success: function(data) {
                            if (data.code == 0) {
                                // 如果状态码为0则请求成功
                                _this.renderCart(data.data.cartList)
                            } else {
                                //请求失败
                                _this.cartContent.innerHTML = '<span class="empty-cart">请求失败,请稍后再试</span>'
                            }
                        }
                    })
                }, false)
                // 隐藏下拉购物车
            this.cartBox.addEventListener('mouseleave', function() {
                hide(_this.cartContent)
            }, false)
        },
        loadCartsCount: function() {
            utils.ajax({
                method: 'GET',
                url: '/carts/count',
                success: function(data) {
                    this.cartCount.innerHTML = data.data
                }.bind(this)
            })
        },
        renderCart: function(list) {
            var len = list.length
            if (len > 0) {
                var html = '';
                html += '<span class="cart-tip">最近加入的宝贝</span>'
                html += '<ul>'
                for (var i = 0; i < len; i++) {
                    html += '<li class="cart-item clearfix">'
                    html += '<a href="#" target="_blank">'
                    html += '<img src=" ' + list[i].product.mainImage + '" alt="">'
                    html += '<span class="text-ellipsis">' + list[i].product.name + '</span>'
                    html += '</a>'
                    html += '<span class="product-count">x' + list[i].count + '</span><span class="product-price">'
                    list[i].product.price + '</span>'
                    html += '</li>'
                }
                html += '</ul>'
                html += '<span class="line"></span>'
                html += '<a href="/cart.html" class="btn cart-btn">查看我的购物车</a>'
                this.cartContent.innerHTML = html

            } else {
                this.cartCount.innerHTML = '<span class="empty-cart">购物车中还没有商品,赶快去添加吧</span>'
            }
        }
    }
    page.init()
})(window, document);
// 轮播图
new Carousel({
    id: 'carousel-wrap',
    imgs: [
        './images/solid1.jpg',
        './images/solid2.jpg',
        './images/solid3.jpg'
    ],
    width: 862,
    height: 440,
    interval: 2000
})