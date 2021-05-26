import request from '@/utils/request'

export function getBidByBid(bid) {
  return request({
    url: `/product/bids/${bid}`,
    method: 'get'
  })
}

export function getMyBids(params) {
  return request({
    url: '/user/bids',
    method: 'get',
    params
  })
}

export function getBidsByPid(pid) {
  return request({
    url: `/product/${pid}/bids`,
    method: 'get'
  })
}

export function getBidsByPidByPages(pid, page, pagelimit) {
  return request({
    url: `/product/${pid}/bids?page=${page}&pageSize=${pagelimit}`,
    method: 'get'
  })
}

export function createBid(data) {
  return request({
    url: '/product/bids/create',
    method: 'post',
    data
  })
}
