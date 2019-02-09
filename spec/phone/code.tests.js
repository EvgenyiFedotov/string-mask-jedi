module.exports = {
  add: [
    [
      { value: '9', cursor: 1 },
      { value: '+9', cursor: 2, space: '', isMatched: true },
    ],
    [
      { value: '+98', cursor: 3 },
      { value: '+9 8', cursor: 4, space: '', isMatched: true },
    ],
    [
      { value: '+9 88', cursor: 5 },
      { value: '+9 88', cursor: 5, space: '', isMatched: true },
    ],
    [
      { value: '+9 888', cursor: 6 },
      { value: '+9 888', cursor: 6, space: '', isMatched: true },
    ],
    [
      { value: '+9 8887', cursor: 7 },
      { value: '+9 888 7', cursor: 8, space: '', isMatched: true },
    ],
    [
      { value: '+9 888 76', cursor: 9 },
      { value: '+9 888 76', cursor: 9, space: '', isMatched: true },
    ],
    [
      { value: '+9 888 766', cursor: 10 },
      { value: '+9 888 766', cursor: 10, space: '', isMatched: true },
    ],
    [
      { value: '+9 888 7666', cursor: 11 },
      { value: '+9 888 7666', cursor: 11, space: '', isMatched: true },
    ],
    [
      { value: '+9 888 76666', cursor: 12 },
      { value: '+9 888 76666', cursor: 12, space: '', isMatched: true },
    ],
    [
      { value: '+9 888 766666', cursor: 13 },
      { value: '+9 888 766666', cursor: 13, space: '', isMatched: true },
    ],
    [
      { value: '+9 888 7666666', cursor: 14 },
      { value: '+9 888 7666666', cursor: 14, space: '', isMatched: true },
    ],
    [
      { value: '+9 888 76666665', cursor: 15 },
      { value: '+9 888 7666666', cursor: 14, space: '', isMatched: true },
    ],
  ],

  change: [
    [
      { value: '+9 888 7666666', cursor: 14 },
      { value: '+9 888 7666666', cursor: 14, space: '', isMatched: true },
    ],
    [
      { value: '+9 555 7666666', cursor: 6 },
      { value: '+9 555 7666666', cursor: 6, space: '', isMatched: true },
    ],
    [
      { value: '+9 555 7866666', cursor: 9 },
      { value: '+9 555 7866666', cursor: 9, space: '', isMatched: true },
    ],
  ],
};
