import request from '@/utils/request'

export function overview(page, pagelimit) {
  return request({
    url: `/product/overview?page=${page}&pageSize=${pagelimit}`,
    method: 'get'
  })
}

export function overviewByCat(page, pagelimit, cate) {
  return request({
    url: `/product/overview?page=${page}&pageSize=${pagelimit}&cate=${cate}`,
    method: 'get'
  })
}

export function productDetail(pid) {
  return request({
    url: `/product/${pid}`,
    method: 'get'
  })
}

export function cancelProduct(pid) {
  return request({
    url: `/product/cancel/${pid}`,
    method: 'put'
  })
}

export function updateProduct(data) {
  return request({
    url: '/product/post',
    method: 'put',
    data
  })
}

export function createProduct(data) {
  return request({
    url: '/product/create',
    method: 'post'
  })
}

export function updateProductStatus(data) {
  return request({
    url: '/productStatus/post',
    method: 'put',
    data
  })
}

export function getMyProducts() {
  return request({
    url: '/user/my-products',
    method: 'get'
  })
}

export function getProductStatus(pid) {
  return request({
    url: `/productStatus/${pid}`,
    method: 'get'
  })
}
