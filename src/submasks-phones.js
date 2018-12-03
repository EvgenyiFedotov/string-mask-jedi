module.exports = {
  ru: [
    { match: /^7/, replace: '+7', cursor: { position: [0, 2], value: 2 } },
    { match: /(\d)/, replace: ' ($1', cursor: { position: [3, 5], value: 5 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [6, 6], value: 6 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [7, 7], value: 7 } },
    { match: /(\d)/, replace: ') $1', cursor: { position: [8, 10], value: 10 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [11, 11], value: 11 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [12, 12], value: 12 } },
    { match: /(\d)/, replace: '-$1', cursor: { position: [13, 14], value: 14 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [15, 15], value: 15 } },
    { match: /(\d)/, replace: '-$1', cursor: { position: [16, 17], value: 17 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [18, 18], value: 18 } },
  ],
  kz: [
    { match: /^375/, replace: '+375', cursor: { position: [0, 4], value: 4 } },
    { match: /(\d)/, replace: ' ($1', cursor: { position: [5, 7], value: 7 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [8, 8], value: 8 } },
    { match: /(\d)/, replace: ') $1', cursor: { position: [9, 11], value: 11 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [12, 12], value: 12 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [13, 13], value: 13 } },
    { match: /(\d)/, replace: '-$1', cursor: { position: [14, 15], value: 15 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [16, 16], value: 16 } },
    { match: /(\d)/, replace: '-$1', cursor: { position: [17, 18], value: 18 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [19, 19], value: 19 } },
  ],
  others: [
    { match: /^(370|371|372|373|374|380|992|993|994|995|996|998)/, replace: '+$1' },
    { match: /(\d*)/, replace: ' $1', cursor: { position: [5, 6], value: 6 } },
    { match: /(\d*)/, replace: '$1' },
  ],
  num: [
    { match: /^(\d)/, replace: '+$1', cursor: { position: [0, 1], value: 1 } },
    { match: /(\d*)/, replace: '$1' },
  ],
  plus: [
    { match: /^$/, replace: '+', cursor: { position: [0, 1], value: 1 } },
  ],
};
