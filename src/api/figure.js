import request from '@/utils/request'

export function uploadFigure(form_data) {
  return request({
    url: '/product/figure/upload',
    method: 'post',
    data: form_data,
    config: { headers: { 'Content-Type': 'multipart/form-data' }
    }})
}

export function createFigure(data) {
  return request({
    url: '/product/figure/create',
    method: 'post',
    data
  })
}

export function deleteFigure(fid) {
  return request({
    url: `/product/figure/delete/${fid}`,
    method: 'delete'
  })
}

export function updateFigure(fid, data) {
  return request({
    url: `/product/figure/update/${fid}`,
    method: 'put',
    data
  })
}
