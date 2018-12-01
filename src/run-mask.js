const runMaskElement = (params) => {
  const { element, result, index } = params;
  const {
    valueParams,
    value,
    cursorParams,
    cursor,
  } = result;
  const { match, replace } = element;

  if (!match && !replace) {
    throw new Error('Mask element does not contain prop `match` or `replace`');
  }

  const matchResult = valueParams.match(match);

  if (matchResult) {
    const maskValue = matchResult[0].replace(match, replace);

    result.value = `${value}${maskValue}`;
    result.valueParams = valueParams.replace(match, '');

    if (element.cursor instanceof Object) {
      const { position, value } = element.cursor;
      const isPosition = position
        && position[0] <= cursorParams
        && cursorParams <= position[1];
      const isValueFunction = value instanceof Function
        && !element.cursor.index;

      if (isPosition || isValueFunction) {
        cursor.index = index;

        if (isValueFunction) {
          cursor.args = [maskValue, cursorParams, matchResult];
        }
      }
    }

    return true;
  }

  return false;
};

module.exports = (params = {}) => {
  const {
    value,
    mask,
    cursor,
    preprocess,
    postprocess,
  } = params;
  const result = {
    valueParams: value,
    cursorParams: cursor,
    value: '',
    cursor: {
      index: null,
      args: null,
    },
    maskApplied: false,
  };

  if (typeof value !== 'string') {
    throw new Error('Params `value` in run-mask is not type `string`');
  }

  if (!(mask instanceof Array)) {
    throw new Error('Params `mask` in run-mask is not type `array`');
  }

  if (preprocess) {
    result.valueParams = preprocess(result.valueParams);
  }

  for (let index = 0; index < mask.length; index++) {
    const resultElement = runMaskElement({
      element: mask[index],
      result,
      index,
    });

    if (!resultElement) {
      break;
    }
  }

  if (result.value && postprocess) {
    result.value = postprocess(result.value);
  }

  if (!result.value || result.value === value) {
    result.value = value;
    result.cursor = cursor || result.value.length;
  } else {
    result.maskApplied = true;

    if (result.cursor.index) {
      const maskElement = mask[result.cursor.index];
  
      if (maskElement.cursor.value instanceof Function) {
        const cursorValueResult = maskElement.cursor.value(...result.cursor.args);
  
        if (typeof cursorValueResult === 'number') {
          result.cursor = cursorValueResult;
        } else {
          result.cursor = cursor || result.value.length;
        }
      } else if (typeof maskElement.cursor.value === 'number') {
        result.cursor = maskElement.cursor.value;
      } else {
        result.cursor = cursor || result.value.length;
      }
    } else {
      result.cursor = cursor || result.value.length;
    }
  }

  delete result.valueParams;
  delete result.cursorParams;

  return result;
};
