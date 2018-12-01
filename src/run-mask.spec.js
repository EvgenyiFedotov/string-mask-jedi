const runMask = require('./run-mask');
const masks = require('./masks');

test('phone `ru` mask', () => {
  const result = runMask({
    mask: masks.phones.ru,
    value: '78zzz12312312312312',
    cursor: 2,
  });

  expect(typeof result).toBe('object');
  expect(result).toEqual({ value: '7 (812) 312-31-23', cursor: 4, maskApplied: true });
});

test('phone `kz` mask', () => {
  const result = runMask({
    mask: masks.phones.kz,
    value: '375asdasd312312312312',
    cursor: 2,
  });

  expect(typeof result).toBe('object');
  expect(result).toEqual({ value: '375 (31) 231-23-12', cursor: 2, maskApplied: true });
});

test('phone `others` mask and cursor value is Function', () => {
  const result = runMask({
    mask: masks.phones.others,
    value: '3703',
    cursor: 4,
  });

  expect(typeof result).toBe('object');
  expect(result).toEqual({ value: '370 3', cursor: 5, maskApplied: true });
});

test('`preprocess` and `postprocess`', () => {
  const result = runMask({
    mask: masks.phones.others,
    value: '+370 312311231237777',
    cursor: 2,
    preprocess: value => value.replace(/[+ ()-\D]/g, '').replace(/(\d{18})(.*)/g, '$1'),
    postprocess: value => `+${value}`,
  });

  expect(typeof result).toBe('object');
  expect(result).toEqual({ value: '+370 312311231237777', cursor: 2, maskApplied: false });
});
