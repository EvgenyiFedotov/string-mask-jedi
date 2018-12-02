module.exports = (masks = [], params = {}) => {
  const { pre, post, full } = params;

  return (value, cursor) => {
    let maskCursor = cursor || value.length;
    const preResult = pre && pre(value, maskCursor);
    let valueCurrent = preResult ? (preResult.value || value) : value;
    let valueResult = '';
    let maskApplied = false;

    maskCursor = preResult ? (preResult.cursor || maskCursor) : maskCursor;

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

    const postResult = post && post(valueResult, maskCursor, {
      value,
      cursor,
    });

    if (postResult) {
      valueResult = postResult.value || valueResult;
      maskCursor = postResult.cursor || maskCursor;
    }

    if (valueResult && valueResult !== value) {
      maskApplied = true;
    } else {
      valueResult = value,
      maskCursor = cursor;
    }

    return full === true
      ? {
        preResult,
        value,
        postResult,
        valueResult,
        maskApplied,
        maskCursor,
      }
      : {
        value: valueResult,
        cursor: maskCursor,
        maskApplied,
      };
  };
};

module.exports.masks = require('./masks');
module.exports.masksArr = masks => Object.keys(masks).map(key => masks[key]);
