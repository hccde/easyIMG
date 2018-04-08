module.exports = function (duration) {
  let timer = null;
  const promise = new Promise(function (resolve, reject) {
    timer = setTimeout(function () {
      resolve();
    }, duration);
  });
  return {
    promise: promise,
    cancel: function () {
      clearTimeout(timer);
      timer = null;
    }
  };
};
