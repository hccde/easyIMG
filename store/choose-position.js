// 存储choose-position选择的位置


const positions = {}

const api = {}

api.get = (name) => {
  return positions[name]
}

api.set = (name, position) => {
  positions[name] = position
}

export default api
