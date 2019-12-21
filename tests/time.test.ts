import { useMatch, createMask } from "../src";

const d = useMatch(() => /\d/);
const s = useMatch(() => /:/, { defaultValue: ":", additional: true });
const h1 = useMatch(() => /[012]/);
const h2 = useMatch(({ nextValue: [h1Value] }) => {
  return h1Value.match(/([01])/) ? /(\d)/ : /([0123])/;
});
const m1 = useMatch(() => /([012345])/);

const time = createMask(h1, h2, s, m1, d);

const ENABLED_OLD_TESTS = true;

if (ENABLED_OLD_TESTS) {
  test.each([
    [time("1237"), "12:37"],
    [time("2132"), "21:32"],
    [time("2400"), "20:40"],
    [time("2900"), "20:09"],
    [time("5555"), ""],
    [time("0555"), "05:55"],
    [time("555"), ""],
    [time("12:37"), "12:37"],
  ])("defaults tests", (result, nextValue) => {
    if (result instanceof Object) {
      expect(result.nextValue).toBe(nextValue);
    }
  });
}

describe("with cursor", () => {
  if (ENABLED_OLD_TESTS) {
    test.each([
      [time("1", 1), "1", 1],
      [time("12", 2), "12", 2],
      [time("123", 3), "12:3", 4],
      [time("12:34", 5), "12:34", 5],
      [time("12:3", 4), "12:3", 4],
      [time("12:", 3), "12", 2],
      [time("1", 1), "1", 1],
      [time("", 0), "", 0],
    ])("step by step", (result, nextValue, nextCursor) => {
      if (result instanceof Object) {
        expect(result.nextValue).toBe(nextValue);
        expect(result.nextCursor).toBe(nextCursor);
      }
    });
  }

  describe("set in bettween", () => {
    if (ENABLED_OLD_TESTS) {
      test.each([
        [time("1", 1), "1", 1],
        [time("12", 2), "12", 2],
        [time("132", 2), "13:2", 2],
        [time("135:2", 3), "13:52", 4],
        [time("1:52", 1), "15:2", 1],
        [time("152", 2), "15:2", 2],
      ])("by single number", (result, nextValue, nextCursor) => {
        if (result instanceof Object) {
          expect(result.nextValue).toBe(nextValue);
          expect(result.nextCursor).toBe(nextCursor);
        }
      });
    }

    test.each([
      [time("1234", 4), "12:34", 5],
      [time("12:34", 5), "12:34", 5],
      [time("1256:34", 4), "12:56", 5],
      [time("12:34:56", 5), "12:34", 5],
      [time("55:55", 5), "", 0],
      [time("12:5534", 5), "12:55", 5],
      [time("1332:34", 3), "13:32", 4],
      [time("2113:32", 2), "21:13", 2],
    ])("by many number", (result, nextValue, nextCursor) => {
      if (result instanceof Object) {
        expect(result.nextValue).toBe(nextValue);
        expect(result.nextCursor).toBe(nextCursor);
      }
    });
  });
});
