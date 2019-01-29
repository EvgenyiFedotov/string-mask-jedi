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

test('Mask phone [ru] `add`', () => {
  const subtests = [[
    { value: '7', cursor: 1 },
    { value: '+7', cursor: 2, space: ' (   )    -  -  ' },
  ], [
    { value: '+79', cursor: 3 },
    { value: '+7 (9', cursor: 5, space: '  )    -  -  ' },
  ], [
    { value: '+7 (99', cursor: 6 },
    { value: '+7 (99', cursor: 6, space: ' )    -  -  ' },
  ], [
    { value: '+7 (999', cursor: 7 },
    { value: '+7 (999', cursor: 7, space: ')    -  -  ' },
  ], [
    { value: '+7 (9998', cursor: 7 },
    { value: '+7 (999) 8', cursor: 10, space: '  -  -  ' },
  ], [
    { value: '+7 (999) 88', cursor: 11 },
    { value: '+7 (999) 88', cursor: 11, space: ' -  -  ' },
  ], [
    { value: '+7 (999) 888', cursor: 12 },
    { value: '+7 (999) 888', cursor: 12, space: '-  -  ' },
  ], [
    { value: '+7 (999) 8887', cursor: 13 },
    { value: '+7 (999) 888-7', cursor: 14, space: ' -  ' },
  ], [
    { value: '+7 (999) 888-77', cursor: 15 },
    { value: '+7 (999) 888-77', cursor: 15, space: '-  ' },
  ], [
    { value: '+7 (999) 888-776', cursor: 16 },
    { value: '+7 (999) 888-77-6', cursor: 17, space: ' ' },
  ], [
    { value: '+7 (999) 888-77-66', cursor: 18 },
    { value: '+7 (999) 888-77-66', cursor: 18, space: '' },
  ]];

  subtests.forEach(subtest => expect(maskPhoneRu(subtest[0]).result)
    .toEqual(subtest[1]));
});

test('Mask phone [ru] `change`', () => {
  const subtests = [[
    { value: '+7 (999) 888-77-665', cursor: 19 },
    { value: '+7 (999) 888-77-66', cursor: 19, space: '' },
  ], [
    { value: '+7 (999) 888-77-566', cursor: 19 },
    { value: '+7 (999) 888-77-56', cursor: 17, space: '' },
  ], [
    { value: '+7 (999) 888-577-56', cursor: 19 },
    { value: '+7 (999) 888-57-75', cursor: 14, space: '' },
  ]];

  subtests.forEach(subtest => expect(maskPhoneRu(subtest[0]).result)
    .toEqual(subtest[1]));
});

test('Mask phone [ru] `remove`', () => {
  const subtests = [[
    { value: '+7 (999) 888-57-7', cursor: 17 },
    { value: '+7 (999) 888-57-7', cursor: 17, space: ' ' },
  ], [
    { value: '+7 (999) 888-57-', cursor: 16 },
    { value: '+7 (999) 888-57', cursor: 15, space: '-  ' },
  ], [
    { value: '+7 (999) 888-5', cursor: 14 },
    { value: '+7 (999) 888-5', cursor: 14, space: ' -  ' },
  ], [
    { value: '+7 (999) 888-', cursor: 13 },
    { value: '+7 (999) 888', cursor: 12, space: '-  -  ' },
  ], [
    { value: '+7 (999) 88', cursor: 11 },
    { value: '+7 (999) 88', cursor: 11, space: ' -  -  ' },
  ], [
    { value: '+7 (999) 8', cursor: 10 },
    { value: '+7 (999) 8', cursor: 10, space: '  -  -  ' },
  ], [
    { value: '+7 (999) ', cursor: 9 },
    { value: '+7 (999', cursor: 7, space: ')    -  -  ' },
  ], [
    { value: '+7 (99', cursor: 6 },
    { value: '+7 (99', cursor: 6, space: ' )    -  -  ' },
  ], [
    { value: '+7 (9', cursor: 5 },
    { value: '+7 (9', cursor: 5, space: '  )    -  -  ' },
  ], [
    { value: '+7 (', cursor: 4 },
    { value: '+7', cursor: 2, space: ' (   )    -  -  ' },
  ], [
    { value: '+', cursor: 1 },
    { value: '', cursor: 0, space: ' (   )    -  -  ' },
  ]];

  subtests.forEach(subtest => expect(maskPhoneRu(subtest[0]).result)
    .toEqual(subtest[1]));
});

test('Mask phone [ru] `ctrl+V`', () => {
  const subtests = [[
    { value: '+7 (999) 888-57-7', cursor: 0 },
    { value: '+7 (999) 888-57-7', cursor: 17, space: ' ' },
  ]];

  subtests.forEach(subtest =>
    expect(maskPhoneRu(subtest[0]).result)
      .toEqual(subtest[1])
  );
});

test('Mask phone [ru] `remove selected text`', () => {});
