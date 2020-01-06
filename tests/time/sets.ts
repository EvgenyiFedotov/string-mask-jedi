import { Mask } from "../../src";

export const withoutCursor = (mask: Mask) => [
  [mask.run("1237"), "12:37"],
  [mask.run("2132"), "21:32"],
  [mask.run("2400"), "20:40"],
  [mask.run("2900"), "20:09"],
  [mask.run("5555"), ""],
  [mask.run("0555"), "05:55"],
  [mask.run("555"), ""],
  [mask.run("12:37"), "12:37"],
];

export const withCursor = {
  stepByStep: (mask: Mask) => [
    [mask.run("1", 1), "1", 1],
    [mask.run("12", 2), "12", 2],
    [mask.run("123", 3), "12:3", 4],
    [mask.run("12:34", 5), "12:34", 5],
    [mask.run("12:3", 4), "12:3", 4],
    [mask.run("12:", 3), "12", 2],
    [mask.run("1", 1), "1", 1],
    [mask.run("", 0), "", 0],
  ],

  setInBetween: {
    bySingleNumber: (mask: Mask) => [
      [mask.run("1", 1), "1", 1],
      [mask.run("12", 2), "12", 2],
      [mask.run("132", 2), "13:2", 2],
      [mask.run("135:2", 3), "13:52", 4],
      [mask.run("1:52", 1), "15:2", 1],
      [mask.run("152", 2), "15:2", 2],
    ],

    byManyNumber: (mask: Mask) => [
      [mask.run("1234", 4), "12:34", 5],
      [mask.run("12:34", 5), "12:34", 5],
      [mask.run("1256:34", 4), "12:56", 5],
      [mask.run("12:34:56", 5), "12:34", 5],
      [mask.run("55:55", 5), "", 0],
      [mask.run("12:5534", 5), "12:55", 5],
      [mask.run("1332:34", 3), "13:32", 4],
      [mask.run("2113:32", 2), "21:13", 2],
    ],
  },
};
