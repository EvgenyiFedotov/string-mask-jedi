const runTests = require('../run-tests');
const maskConfig = require('../../src/masks/phone/ru');
const tests = require('./ru.tests');

runTests(maskConfig, tests);
