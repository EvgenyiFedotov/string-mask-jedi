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

test('Mask phone', () => {
  const mask = createMask(maskConfig);
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
  ], [
    { value: '+7 (999) 888-77-665', cursor: 19 },
    { value: '+7 (999) 888-77-66', cursor: 19, space: '' },
  ], [
    { value: '+7 (999) 888-77-566', cursor: 19 },
    { value: '+7 (999) 888-77-56', cursor: 17, space: '' },
  ], [
    { value: '+7 (999) 888-577-56', cursor: 19 },
    { value: '+7 (999) 888-57-75', cursor: 14, space: '' },
  ]];

  subtests.forEach(subtest => expect(mask(subtest[0]).result)
    .toEqual(subtest[1]));
});
