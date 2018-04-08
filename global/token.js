const api = {}
const key = 'token'

let token = ''

api.get = () => {
  if (!token) {
    token = wx.getStorageSync(key)
  }
  return token
}

api.set = (t) => {
  token = t
  wx.setStorageSync(key, t)
}

export default api
