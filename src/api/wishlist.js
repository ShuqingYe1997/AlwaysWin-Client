import request from '@/utils/request'

export function getListByWid(wid) {
  return request({
    url: `/wishlist/wid/${wid}`,
    method: 'get'
  })
}

export function myWishList() {
  return request({
    url: '/my-wishlist',
    method: 'get'
  })
}

export function addToWishList(data) {
  return request({
    url: '/wishlist/create',
    method: 'post',
    data
  })
}

export function deleteFromWishListByWid(wid) {
  return request({
    url: `/wishlist/delete/${wid}`,
    method: 'delete'
  })
}

export function checkInWishList(uid, pid) {
  return request({
    url: `/wishlist/${uid}/${pid}`,
    method: 'post'
  })
}

export function deleteFromWishList(uid, pid) {
  return request({
    url: `/wishlist/${uid}/${pid}`,
    method: 'delete'
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
