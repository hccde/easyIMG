const {request, file} = require('./base/index')

const api = {}

api.login = (params) => request({
  url: '/usercenter/login',
  method: 'POST',
  params: params
})

api.getCustomerInfo = () => request({
  url: '/usercenter/getCustomerInfo',
  method: 'POST'
})








export default api
