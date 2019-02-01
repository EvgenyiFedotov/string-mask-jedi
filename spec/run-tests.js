const createMask = require('../src').default;

function runTests(maskConfig, tests) {
  Object.keys(tests).forEach((key) => {
    const mask = createMask(...maskConfig);

    tests[key].forEach((config, index) => {
      test(
        `\`${key}\` #${index} -> ${config[2] || config[0].value}`,
        () => expect(mask(config[0])).toEqual(config[1]),
      );
    });
  });
}

exports.default = runTests;