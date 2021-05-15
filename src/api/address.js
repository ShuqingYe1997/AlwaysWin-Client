import request from '@/utils/request'

export function getAddressByAid(aid) {
  return request({
    url: `/user/address/${aid}`,
    method: 'get'
  })
}

export function getMyAddress() {
  return request({
    url: '/user/address',
    method: 'get'
  })
}

export function createAddress(data) {
  return request({
    url: '/user/address/create',
    method: 'post',
    data
  })
}

export function updateAddress(aid, data) {
  return request({
    url: `/user/address/update/${aid}`,
    method: 'put',
    data
  })
}

export function deleteRole(aid) {
  return request({
    url: `/user/address/delete/${aid}`,
    method: 'delete'
  })
}
