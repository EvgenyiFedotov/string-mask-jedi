module.exports = {
  phones: {
    ru: [
      { match: /^7/, replace: '7', cursor: { position: [1, 1], value: 1 } },
      { match: /(\d)/, replace: ' ($1', cursor: { position: [2, 4], value: 4 } },
      { match: /(\d)/, replace: '$1', cursor: { position: [5, 5], value: 5 } },
      { match: /(\d)/, replace: '$1', cursor: { position: [6, 6], value: 6 } },
      { match: /(\d)/, replace: ') $1', cursor: { position: [7, 9], value: 9 } },
      { match: /(\d)/, replace: '$1', cursor: { position: [10, 10], value: 10 } },
      { match: /(\d)/, replace: '$1', cursor: { position: [11, 11], value: 11 } },
      { match: /(\d)/, replace: '-$1', cursor: { position: [12, 13], value: 13 } },
      { match: /(\d)/, replace: '$1', cursor: { position: [14, 14], value: 14 } },
      { match: /(\d)/, replace: '-$1', cursor: { position: [15, 16], value: 16 } },
      { match: /(\d)/, replace: '$1', cursor: { position: [17, 17], value: 17 } },
    ],
    kz: [
      { match: /^375/, replace: '375', cursor: { position: [1, 3], value: 3 } },
      { match: /(\d)/, replace: ' ($1', cursor: { position: [4, 6], value: 6 } },
      { match: /(\d)/, replace: '$1', cursor: { position: [7, 7], value: 7 } },
      { match: /(\d)/, replace: ') $1', cursor: { position: [8, 10], value: 10 } },
      { match: /(\d)/, replace: '$1', cursor: { position: [11, 11], value: 11 } },
      { match: /(\d)/, replace: '$1', cursor: { position: [12, 12], value: 12 } },
      { match: /(\d)/, replace: '-$1', cursor: { position: [13, 14], value: 14 } },
      { match: /(\d)/, replace: '$1', cursor: { position: [15, 15], value: 15 } },
      { match: /(\d)/, replace: '-$1', cursor: { position: [16, 19], value: 19 } },
      { match: /(\d)/, replace: '$1', cursor: { position: [18, 18], value: 18 } },
    ],
    others: [
      { match: /^(370|371|372|373|374|380|992|993|994|995|996|998)/, replace: '$1' },
      {
        match: /(\d*)/,
        replace: ' $1',
        cursor: {
          value: (value, cursor) => {
            if (!!value.match(/^ \d$/)) {
              return cursor + 1;
            }
          },
        },
      },
    ],
  },
};
