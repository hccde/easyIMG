const {request, file} = require('./base/index')

const api = {}

api.login = (params) => request({
  url: '/usercenter/login',
  method: 'POST',
  params: params
})

api.verifyPhone = (params) => request({
  url: '/usercenter/verifyPhone',
  method: 'POST',
  params: params
})

api.getCustomerInfo = () => request({
  url: '/usercenter/getCustomerInfo',
  method: 'POST'
})

api.modifyCustomerInfo = (params) => request({
  url: '/usercenter/modifyCustomerInfo',
  method: 'POST',
  params: params
})
api.uploadFile = (params) => {
  return file({
    url:'/usercenter/oss/upload',
    params:params
  });
}
api.getBrands = (params) => request({
  url: '/usercenter/getBrands',
  method: 'POST',
  params: params
})
api.getCertification = (params) => request({
  url: '/usercenter/getCertification',
  method:'POST',
  params:params
})
//查询是否认证
api.getCertiStatus = (params) => request({
  url: '/usercenter/getCertiStatus',
  method:'POST',
  params:params
})
//ocr driver
api.ocrDriver = (params) => file({
  url: '/usercenter/ocrDriverLicense',
  method: 'POST',
  params: params
})
//ocr vehicle
api.ocrVehicle = (params) => file({
  url: '/usercenter/ocrVehicleLicense',
  method: 'POST',
  params: params
})







export default api
