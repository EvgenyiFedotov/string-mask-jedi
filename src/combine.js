function combine(...args) {
  const masks = [...args];

  return (params) => {
    let result = null;

    for (let index = 0; index < masks.length; index++) {
      result = masks[index](params);

      if (result.isMatched) {
        break;
      }
    }

    return result;
  };
}

module.exports = combine;
