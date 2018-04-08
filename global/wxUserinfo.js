const api = {}

let userinfo = null

api.get = () => userinfo

api.set = (info) => {
  userinfo = info
}

export default api
