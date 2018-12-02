module.exports = (mask) => {
  let index = 0;
  return mask.map((value) => {
    const valueMatch = value.replace.replace(/\$(\d*)/g, '$');
    const result = ({
      ...value,
      cursor: {
        position: [index + 1, index + valueMatch.length],
        value: index + valueMatch.length,
      },
    });

    index += valueMatch.length;

    return result;
  });
};
