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

        res.isMatched = true;

        value = value.replace(maskElement.match, '');
      } else {
        res.space = maskElement.space || '';

        res.cursor = (maskElement.space || '').length;

        res.isMatched = false;

        value = '';
      }

      const prevMaxCursor = result[index - 1]
        ? result[index - 1].maxCursor || 0
        : 0;

      res.minCursor = prevMaxCursor + 1;
      res.maxCursor = prevMaxCursor + res.cursor;

      result.push(res);

      return result;
    }, []);

    // console.log(resultMap);

    // Получим текущий суммарный результат
    const result = resultMap.reduce((result, maskResult) => ({
      value: `${result.value}${maskResult.value}`,
      space: `${result.space}${maskResult.space}`,
      isMatched: result.isMatched || maskResult.isMatched,
      cursor: (result.cursor === null
          && maskResult.minCursor <= cursor
          && cursor <= maskResult.maxCursor
        )
          ? maskResult.maxCursor
          : result.cursor,
    }), { value: '', space: '', isMatched: false, cursor: null });

    // Получим значение курсора
    // if (prev.result) {
    //   let nextCursor = null;
    //   let currCursor = 0;

    //   if (resultMap) {
    //     resultMap.forEach((maskElement, index) => {
    //       currCursor += maskElement.cursor;

    //       if (
    //         nextCursor === null
    //         && maskElement.value !== prev.resultMap[index].value
    //       ) {
    //         nextCursor = currCursor;
    //       }
    //     });
    //   }

    //   result.cursor = nextCursor === null ? cursor : nextCursor;
    // }

    prev.resultMap = resultMap;
    prev.result = result;

    return { params: { ...params }, result };
  };

  runMask(defaultParams);

  return runMask;
}

exports.default = createMask;
