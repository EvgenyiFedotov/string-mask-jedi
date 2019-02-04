const getMaskMap = require('./get-mask-map');
const getCursorBeginDiff = require('./get-cursor-begin-diff');
const combine = require('./combine');
const masks = require('./masks');
const maskField = require('./mask-field');

/**
 * @param {Object[]} mask
 * @param {Object} [config]
 * @param {Object} [config.defaultParams]
 * @param {Object} [config.defaultResult]
 * @param {Function} [config.before]
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
    // Преобработка переданных параметров
    if (config.before) {
      params = config.before(params) || params;
    }

    let { value = '', cursor = 0 } = params;
    const maskMap = getMaskMap(mask, { value, cursor });

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
        // ?  > || >=
        el.minCursor > cursorBeginDiff
        && el.minCursor <= newCursor
      ) {
        newCursor += el.value.length - 1;
      }
    });

    // Получим курсор относительно елемента маски
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

module.exports = createMask;
module.exports.getMaskMap = getMaskMap;
module.exports.getCursorBeginDiff = getCursorBeginDiff;
module.exports.combine = combine;
module.exports.masks = masks;
module.exports.maskField = maskField;
