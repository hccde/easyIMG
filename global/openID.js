const api = {}

let openID = ''

api.get = () => openID

api.set = (id) => {
  openID = id
}

export default api
