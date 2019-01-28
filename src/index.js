/**
 * @param {Object[]} mask
 * @param {Object} [config]
 * @param {Object} [config.defaultParams]
 */
function createMask(mask, config = {}) {
  const {
    defaultParams = { value: '', cursor: 0 },
  } = config;
  const prev = { resultMap: null, result: null };

  /**
   * @param {Object} params
   * @param {String} params.value
   * @param {Number} params.cursor
   */
  const runMask = (params) => {
    let {
      value = '',
      cursor = 0,
    } = params;

    // Проанализируем переданное значение с помощью маски
    const resultMap = mask.reduce((result, getMaskElement, index) => {
      const maskElement = getMaskElement(result, index);
      const matchResult = value.match(maskElement.match);
      const res = { value: '', cursor: 0, space: '' };

      if (matchResult) {
        res.value = matchResult[0].replace(
          maskElement.match,
          maskElement.replace,
        );
        res.cursor = res.value.length;

        value = value.replace(maskElement.match, '');
      } else {
        res.space = maskElement.space || '';

        value = '';
      }

      result.push(res);

      return result;
    }, []);

    // Получим текущий суммарный результат
    const result = resultMap.reduce((result, maskResult) => ({
      value: `${result.value}${maskResult.value}`,
      cursor: result.cursor + maskResult.cursor,
      space: `${result.space}${maskResult.space}`,
    }), { value: '', cursor: 0, space: '' });

    // Получим значение курсора
    if (prev.result) {
      let nextCursor = null;
      let currCursor = 0;

      if (resultMap) {
        resultMap.forEach((maskElement, index) => {
          currCursor += maskElement.cursor;

          if (
            nextCursor === null
            && maskElement.value !== prev.resultMap[index].value
          ) {
            nextCursor = currCursor;
          }
        });
      }

      console.log('@cursor', nextCursor, prev.resultMap, resultMap);

      result.cursor = nextCursor === null ? cursor : nextCursor;
    }

    prev.resultMap = resultMap;
    prev.result = result;

    return { params: { ...params }, result };
  };

  runMask(defaultParams);

  return runMask;
}

exports.default = createMask;
