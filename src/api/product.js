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

export function productStatus() {
  return ({
    'pending': {
      value: 'pending',
      type: 'info',
      text: 'Pending'
    },
    'waiting': {
      value: 'waiting',
      type: 'info',
      text: 'Waiting'
    },
    'bidding': {
      value: 'bidding',
      type: 'success',
      text: 'Bidding'
    },
    'extended1': {
      value: 'extended1',
      type: 'success',
      text: 'Extending Phase 1'
    },
    'extended2': {
      value: 'extended2',
      type: 'danger',
      text: 'Extending Phase 2'
    },
    'extended3': {
      value: 'extended3',
      type: 'danger',
      text: 'Extending Phase 3'
    },
    'broughtIn': {
      value: 'broughtIn',
      type: 'info',
      text: 'Brought In'
    },
    'success': {
      value: 'success',
      type: 'warning',
      text: 'Sold'
    },
    'canceled': {
      value: 'canceled',
      type: 'info',
      text: 'Canceled'
    }
  })
}
