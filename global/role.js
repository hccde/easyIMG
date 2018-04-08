const api = {}
const key = 'role'

let role = ''

api.get = () => {
  if (!role) {
    role = wx.getStorageSync(key)

    if(!role) {
      role = 'passenger'
      // role = 'driver'
    }
  }
  return role
}

api.set = (r) => {
  role = r
  wx.setStorageSync(key, r)
}

export default api
