const createMask = require('../src');

function runTests(maskConfig, tests, creatorMask = createMask) {
  Object.keys(tests).forEach((key) => {
    const mask = creatorMask(...maskConfig);

    tests[key].forEach((config, index) => {
      test(
        `\`${key}\` #${index} -> ${config[2] || config[0].value}`,
        () => expect(mask(config[0])).toEqual(config[1]),
      );
    });
  });
}

module.exports = runTests;
