/**
 * @param {Object[]} mask
 * @param {Object} [config]
 */
function createMask(mask, config = {}) {
  return (defaultParams = { value: '', cursor: 0 }) => {
    const prev = {
      resultMap: null,
      result: null,
    };

    /**
     * @param {Object} params
     * @param {String} params.value
     * @param {Number} params.cursor
     */
    const run = (params) => {
      let { value, cursor } = params;

      if (config.after) {
        ({ value, cursor = cursor } = config.after({ value, cursor }));
      }

      const resultMap = [];

      mask.forEach((maskElement, index) => {
        if (maskElement instanceof Function) {
          maskElement = maskElement(resultMap, index);
        }

        const matchResult = value.match(maskElement.match);
        const res = { value: '', cursor: 0, space: '' };

        if (matchResult) {
          res.value = matchResult[0].replace(maskElement.match, maskElement.replace);
          res.cursor = res.value.length;

          value = value.replace(maskElement.match, '');
        } else {
          res.space = maskElement.space;

          value = '';
        }

        resultMap.push(res);
      });

      const result = resultMap.reduce((result, maskResult) => ({
        value: `${result.value}${maskResult.value}`,
        cursor: result.cursor + maskResult.cursor,
        space: `${result.space}${maskResult.space}`,
      }), { value: '', cursor: 0, space: '' });

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

        result.cursor = nextCursor === null ? cursor : nextCursor;
      }

      prev.resultMap = resultMap;
      prev.result = result;

      return {
        params: { ...params },
        result,
      };
    };

    run(defaultParams);

    return run;
  };
}

exports.default = createMask;
