var USE_MOCK = true
if (USE_MOCK) {
    Mock.mock('/carts/count', 'get', {
        'code': 0,
        'data|1-100': 100
    })
}