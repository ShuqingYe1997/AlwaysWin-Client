import request from '@/utils/request'

export function getOrderByOid(oid) {
  return request({
    url: `/order/oid/${oid}`,
    method: 'get'
  })
}

export function getOrderByNumber(number) {
  return request({
    url: `/order/number/${number}`,
    method: 'get'
  })
}

export function getMyOrder(params) {
  return request({
    url: '/order/my-order',
    method: 'get',
    params
  })
}

export function createOrder(data) {
  return request({
    url: '/order/create',
    method: 'post',
    data
  })
}

export function updateOrder(oid, data) {
  return request({
    url: `/order/update/${oid}`,
    method: 'put',
    data
  })
}

export function deleteOrder(oid) {
  return request({
    url: `/order/delete/${oid}`,
    method: 'delete'
  })
}

export function getOrderStatus() {
  return ({
    'placed': {
      value: 'placed',
      type: 'danger',
      text: 'Placed'
    },
    'paid': {
      value: 'paid',
      type: 'warning',
      text: 'Paid'
    },
    'shipped': {
      value: 'shipped',
      type: 'success',
      text: 'Shipped'
    },
    'received': {
      value: 'received',
      type: 'info',
      text: 'Received'
    }
  })
}
