// 存储car info选择的车辆


const certificate = {};

const api = {}

api.get = (name) => {
  return certificate[name]
}

api.set = (name,value) => {
  certificate[name] = value
}

export default api
