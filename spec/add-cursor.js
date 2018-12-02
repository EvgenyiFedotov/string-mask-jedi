const addCursor = require('../src/add-cursor');

const mask = [
  { match: /^7/, replace: '7' },
  { match: /(\d)/, replace: ' ($1' },
  { match: /(\d)/, replace: '$1' },
  { match: /(\d)/, replace: '$1' },
  { match: /(\d)/, replace: ') $1' },
  { match: /(\d)/, replace: '$1' },
  { match: /(\d)/, replace: '$1' },
  { match: /(\d)/, replace: '-$1' },
  { match: /(\d)/, replace: '$1' },
  { match: /(\d)/, replace: '-$1' },
  { match: /(\d)/, replace: '$1' },
];

test('mask ru phone', () => {
  const maskWithCursor = addCursor(mask);

  expect(maskWithCursor[0].cursor).toEqual({ position: [1, 1], value: 1 });
  expect(maskWithCursor[1].cursor).toEqual({ position: [2, 4], value: 4 });
  expect(maskWithCursor[2].cursor).toEqual({ position: [5, 5], value: 5 });
  expect(maskWithCursor[3].cursor).toEqual({ position: [6, 6], value: 6 });
  expect(maskWithCursor[4].cursor).toEqual({ position: [7, 9], value: 9 });
  expect(maskWithCursor[5].cursor).toEqual({ position: [10, 10], value: 10 });
  expect(maskWithCursor[6].cursor).toEqual({ position: [11, 11], value: 11 });
  expect(maskWithCursor[7].cursor).toEqual({ position: [12, 13], value: 13 });
  expect(maskWithCursor[8].cursor).toEqual({ position: [14, 14], value: 14 });
  expect(maskWithCursor[9].cursor).toEqual({ position: [15, 16], value: 16 });
  expect(maskWithCursor[10].cursor).toEqual({ position: [17, 17], value: 17 });
});
