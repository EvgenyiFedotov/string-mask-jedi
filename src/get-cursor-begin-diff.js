function getCursorBeginDiff(value1, value2) {
  let result = 0;

  if (value1.length >= value2.length) {
    result = value1.length;

    for (let index = 0; index < value1.length; index++) {
      if (value1[index] !== value2[index]) {
        result = index;
        break;
      }
    }
  } else {
    for (let index = 0; index < value2.length; index++) {
      if (value2[index] !== value1[index]) {
        result = index;
        break;
      }
    }
  }

  return result;
}

exports.default = getCursorBeginDiff;
