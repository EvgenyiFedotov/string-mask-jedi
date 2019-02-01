exports.default = [
  [
    () => ({ match: /([012])/, replace: '$1', space: '_' }),
    maskMap => ({
      match: maskMap && maskMap[0].value.match(/([01])/)
        ? /(\d)/
        : /([0123])/,
      replace: '$1',
      space: '_'
    }),
    () => ({ match: /([012345])/, replace: ':$1', space: ':_' }),
    () => ({ match: /(\d)/, replace: '$1', space: '_' }),
  ],
];