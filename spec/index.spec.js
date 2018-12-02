const createMask = require('../src');
const masks = require('../src/masks');

test('default', () => {
  const masksArr = Object.keys(masks.phones).map(key => masks.phones[key]);
  const mask = createMask(masksArr, {
    pre: value => ({
      value: value
        .replace(/[+ ()-\D]/g, '')
        .replace(/(\d{18})(.*)/g, '$1'),
    }),
    post: (value, cursor) => ({
      value: `+${value}`,
      cursor: cursor + 1,
    }),
  });

  console.log(mask('78zzz12312312312312', 2));
  console.log(mask('375asdasd312312312312', 2));
  console.log(mask('3703', 4));
  console.log(mask('+370 312311231237778', 4));
});
