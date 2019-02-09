const { createConfigMask } = require('../src');
const runTests = require('./run-tests');
const phoneRuTests = require('./phone/ru.tests');
const phoneCodeTests = require('./phone/code.tests');

const configMaksPhoneRu = createConfigMask('7 (ddd) ddd-dd-dd', {
  space: ' ',
  translation: {
    '7': { match: '^7|^\\+7', replace: '+7', space: '' },
  },
});

const configMasksPhoneCode = createConfigMask('+d ddd ddddddd');

runTests([configMaksPhoneRu], phoneRuTests);
runTests([configMasksPhoneCode, {
  before: ({ value, cursor }) => ({
    value: value.replace(/\D/g, ''),
    cursor,
  }),
}], phoneCodeTests);