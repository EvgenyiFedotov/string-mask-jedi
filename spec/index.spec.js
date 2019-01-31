const createMask = require('../src').default;

const maskConfig = [
  () => ({ match: /(^7|\+7)/, replace: '+7' }),
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

const tests = {
  add: [
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
  ],

  remove: [
    [
      { value: '79998887766', cursor: 11 },
      { value: '+7 (999) 888-77-66', cursor: 18, space: '', isMatched: true },
    ],
    [
      { value: '+7 (999) 888-77-6', cursor: 17 },
      { value: '+7 (999) 888-77-6', cursor: 17, space: ' ', isMatched: true },
    ],
    [
      { value: '+7 (999) 88-77-6', cursor: 11 },
      { value: '+7 (999) 887-76', cursor: 11, space: '-  ', isMatched: true },
    ],
    [
      { value: '+7 (98-77-6', cursor: 5 },
      { value: '+7 (987) 76', cursor: 5, space: ' -  -  ', isMatched: true },
    ],
    [
      { value: '+787) 76', cursor: 2 },
      { value: '+7 (877) 6', cursor: 2, space: '  -  -  ', isMatched: true },
    ],
    [
      { value: '+ (877) 6', cursor: 1 },
      { value: '', cursor: 0, space: ' (   )    -  -  ', isMatched: false },
    ],
    [
      { value: '799988877', cursor: 9 },
      { value: '+7 (999) 888-77', cursor: 15, space: '-  ', isMatched: true },
    ],
    [
      { value: '+7 (997', cursor: 6 },
      { value: '+7 (997', cursor: 6, space: ')    -  -  ', isMatched: true },
    ],
    [
      { value: '+7 (9998887766', cursor: 14 },
      { value: '+7 (999) 888-77-66', cursor: 18, space: '', isMatched: true },
    ],
    [
      { value: '+7 (999) 888-77-6', cursor: 17 },
      { value: '+7 (999) 888-77-6', cursor: 17, space: ' ', isMatched: true },
    ],
    [
      { value: '+7 (999) 888-77-', cursor: 16 },
      { value: '+7 (999) 888-77', cursor: 15, space: '-  ', isMatched: true },
    ],
    [
      { value: '+7 (999) 888-', cursor: 13 },
      { value: '+7 (999) 888', cursor: 12, space: '-  -  ', isMatched: true },
    ],
    [
      { value: '+7 (999)', cursor: 8 },
      { value: '+7 (999', cursor: 7, space: ')    -  -  ', isMatched: true },
    ],
  ],
};

Object.keys(tests).forEach((key) => {
  const maskPhoneRu = createMask(maskConfig);

  tests[key].forEach((config, index) => {
    test(`phone [ru] \`${key}\` #${config[2] || index}`, () => {
      expect(maskPhoneRu(config[0]))
      .toEqual(config[1]);
    });
  });
});
