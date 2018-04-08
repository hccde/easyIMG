const data = {
  // 市内
  'publish/inside': null,
  // 跨市
  'publish/outside': null
};

const api = {};

api.set = function (path, payload) {
  data[path] = payload
};
api.get = function (path) {
  return data[path]
};

module.exports = api;
