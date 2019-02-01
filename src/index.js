const getMaskMap = require('./get-mask-map').default;
const getCursorBeginDiff = require('./get-cursor-begin-diff').default;

/**
 * @param {Object[]} mask
 * @param {Object} [config]
 * @param {Object} [config.defaultParams]
 */
function createMask(mask, config = {}) {
  const {
    defaultParams = { value: '', cursor: 0 },
    defaultResult = { value: '', space: '', isMatched: false, cursor: null },
  } = config;
  const prev = {
    maskMap: [],
    result: { ...defaultResult },
    params: { ...defaultParams },
  };

  return (params) => {
    let { cursor = 0 } = params;
    const maskMap = getMaskMap(mask, params);

    // Получим текущий суммарный результат
    const result = maskMap.reduce((result, el) => ({
      value: `${result.value}${el.value}`,
      space: `${result.space}${el.space}`,
      isMatched: result.isMatched || el.isMatched,
      cursor: result.cursor,
    }), { value: '', space: '', isMatched: false, cursor });

    // Получим корректное значени курсора
    const cursorBeginDiff = getCursorBeginDiff(
      prev.result.value,
      result.value,
    );
    let newCursor = cursor;

    maskMap.forEach((el) => {
      if (
        el.minCursor >= cursorBeginDiff
        && el.minCursor <= newCursor
      ) {
        newCursor += el.value.length - 1;
      }
    });

    result.cursor = maskMap.reduce((res, el) => {
      return (res === null
        && el.minCursor <= newCursor
        && newCursor <= el.maxCursor
      )
        ? el.maxCursor
        : res
    }, null) || newCursor;

    if (result.cursor > result.value.length) {
      result.cursor = result.value.length;
    }

    prev.maskMap = maskMap;
    prev.result = result;
    prev.params = params;

    return result;
  };
}

exports.default = createMask;
