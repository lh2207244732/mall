;
(function(w, d) {
    var page = {
        init: function() {
            this.loadCartsCount()
            this.countCar = d.querySelector('.content')
        },
        loadCartsCount: function() {
            utils.ajax({
                url: '/carts/count',
                success: function(data) {
                    this.countCar.innerHTML = data.data
                }.bind(this),
                error: function(status) {
                    console.log(status)
                }
            })
        }
    }
    page.init()
})(window, document);