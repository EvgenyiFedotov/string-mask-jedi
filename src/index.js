module.exports = (masks = [], params = {}) => {
  const { pre, post } = params;

  return (value, cursor) => {
    const valuePre = pre && pre(value);
    let valueCurrent = valuePre;
    let valueResult = '';
    let maskApplied = false;
    let maskCursor = cursor || value.length;

    for (let maskIndex = 0; maskIndex < masks.length; maskIndex++) {
      const mask = masks[maskIndex];
      let isSetupCursor = false;

      for (let maskElementIndex = 0; maskElementIndex < mask.length; maskElementIndex++) {
        const maskElement = mask[maskElementIndex];
        const matchResult = valueCurrent.match(maskElement.match);

        if (matchResult) {
          const valueMask = matchResult[0].replace(
            maskElement.match,
            maskElement.replace,
          );

          valueResult = `${valueResult}${valueMask}`;
          valueCurrent = valueCurrent.replace(maskElement.match, '');

          if (maskElement.cursor && !isSetupCursor) {
            const isCursor = maskElement.cursor.position
              && maskElement.cursor.position[0] <= maskCursor
              && maskCursor <= maskElement.cursor.position[1];
            const isFunction = maskElement.cursor.value instanceof Function;

            if (isCursor || isFunction) {
              if (typeof maskElement.cursor.value === 'number') {
                maskCursor = maskElement.cursor.value;
                isSetupCursor = true;
              } else if (isFunction) {
                const cursorValueResult = maskElement.cursor.value(
                  valueMask,
                  maskCursor,
                  matchResult,
                );

                if (typeof cursorValueResult === 'number') {
                  maskCursor = cursorValueResult;
                  isSetupCursor = true;
                }
              }
            }
          }
        } else {
          break;
        }
      }

      if (valueResult) {
        break;
      }
    }

    valueResult = post && post(valueResult);

    if (value === valueResult) {
      maskApplied = true;
    }

    return {
      valuePre,
      value,
      valueResult,
      maskApplied,
      maskCursor,
    };
  };
};

module.exports.masks = require('./masks');
module.exports.masksArr = masks => Object.keys(masks).map(key => masks[key]);
