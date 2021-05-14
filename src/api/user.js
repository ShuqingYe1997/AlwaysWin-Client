import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}

export function changePassword(data) {
  return request({
    url: '/user/change-password',
    method: 'put',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/my-info',
    method: 'get'
  })
}

export function updateInfo(data) {
  return request({
    url: '/user/my-info/update',
    method: 'put',
    data
  })
}

export function addFund(data) {
  return request({
    url: '/user/add-funds',
    method: 'put',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
