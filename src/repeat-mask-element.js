module.exports = (maskElement, count = 1) => {
  const result = [];

  for (let index = 0; index < count; index++) {
    result.push(maskElement);
  }

  return result;
};
