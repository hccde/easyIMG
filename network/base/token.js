const api = {}

let token = ''

api.get = () => token

api.set = (t) => {
  token = t
}

export default api
