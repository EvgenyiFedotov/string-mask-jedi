const combine = require('../src/combine').default;
const phoneMasks = require('../src/masks/phone').default;
const createMask = require('../src').default;
const runTests = require('./run-tests').default;

const configMask = [
  createMask(...phoneMasks.ru),
  createMask(...phoneMasks.code),
];
const tests = {
  add: [
    [
      { value: '7', cursor: 1 },
      { value: '+7', cursor: 2, space: ' (   )    -  -  ', isMatched: true },
    ],
  ],
};

runTests(configMask, tests, combine);

// test('simple', () => {
//   const combineMask = combine(
    
//   );
//   let res = null;

//   res = combineMask({
//     value: '7',
//     cursor: 1,
//   });

//   console.log('@res', res);

//   res = combineMask({
//     value: '+',
//     cursor: 1,
//   });

//   console.log('@res', res);

//   res = combineMask({
//     value: '9888777',
//     cursor: 7,
//   });

//   console.log('@res', res);


//   res = combineMask({
//     value: '+79 888 777',
//     cursor: 2,
//   });

//   console.log('@res', res);
// });
