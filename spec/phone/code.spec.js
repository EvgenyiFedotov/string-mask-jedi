const runTests = require('../run-tests');
const maskConfig = require('../../src/masks/phone/code');
const tests = require('./code.tests');

runTests(maskConfig, tests);
