const {request, file} = require('./base/index')

const api = {}

api.login = (params) => request({
  url: '/usercenter/login',
  method: 'POST',
  params: params
})

api.getCustomerInfo = (params) => request({
  url: '/usercenter/getCustomerInfo',
  method: 'POST',
  params:params
})

api.addCustomerInfo = (params) => request({
  url: '/usercenter/addCustomerInfo',
  method: 'POST',
  params:params
})







export default api
