const runTests = require('./run-tests').default;
const maskConfig = require('../src/masks/time').default;

const tests = {
  'add default': [
    [
      { value: '1', cursor: 1 },
      { value: '1', cursor: 1, space: '_:__', isMatched: true },
    ],
    [
      { value: '12', cursor: 2 },
      { value: '12', cursor: 2, space: ':__', isMatched: true },
    ],
    [
      { value: '123', cursor: 3 },
      { value: '12:3', cursor: 4, space: '_', isMatched: true },
    ],
    [
      { value: '12:34', cursor: 5 },
      { value: '12:34', cursor: 5, space: '', isMatched: true },
    ],
  ],

  'add with errors': [
    [
      { value: '3', cursor: 1 },
      { value: '', cursor: 0, space: '__:__', isMatched: false },
    ],
    [
      { value: '2', cursor: 1 },
      { value: '2', cursor: 1, space: '_:__', isMatched: true },
    ],
    [
      { value: '29', cursor: 2 },
      { value: '2', cursor: 1, space: '_:__', isMatched: true },
    ],
    [
      { value: '2', cursor: 2 },
      { value: '2', cursor: 1, space: '_:__', isMatched: true },
    ],
    [
      { value: '23', cursor: 2 },
      { value: '23', cursor: 2, space: ':__', isMatched: true },
    ],
    [
      { value: '237', cursor: 3 },
      { value: '23', cursor: 2, space: ':__', isMatched: true },
    ],
    [
      { value: '235', cursor: 3 },
      { value: '23:5', cursor: 4, space: '_', isMatched: true },
    ],
    [
      { value: '23:59', cursor: 5 },
      { value: '23:59', cursor: 5, space: '', isMatched: true },
    ],
  ],

  'add ctrlV': [
    [
      { value: '6575', cursor: 4 },
      { value: '', cursor: 0, space: '__:__', isMatched: false },
    ],
    [
      { value: '2475', cursor: 4 },
      { value: '2', cursor: 1, space: '_:__', isMatched: true },
    ],[
      { value: '2346', cursor: 4 },
      { value: '23:46', cursor: 5, space: '', isMatched: true },
    ],
  ],

  'remove': [
    [
      { value: '2359', cursor: 4 },
      { value: '23:59', cursor: 5, space: '', isMatched: true },
    ],
    [
      { value: '23:5', cursor: 4 },
      { value: '23:5', cursor: 4, space: '_', isMatched: true },
    ],
    [
      { value: '3:5', cursor: 0 },
      { value: '', cursor: 0, space: '__:__', isMatched: false },
    ],
    [
      { value: '23:59', cursor: 5 },
      { value: '23:59', cursor: 5, space: '', isMatched: true },
    ],
    [
      { value: '2:59', cursor: 1 },
      { value: '2', cursor: 1, space: '_:__', isMatched: true },
    ],
  ],

  'change': [
    [
      { value: '2359', cursor: 4 },
      { value: '23:59', cursor: 5, space: '', isMatched: true },
    ],
    [
      { value: '23:589', cursor: 5 },
      { value: '23:58', cursor: 5, space: '', isMatched: true },
    ],
    [
      { value: '21:58', cursor: 2 },
      { value: '21:58', cursor: 2, space: '', isMatched: true },
    ],
    [
      { value: '1221:58', cursor: 2 },
      { value: '12:21', cursor: 2, space: '', isMatched: true },
    ],
    [
      { value: '13333332:21', cursor: 7 },
      { value: '13:33', cursor: 5, space: '', isMatched: true },
    ],
    [
      // !
      { value: '1366:33', cursor: 4 },
      { value: '13:36', cursor: 4, space: '', isMatched: true },
    ],
    [
      // !
      { value: '17773:36', cursor: 4 },
      { value: '17:37', cursor: 5, space: '', isMatched: true },
    ],
    [
      { value: '9999', cursor: 4 },
      { value: '', cursor: 0, space: '__:__', isMatched: false },
    ],
  ],
};

runTests(maskConfig, tests);
