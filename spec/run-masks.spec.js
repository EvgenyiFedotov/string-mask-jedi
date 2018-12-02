const runMasks = require('../src/run-masks');
const masks = require('../src/masks');

const masksPhones = Object.keys(masks.phones).map(value => masks.phones[value]);

test('phones `ru`', () => {
  const result = runMasks({
    masks: masksPhones,
    value: '78zzz12312312312312',
    cursor: 2,
  });

  expect(typeof result).toBe('object');
  expect(result).toEqual({ value: '7 (812) 312-31-23', cursor: 4, maskApplied: true });
});

test('phones `kz`', () => {
  const result = runMasks({
    masks: masksPhones,
    value: '375asdasd312312312312',
    cursor: 2,
  });

  expect(typeof result).toBe('object');
  expect(result).toEqual({ value: '375 (31) 231-23-12', cursor: 2, maskApplied: true });
});

test('phones `others`', () => {
  const result = runMasks({
    masks: masksPhones,
    value: '3703',
    cursor: 4,
  });

  expect(typeof result).toBe('object');
  expect(result).toEqual({ value: '370 3', cursor: 5, maskApplied: true });
});