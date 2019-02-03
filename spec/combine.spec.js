const createMask = require('../src');
const { combine, masks } = require('../src');
const runTests = require('./run-tests');

const configMask = [
  createMask(...masks.phone.ru),
  createMask(...masks.phone.code),
];
const tests = {
  add: [
    [
      { value: '7', cursor: 1 },
      { value: '+7', cursor: 2, space: ' (   )    -  -  ', isMatched: true },
    ],
    [
      { value: '+', cursor: 1 },
      { value: '', cursor: 0, space: '', isMatched: true },
    ],
    [
      { value: '9888777', cursor: 7 },
      { value: '+9 888 777', cursor: 10, space: '', isMatched: true },
    ],
    [
      // ? Может быть баг с курсором, пока оставим так (редкий кейс)
      { value: '+79 888 777', cursor: 2 },
      { value: '+7 (988) 877-7', cursor: 5, space: ' -  ', isMatched: true },
    ],
  ],

  remove: [
    [
      { value: '+7 (988) 877-7', cursor: 14 },
      { value: '+7 (988) 877-7', cursor: 14, space: ' -  ', isMatched: true },
    ],
    [
      { value: '+ (988) 877-7', cursor: 1 },
      { value: '+9 888 777', cursor: 2, space: '', isMatched: true },
    ],
    [
      { value: '+9 8 777', cursor: 4 },
      { value: '+9 877 7', cursor: 4, space: '', isMatched: true },
    ],
    [
      { value: '+', cursor: 1 },
      { value: '', cursor: 0, space: '', isMatched: true },
    ],
  ],
};

runTests(configMask, tests, combine);
