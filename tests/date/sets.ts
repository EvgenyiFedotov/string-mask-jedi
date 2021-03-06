import { Mask } from "../../src";

export const withoutCursor = (mask: Mask) => [
  [mask.run("01012020"), "01/01/2020"],
  [mask.run("31/03/2020"), "31/03/2020"],
  [mask.run("31ssda///03/2020"), "31/03/2020"],
  [mask.run("31/02/2020"), "02/03/2020"],
  [mask.run("9"), ""],
  [mask.run("32"), "3"],
  [mask.run("31/13"), "31/1"],
  [mask.run("00/00"), "0"],
  [mask.run("01/00"), "01/0"],
  [mask.run("21121889"), "21/12/1889"],
];

export const withCursor = {
  stepByStep: (mask: Mask) => [
    [mask.run("3", 1), "3", 1],
    [mask.run("31", 2), "31", 2],
    [mask.run("310", 3), "31/0", 4],
    [mask.run("31/03", 5), "31/03", 5],
    [mask.run("31/032", 6), "31/03/2", 7],
    [mask.run("31/03/20", 8), "31/03/20", 8],
    [mask.run("31/03/202", 9), "31/03/202", 9],
    [mask.run("31/03/2020", 10), "31/03/2020", 10],
    [mask.run("31/03/202", 9), "31/03/202", 9],
    [mask.run("31/03/20", 8), "31/03/20", 8],
    [mask.run("31/03/2", 7), "31/03/2", 7],
    [mask.run("31/03/", 6), "31/03", 5],
    [mask.run("31/0", 4), "31/0", 4],
    [mask.run("31/", 3), "31", 2],
    [mask.run("3", 1), "3", 1],
    [mask.run("", 0), "", 0],
  ],

  insertIntoBetween: (mask: Mask) => [
    [mask.run("31/03/2020", 10), "31/03/2020", 10],
    [mask.run("31/103/2020", 4), "31/10/3202", 4],
    [mask.run("31/101999/2020", 9), "31/10/1999", 10],
    [mask.run("31/2210/2020", 5), "31/12/2020", 7],
    [mask.run("3441/2210/2020", 3), "31/12/4420", 8],
  ],
};
