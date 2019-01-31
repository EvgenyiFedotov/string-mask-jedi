/**
 * @param {Object[]} mask
 * @param {Object} [config]
 * @param {Object} [config.defaultParams]
 */
function createMask(mask, config = {}) {
  const {
    defaultParams = { value: '', cursor: 0 },
  } = config;
  const prev = { resultMap: [], result: null, params: defaultParams };

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
    let currentCursor = cursor;

    let cursorNotDiff = 0;

    // Вычисли курсор который укажет откуда начались изменения
    if (prev.result) {
      for (let index = 0; index < value.length; index++) {
        if (prev.result.value[index] !== value[index]) {
          cursorNotDiff = index;
          break;
        }
      }
    }

    console.log('@cursorNotDiff', cursorNotDiff);

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



      if (
        prev.resultMap[index]
        && prev.resultMap[index].value !== res.value
        && res.minCursor < currentCursor
        && res.minCursor <= cursorNotDiff
      ) {
        currentCursor += res.value.length - 1;
      }

      // if (prev.resultMap[index]) {
      //   res.isChange = prev.resultMap[index].value !== res.value;
      //   res.isCursor = cursor <= res.maxCursor;
      // }

      // if (
      //   prev.resultMap[index]
      //   && prev.resultMap[index].value !== res.value
      //   && res.minCursor < cursor
      //   // && cursor <= res.maxCursor
      // ) {
      //   const prevValue = prev.resultMap[index].value.split('');
      //   const addChange = res.value.split('').reduce((rs, val, index) => {
      //     if (val !== prevValue[index]) {
      //       rs++;
      //     }

      //     return rs;
      //   }, 0);

      //   currentCursor += res.value.length - addChange;
      // }

      // if (
      //   res.minCursor <= cursor
      //   && cursor <= res.maxCursor
      // ) {
      //   cursor += res.cursor - 1;
      // }

      result.push(res);

      return result;
    }, []);

    // console.log(currentCursor, resultMap);

    // Получим текущий суммарный результат
    const result = resultMap.reduce((result, maskResult) => ({
      value: `${result.value}${maskResult.value}`,
      space: `${result.space}${maskResult.space}`,
      isMatched: result.isMatched || maskResult.isMatched,

      // Установка курсора отлительно элемента маски
      cursor: (result.cursor === null
          && maskResult.minCursor <= currentCursor
          && currentCursor <= maskResult.maxCursor
        )
          ? maskResult.maxCursor
          : result.cursor,
    }), { value: '', space: '', isMatched: false, cursor: null });

    prev.resultMap = resultMap;
    prev.result = result;
    prev.params = params;

    return { params: { ...params }, result };
  };

  runMask(defaultParams);

  return runMask;
}

exports.default = createMask;
