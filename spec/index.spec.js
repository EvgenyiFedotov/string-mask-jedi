const createMask = require('../src').default;

const maskConfig = [
  () => ({ match: /(7)/, replace: '+7' }),
  () => ({ match: /(\d)/, replace: ' ($1', space: ' ( ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: ') $1', space: ')  ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: '-$1', space: '- ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: '-$1', space: '- ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
];

const maskPhoneRu = createMask(maskConfig);

const testsAdd = [
  [
    { value: '7', cursor: 1 },
    { value: '+7', cursor: 2, space: ' (   )    -  -  ', isMatched: true },
  ],
  [
    { value: '+79', cursor: 3 },
    { value: '+7 (9', cursor: 5, space: '  )    -  -  ', isMatched: true },
  ],
  [
    { value: '+7 (9', cursor: 3 },
    { value: '+7 (9', cursor: 5, space: '  )    -  -  ', isMatched: true },
  ],
  [
    { value: '+7 (99', cursor: 6 },
    { value: '+7 (99', cursor: 6, space: ' )    -  -  ', isMatched: true },
  ],
  [
    { value: '+7 (999', cursor: 7 },
    { value: '+7 (999', cursor: 7, space: ')    -  -  ', isMatched: true },
  ],
  [
    { value: '+7 (9998', cursor: 8 },
    { value: '+7 (999) 8', cursor: 10, space: '  -  -  ', isMatched: true },
  ],
  [
    { value: '+7 (97799) 8', cursor: 7 },
    { value: '+7 (977) 998', cursor: 7, space: '-  -  ', isMatched: true },
  ],
  [
    { value: '+7 (955577) 998', cursor: 8 },
    { value: '+7 (955) 577-99-8', cursor: 10, space: ' ', isMatched: true },
  ],
  [
    { value: '+7 (000000955) 577-99-8', cursor: 10 },
    { value: '+7 (000) 000-95-55', cursor: 12, space: '', isMatched: true },
  ],
  [
    { value: '+7 (1111111111000) 000-95-55', cursor: 14 },
    { value: '+7 (111) 111-11-11', cursor: 18, space: '', isMatched: true },
  ],
];

testsAdd.forEach((config, index) => {
  test(`mask phone [ru] \`add\` #${config[2] || index}`, () => {
    expect(maskPhoneRu(config[0]).result).toEqual(config[1]);
  });
});
