;
(function(w, d) {
    var page = {
        init: function() {
            this.cartBox = d.querySelector('.cart-box')
            this.cartCount = d.querySelector('.cart-count')
            this.cartContent = d.querySelector('.cart-content')
            this.searchInput = d.querySelector('.search-input')
            this.searchVal = d.querySelector('.search-input input')
            this.searchBtn = d.querySelector('.search-btn')
            this.searchLayer = d.querySelector('.search-layer')
            this.categories = d.querySelector('.categories')
            this.parentCategories = d.querySelector('.parent-categories')
            this.childCategories = d.querySelector('.child-categories')
            this.handleCart()
            this.handSearch()
            this.handCategories()
            this.handCarousel()
        },
        handleCart: function() {
            var _this = this
                // 显示购物车中商品数量
            this.loadCartsCount()
                // 显示下拉购物车
            this.cartBox.addEventListener('mouseenter', function() {
                    utils.show(_this.cartContent)
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
                utils.hide(_this.cartContent)
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
                    html += '<span class="product-count">x' + list[i].count + '</span><span class="product-price">' +
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
        },
        handSearch: function() {
            var _this = this
                // 监听点击搜索
            this.searchBtn.addEventListener('click', function() {
                    _this.handClick()
                }, false)
                // 监听输入事件,自动提示
            this.searchVal.addEventListener('input', function() {
                // 显示下拉框
                utils.show(_this.searchLayer)
                    // 获取内容
                _this.getSearchData()
            }, false)
        },
        getSearchData: function() {
            var _this = this
            var keyword = this.searchVal.value
            utils.ajax({
                url: '/products/search',
                data: {
                    keyword: keyword
                },
                success: function(data) {
                    if (data.code == 0) {
                        _this.renderSearch(data.data)
                    }
                }
            })
        },
        renderSearch: function(list) {
            var len = list.length
            console.log(list)
            var html = ''
            for (var i = 0; i < len; i++) {
                html += `<li class="search-item">${list[i].name}</li>`
            }
            this.searchLayer.innerHTML = html
        },
        //提交
        handClick: function() {
            var keyword = this.searchVal.value
            w.location.href = './list.html?keyword=' + keyword
        },
        handCategories: function() {
            var _this = this
            this.getParentitems()
                // 监听移入事件
            this.parentCategories.addEventListener('mouseover', function(ev) {
                var elem = ev.target
                if (elem.className == 'parent-categories-item') {
                    var pid = elem.getAttribute('data-id')
                        // 显示右侧面板
                    utils.show(_this.childCategories)
                        // 获取生成面板内容
                    _this.getChildCategories(pid)
                }
            }, false)
            this.categories.addEventListener('mouseleave', function() {
                //隐藏右侧内容
                utils.hide(_this.childCategories)

            }, false)
        },
        getParentitems: function() {
            var _this = this
            utils.ajax({
                url: '/categories/arrayCategories',
                success: function(data) {
                    if (data.code == 0) {
                        _this.addParentCategories(data.data)
                    } else {
                        this.parentCategories.innerHTML = data.messgae
                    }
                }
            })
        },
        getChildCategories: function(pid) {
            var _this = this
            utils.ajax({
                url: '/categories/childArrayCategories',
                data: {
                    pid: pid
                },
                success: function(data) {
                    if (data.code == 0) {
                        _this.renderChildCategoies(data.data)
                    }
                }
            })
        },
        addParentCategories: function(list) {
            var len = list.length
            var html = '<ul>'
            for (var i = 0; i < len; i++) {
                html += `<li class="parent-categories-item" data-id=${list[i]._id}>${list[i].name}</li>`
            }
            html += '</ul>'
            this.parentCategories.innerHTML = html
        },
        renderChildCategoies: function(list) {
            var len = list.length
            var html = '<ul>'
            for (var i = 0; i < len; i++) {
                html += ` 
               <li class="child-item">
                   <a href="#">
                       <img src="${list[i].icon}" alt="">
                       <p>${list[i].name}</p>
                   </a>
               </li>`
            }
            html += '</ul>'
            this.childCategories.innerHTML = html
        },
        handCarousel: function() {
            var _this = this
            utils.ajax({
                url: ' /ads/positionAds',
                position: 1,
                success: function(data) {
                    _this.renderCarousel(data.data)
                }
            })
        },
        renderCarousel: function(list) {
            var imgs = list.map(function(value) {
                return value.image
            })
            new Carousel({
                id: 'swiper',
                imgs: imgs,
                width: 862,
                height: 440,
                playInterval: 2000
            })
        }
    }
    page.init()
})(window, document);