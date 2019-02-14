const common = require('./common');

const defaultConfig = {
  space: null,
  translation: {
    'd': { match: '\\d' },
  },
};

function createConfigMask(mask = '', addConfig = {}) {
  const config = common.mergeObjects(
    defaultConfig,
    addConfig,
    {
      translation: common.mergeObjects(
        defaultConfig.translation,
        addConfig.translation,
      ),
    },
  );
  const result = [];
  const maskSplit = mask.split('');
  const maskLength = maskSplit.length - 1;
  const cfgSpcIsStr = typeof config.space === 'string';

  maskSplit.forEach((char, index) => {
    if (result[result.length - 1] === undefined) {
      result.push(createMaskEl(cfgSpcIsStr));
    }

    const resEl = result[result.length - 1];

    if (!!config.translation[char]) {
      const transChar = config.translation[char];
      const { match = '', replace = '$1', space = '' } = transChar;
      const addSpace = ('space' in transChar) ? space : config.space;

      resEl.match = new RegExp(`(${match})`);
      resEl.replace = `${resEl.replace}${replace}`;

      if (addSpace && cfgSpcIsStr) {
        resEl.space = `${resEl.space}${addSpace}`;
      }

      if (index !== maskLength) {
        result.push(createMaskEl(cfgSpcIsStr));
      }
    } else {
      resEl.replace = `${resEl.replace}${char}`;

      if (cfgSpcIsStr) {
        resEl.space = `${resEl.space}${char}`;
      }
    }
  });

  return result.map(resEl => () => resEl);
}

module.exports = createConfigMask;

function createMaskEl(cfgSpcIsStr) {
  return {
    match: null,
    replace: '',
    space: cfgSpcIsStr ? '' : null,
  };
}
