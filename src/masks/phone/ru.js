exports.default = [
  [
    () => ({ match: /(^7|\+7)/, replace: '+7' }),
    () => ({ match: /(\d)/, replace: ' ($1', space: ' ( ' }),
    () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
    () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
    () => ({ match: /(\d)/, replace: ') $1', space: ')  ' }),
    () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
    () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
    () => ({ match: /(\d)/, replace: '-$1', space: '- ' }),
    () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
    () => ({ match: /(\d)/, replace: '-$1', space: '- ' }),
    () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  ],
];