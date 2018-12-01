const runMask = require('./run-mask');

module.exports = (params) => {
  const {
    value,
    masks,
    cursor,
    preprocess,
    postprocess,
  } = params;
  let result = { value, cursor, maskApplied: false };

  if (!(masks instanceof Array)) {
    throw new Error('Params `masks` in run-mask is not type `array`');
  }

  for (index = 0; index < masks.length; index++) {
    const runMaskResult = runMask({
      mask: masks[index],
      value,
      cursor,
      preprocess,
      postprocess,
    });

    if (runMaskResult.maskApplied) {
      result = runMaskResult;
      break;
    }
  }

  return result;
};
