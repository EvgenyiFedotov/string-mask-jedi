import { Mask } from "../../src";

export const withoutCursor = (mask: Mask) => [
  [mask("1237"), "12:37"],
  [mask("2132"), "21:32"],
  [mask("2400"), "20:40"],
  [mask("2900"), "20:09"],
  [mask("5555"), ""],
  [mask("0555"), "05:55"],
  [mask("555"), ""],
  [mask("12:37"), "12:37"],
];

export const withCursor = {
  stepByStep: (mask: Mask) => [
    [mask("1", 1), "1", 1],
    [mask("12", 2), "12", 2],
    [mask("123", 3), "12:3", 4],
    [mask("12:34", 5), "12:34", 5],
    [mask("12:3", 4), "12:3", 4],
    [mask("12:", 3), "12", 2],
    [mask("1", 1), "1", 1],
    [mask("", 0), "", 0],
  ],

  setInBetween: {
    bySingleNumber: (mask: Mask) => [
      [mask("1", 1), "1", 1],
      [mask("12", 2), "12", 2],
      [mask("132", 2), "13:2", 2],
      [mask("135:2", 3), "13:52", 4],
      [mask("1:52", 1), "15:2", 1],
      [mask("152", 2), "15:2", 2],
    ],

    byManyNumber: (mask: Mask) => [
      [mask("1234", 4), "12:34", 5],
      [mask("12:34", 5), "12:34", 5],
      [mask("1256:34", 4), "12:56", 5],
      [mask("12:34:56", 5), "12:34", 5],
      [mask("55:55", 5), "", 0],
      [mask("12:5534", 5), "12:55", 5],
      [mask("1332:34", 3), "13:32", 4],
      [mask("2113:32", 2), "21:13", 2],
    ],
  },
};
