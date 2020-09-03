// ;
// (function(w, d) {
//     var page = {
//         init: function() {
//             this.loadCartsCount()
//             this.countCar = d.querySelector('.cart-count')
//         },
//         loadCartsCount: function() {
//             utils.ajax({
//                 url: '/carts/count',
//                 success: function(data) {
//                     this.countCar.innerHTML = data.data
//                 }.bind(this),
//                 error: function(status) {
//                     console.log(status)
//                 }
//             })
//         }
//     }
//     page.init()
// })(window, document);
// 下拉购物车部分开始
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
(function(d, w) {
    function Carousel(options) {
        //1.罗列属性
        this.id = options.id
        this.carouselWrap = d.getElementById(this.id)
        this.width = options.width
        this.height = options.height
        this.imgs = options.imgs
        this.len = this.imgs.length
        this.interval = options.interval
        this.timer = 0
            // 当前索引
        this.activeIndex = 0
            // 点击索引
        this.nextIndex = 0
            //2初始化
        this.init()
            //3绑定事件
        this.bindEvent()
        this.autuPlay()
    }
    Carousel.prototype = {
        constructor: Carousel,
        init: function() {
            this.carouselWrap.className = 'carousel-wrap'
            this.carouselWrap.style.width = this.width + 'px'
            this.carouselWrap.style.height = this.height + 'px'
            this.carouselImgs = d.createElement('ul')
            this.carouselImgs.className = 'carousel-imgs'
            this.leftBtn = d.createElement('span')
            this.leftBtn.className = 'left-btn'
            this.rightBtn = d.createElement('span')
            this.rightBtn.className = 'right-btn'
            this.carouselBtns = d.createElement('ul')
            this.carouselBtns.className = 'carousel-btns'
            for (var i = 0; i < this.len; i++) {
                this.imgsItem = d.createElement('li')
                var img = d.createElement('img')
                img.src = this.imgs[i]
                this.btnItem = d.createElement('li')
                if (this.activeIndex == i) {
                    this.btnItem.className = 'btnItem active'
                    this.imgsItem.className = 'imgsItem show'
                } else {
                    this.btnItem.className = 'btnItem'
                    this.imgsItem.className = 'imgsItem'
                }
                this.imgsItem.appendChild(img)
                this.carouselImgs.appendChild(this.imgsItem)
                this.carouselBtns.appendChild(this.btnItem)
            }
            this.carouselWrap.appendChild(this.carouselImgs)
            this.carouselWrap.appendChild(this.leftBtn)
            this.carouselWrap.appendChild(this.rightBtn)
            this.carouselWrap.appendChild(this.carouselBtns)
        },
        bindEvent: function() {
            var _this = this
            this.leftBtn.onclick = function() {
                _this.nextIndex--
                    _this.setCorrectIndex()
                _this.tab()
            }
            this.rightBtn.onclick = function() {
                _this.nextIndex++
                    _this.setCorrectIndex()
                _this.tab()
            }
            for (var i = 0; i < this.len; i++) {;
                (function(i) {
                    _this.carouselBtns.children[i].onclick = function() {
                        _this.carouselImgs.children[_this.activeIndex].className = 'imgsItem'
                        _this.carouselBtns.children[_this.activeIndex].className = 'btnItem'
                        _this.carouselImgs.children[i].className = 'imgsItem show'
                        _this.carouselBtns.children[i].className = 'btnItem active'
                        _this.activeIndex = i
                    }
                })(i)
            }
        },
        setCorrectIndex: function() {
            if (this.nextIndex > this.len - 1) {
                this.nextIndex = 0
            }
            if (this.nextIndex < 0) {
                this.nextIndex = this.len - 1
            }
        },
        tab: function() {
            this.carouselImgs.children[this.activeIndex].className = 'imgsItem'
            this.carouselBtns.children[this.activeIndex].className = 'btnItem'
            this.carouselImgs.children[this.nextIndex].className = 'imgsItem show'
            this.carouselBtns.children[this.nextIndex].className = 'btnItem active'
            this.activeIndex = this.nextIndex
        },
        autuPlay: function() {
            var _this = this
            this.timer = setInterval(this.rightBtn.onclick, this.interval)
            this.carouselWrap.onmouseenter = function() {
                clearInterval(_this.timer)
            }
            this.carouselWrap.onmouseleave = function() {
                _this.timer = setInterval(_this.rightBtn.onclick, _this.interval)
            }
        }
    }
    new Carousel({
        id: 'carousel-wrap',
        imgs: [
            './images/solid1.jpg',
            './images/solid2.jpg',
            './images/solid3.jpg'
        ],
        width: 862,
        height: 500,
        interval: 2000
    })
})(document, window)