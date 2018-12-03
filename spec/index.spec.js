const createMask = require('../src');
const masks = require('../src/submasks-phones');

test('default', () => {
  const mask = createMask(createMask.submasksArr(masks));

  expect(mask('78zzz12312312312312', 2))
    .toEqual({ value: '+7 (812) 312-31-23', cursor: 2, applied: true });

  expect(mask('375asdasd312312312312', 2))
    .toEqual({ value: '+375 (31) 231-23-12', cursor: 4, applied: true });

  expect(mask('3703', 4))
    .toEqual({ value: '+370 3', cursor: 4, applied: true });

  expect(mask('+370 312311231237778', 4))
    .toEqual({ value: '+370 312311231237778', cursor: 4, applied: false });

  expect(mask('12asd12123sasd', 4))
    .toEqual({ value: '+12', cursor: 4, applied: true });
});

test('params `full` = true', () => {
  const mask = createMask(
    createMask.submasksArr(masks),
    {
      full: true
    }
  );

  expect(mask('78zzz12312312312312', 2))
    .toEqual({"applied": true,
      "cursor": 2,
      "cursorResult": 2,
      "value": "78zzz12312312312312",
      "valuePreproc": undefined,
      "valueResult": "+7 (812) 312-31-23"
    });

  expect(mask('375asdasd312312312312', 2))
    .toEqual({"applied": true,
      "cursor": 2,
      "cursorResult": 4,
      "value": "375asdasd312312312312",
      "valuePreproc": undefined,
      "valueResult": "+375 (31) 231-23-12"
    });

  expect(mask('3703', 4))
    .toEqual({
      "applied": true,
      "cursor": 4,
      "cursorResult": 4,
      "value": "3703",
      "valuePreproc": undefined,
      "valueResult": "+370 3"
    });

  expect(mask('+370 312311231237778', 4))
    .toEqual({
      "applied": false,
      "cursor": 4,
      "cursorResult": 4,
      "value": "+370 312311231237778",
      "valuePreproc": undefined,
      "valueResult": "+370 312311231237778"
  });

  expect(mask('12asd12123sasd', 4))
    .toEqual({
      "applied": true,
      "cursor": 4,
      "cursorResult": 4,
      "value": "12asd12123sasd",
      "valuePreproc": undefined,
      "valueResult": "+12"
    });
});

test('params `preproc`', () => {
  const mask = createMask(
    createMask.submasksArr(masks),
    {
      preproc: function (value) {
        return {
          value: value
            .replace(/[+ ()-\D]/g, '')
            .replace(/(\d{18})(.*)/g, '$1')
        };
      }
    }
  );

  expect(mask('12asd12123sasd', 4))
    .toEqual({"applied": true, "cursor": 4, "value": "+1212123"});
});
