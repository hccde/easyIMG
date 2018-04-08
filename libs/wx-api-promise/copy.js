module.exports = function (options) {
  if (!options)
    return {};

  const result = {};
  for (let key of Object.keys(options)) {
    if (['success', 'fail', 'complete'].indexOf(key) >= 0)
      return;
    result[key] = options[key];
  }
  return result;
};
