export const productStatuOption = new Map()
productStatuOption['pending'] = 0
productStatuOption['waiting'] = 1
productStatuOption['bidding'] = 2
productStatuOption['extended1'] = 3
productStatuOption['extended2'] = 4
productStatuOption['extended3'] = 5
productStatuOption['broughtIn'] = 6
productStatuOption['success'] = 7
productStatuOption['canceled'] = 8

export const productCat = [{
  value: 'cell phone',
  label: 'Mobile Phones'
}, {
  value: 'tablet',
  label: 'Tablets'
}, {
  value: 'poortable audio',
  label: 'Portable Audio'
}, {
  value: 'camera',
  label: 'Camera'
}, {
  value: 'accessory',
  label: 'Accessory'
}, {
  value: 'computer',
  label: 'Computer'
}, {
  value: 'network hardware',
  label: 'Network Hardware'
}, {
  value: 'car electronics',
  label: 'Car Electronics'
}, {
  value: 'game console',
  label: 'Game Console'
}, {
  value: 'vr',
  label: 'VR Device'
}, {
  value: 'others',
  label: 'Others'
}]

export const defaultProductForm = {
  pid: 0,
  uid: 0,
  title: '',
  description: '',
  cate1: '',
  cate2: '',
  cate3: '',
  createTime: '',
  startTime: '',
  endTime: '',
  startPrice: 1.0,
  autoWinPrice: 0.0,
  reservedPrice: 0.0,
  minIncrement: 1.0,
  productStatus: {
    psid: 0,
    pid: 0,
    price: 0.0,
    status: '',
    endTime: ''
  },
  figures: [
    {
      fid: 0,
      pid: 0,
      url: '',
      description: '',
      updatedTime: '',
      thumbnail: true
    }
  ],
  thumbnail: {
    fid: 0,
    pid: 0,
    url: '',
    description: '',
    updatedTime: '',
    thumbnail: true
  },
  canceled: false,
  passed: false
}

export const defaultSellerInfo =
{
  uid: 1,
  username: 'Arthur',
  role: 'user',
  portrait: 'https://alwayswin-figures.s3.amazonaws.com/icon/default-icon.png',
  token: ''
}
