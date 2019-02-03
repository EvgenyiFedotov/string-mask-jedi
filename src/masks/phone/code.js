module.exports = [
  [
    () => ({ match: /(\d)/, replace: '+$1' }),
    () => ({ match: /(\d)/, replace: ' $1' }),
    () => ({ match: /(\d)/, replace: '$1' }),
    () => ({ match: /(\d)/, replace: '$1' }),
    () => ({ match: /(\d)/, replace: ' $1' }),
    () => ({ match: /(\d{0,6})/, replace: '$1' }),
  ],
  {
    before: ({ value, cursor }) => ({
      value: value.replace(/\D/g, ''),
      cursor,
    }),
  },
];
