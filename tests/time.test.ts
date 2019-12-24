import { useMatch, createMask, Mask } from "../src";

const d = useMatch(() => /\d/);
const s = useMatch(() => /:/, { defaultValue: ":", additional: true });
const h1 = useMatch(() => /[012]/);
const h2 = useMatch(({ nextValue: [h1Value] }) => {
  return h1Value.value.match(/([01])/) ? /(\d)/ : /([0123])/;
});
const m1 = useMatch(() => /([012345])/);

const time = createMask([h1, h2, s, m1, d]);

export const tests = (mask: Mask) => {
  test.each([
    [mask("1237"), "12:37"],
    [mask("2132"), "21:32"],
    [mask("2400"), "20:40"],
    [mask("2900"), "20:09"],
    [mask("5555"), ""],
    [mask("0555"), "05:55"],
    [mask("555"), ""],
    [mask("12:37"), "12:37"],
  ])("defaults tests", (result, nextValue) => {
    if (result instanceof Object) {
      expect(result.nextValue).toBe(nextValue);
    }
  });

  describe("with cursor", () => {
    test.each([
      [mask("1", 1), "1", 1],
      [mask("12", 2), "12", 2],
      [mask("123", 3), "12:3", 4],
      [mask("12:34", 5), "12:34", 5],
      [mask("12:3", 4), "12:3", 4],
      [mask("12:", 3), "12", 2],
      [mask("1", 1), "1", 1],
      [mask("", 0), "", 0],
    ])("step by step %#", (result, nextValue, nextCursor) => {
      if (result instanceof Object) {
        expect(result.nextValue).toBe(nextValue);
        expect(result.nextCursor).toBe(nextCursor);
      }
    });

    describe("set in between", () => {
      test.each([
        [mask("1", 1), "1", 1],
        [mask("12", 2), "12", 2],
        [mask("132", 2), "13:2", 2],
        [mask("135:2", 3), "13:52", 4],
        [mask("1:52", 1), "15:2", 1],
        [mask("152", 2), "15:2", 2],
      ])("by single number %#", (result, nextValue, nextCursor) => {
        if (result instanceof Object) {
          expect(result.nextValue).toBe(nextValue);
          expect(result.nextCursor).toBe(nextCursor);
        }
      });

      test.each([
        [mask("1234", 4), "12:34", 5],
        [mask("12:34", 5), "12:34", 5],
        [mask("1256:34", 4), "12:56", 5],
        [mask("12:34:56", 5), "12:34", 5],
        [mask("55:55", 5), "", 0],
        [mask("12:5534", 5), "12:55", 5],
        [mask("1332:34", 3), "13:32", 4],
        [mask("2113:32", 2), "21:13", 2],
      ])("by many number %#", (result, nextValue, nextCursor) => {
        if (result instanceof Object) {
          expect(result.nextValue).toBe(nextValue);
          expect(result.nextCursor).toBe(nextCursor);
        }
      });
    });
  });
};

tests(time);
