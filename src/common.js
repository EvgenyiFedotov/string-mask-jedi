function addObject(result = {}, obj) {
  if (obj) {
    Object.keys(obj).forEach((key) => {
      result[key] = obj[key];
    });
  }

  return result;
}

function mergeObjects() {
  const args = Array.prototype.slice.call(arguments);
  const result = {};

  args.forEach(obj => addObject(result, obj));

  return result;
}

function cloneObject(obj) {
  return addObject({}, obj);
}

module.exports = {
  addObject,
  mergeObjects,
  cloneObject,
};
