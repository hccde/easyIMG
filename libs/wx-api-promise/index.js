const copy = require('./copy');
const functions = require('./functions');
const events = require('./events');

const api = {};

functions.forEach(function (name) {
  api[name] = function (options) {
    const params = copy(options);
    return new Promise(function (resolve, reject) {
      params.success = (res) => {
        resolve({
          success: true,
          res: res,
          err: null
        })
      };
      params.fail = (err) => {
        resolve({
          success: false,
          res: null,
          err: err
        })
      };
      wx[name](params);
    });
  };
});

events.forEach(function (name) {
  api[name] = wx[name];
});

export default api
