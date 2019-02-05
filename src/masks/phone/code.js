const repeat = require('../../repeat-mask-element');

module.exports = [
  [
    () => ({ match: /(\d)/, replace: '+$1' }),
    () => ({ match: /(\d)/, replace: ' $1' }),
    () => ({ match: /(\d)/, replace: '$1' }),
    () => ({ match: /(\d)/, replace: '$1' }),
    () => ({ match: /(\d)/, replace: ' $1' }),
    ...repeat(
      () => ({ match: /(\d)/, replace: '$1' }),
      6,
    ),
  ],
  {
    before: ({ value, cursor }) => ({
      value: value.replace(/\D/g, ''),
      cursor,
    }),
  },
];
