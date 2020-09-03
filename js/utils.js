var utils = {
        ajax: function(options) {
            var method = options.method || 'GET'
            method = method.toUpperCase()

            var url = options.url || ''

            var data = options.data || ''

            var mime;

            if (method == 'GET' || method == 'DELETE') {
                mime = 'application/x-www-form-urlencoded'

                if (data) {

                    var query = ''

                    for (var key in data) {
                        query += key + '=' + data[key] + '&'
                    }
                    query = '?' + query.slice(0, -1)

                    url = url + query
                }

            } else if (method == 'POST' || method == 'PUT') {
                mime = 'application/json'
                if (data) {
                    data = JSON.stringify(data)
                }
            }



            var xhr = new XMLHttpRequest()

            //携带cookie
            xhr.withCredentials = true

            xhr.open(method, url, true)

            mime ? xhr.setRequestHeader('Content-Type', mime) : null

            xhr.send(data)

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {

                    if (xhr.status == 200) {
                        try {
                            var obj = JSON.parse(xhr.responseText)
                            typeof options.success == 'function' ? options.success(obj) : null
                        } catch (e) {
                            typeof options.error == 'function' ? options.error(xhr.status, e) : null
                        }

                    } else {
                        typeof options.error == 'function' ? options.error(xhr.status) : null
                    }
                }
            }
        }
    }
    // 显示函数
function show(elem) {
    elem.style.display = 'block'
}
// 隐藏函数
function hide(elem) {
    elem.style.display = 'none'
};
(function(w, d) {
    function Carousel(options) {
        //1.罗列属性
        this.id = options.id
        this.carouselWrap = document.getElementById(this.id)
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
            this.rightBtn.innerHTML = '&gt;'
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
    w.Carousel = Carousel
})(window, document)