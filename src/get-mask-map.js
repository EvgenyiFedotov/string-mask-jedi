function getMaskMap(mask, params) {
  let { value = '' } = params;

  return mask.reduce((result, getMaskElement, index) => {
    const maskElement = getMaskElement(result, value, index);
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
}

exports.default = getMaskMap;
