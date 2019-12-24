import { useMatch, createMask, Mask } from "../src";

const d = useMatch(() => /\d/);
const plus = useMatch(() => /\+/, { defaultValue: "+", additional: true });
const prenumber = useMatch(() => /0/, { defaultValue: "0", additional: true });
const prenumberStrict = useMatch(() => /^0/, {
  defaultValue: "0",
  additional: true,
});
const space = useMatch(() => / /, { defaultValue: " ", additional: true });
const open = useMatch(() => /\(/, { defaultValue: "(", additional: true });
const close = useMatch(() => /\)/, { defaultValue: ")", additional: true });
const tr = useMatch(() => /-/, { defaultValue: "-", additional: true });

const phone = createMask([
  plus,
  prenumber,
  space,
  open,
  d,
  d,
  d,
  close,
  space,
  d,
  d,
  d,
  tr,
  d,
  d,
  tr,
  d,
  d,
]);

const phoneStrict = createMask([
  plus,
  prenumberStrict,
  space,
  open,
  d,
  d,
  d,
  close,
  space,
  d,
  d,
  d,
  tr,
  d,
  d,
  tr,
  d,
  d,
]);

export const tests = (mask: Mask) => {
  test.each([
    [mask("999 888 77 66"), "+0 (999) 888-77-66"],
    [mask("+01112223344"), "+0 (111) 222-33-44"],
    [mask("01112223344"), "+0 (111) 222-33-44"],
    [mask("_01112223344"), "+0 (111) 222-33-44"], // See, it is diff (*1)
    [mask("+0 (999) 888-77-66"), "+0 (999) 888-77-66"],
    [mask("2w2ASD!@@#233q34e455e"), "+0 (222) 333-44-55"],
  ])("without cursor %#", (result, nextValue) => {
    if (result instanceof Object) {
      expect(result.nextValue).toBe(nextValue);
    }
  });
};

export const testsStrict = (mask: Mask) => {
  test.each([
    [mask("999 888 77 66"), "+0 (999) 888-77-66"],
    [mask("+01112223344"), "+0 (111) 222-33-44"],
    [mask("01112223344"), "+0 (111) 222-33-44"],
    [mask("_01112223344"), "+0 (011) 122-23-34"], // See, it is diff (*1)
    [mask("+0 (999) 888-77-66"), "+0 (999) 888-77-66"],
    [mask("2w2ASD!@@#233q34e455e"), "+0 (222) 333-44-55"],
  ])("without cursor %#", (result, nextValue) => {
    if (result instanceof Object) {
      expect(result.nextValue).toBe(nextValue);
    }
  });

  describe("with cursor", () => {
    test.each([
      [mask("9", 1), "+0 (9", 5],
      [mask("+0 (99", 6), "+0 (99", 6],
      [mask("+0 (999", 7), "+0 (999", 7],
      [mask("+0 (9998", 8), "+0 (999) 8", 10],
      [mask("+0 (999) 88", 11), "+0 (999) 88", 11],
      [mask("+0 (999) 888", 12), "+0 (999) 888", 12],
      [mask("+0 (999) 8887", 13), "+0 (999) 888-7", 14],
      [mask("+0 (999) 888-77", 15), "+0 (999) 888-77", 15],
      [mask("+0 (999) 888-776", 16), "+0 (999) 888-77-6", 17],
      [mask("+0 (999) 888-77-66", 18), "+0 (999) 888-77-66", 18],
      [mask("+0 (999) 888-77-66", 18), "+0 (999) 888-77-66", 18],
      [mask("+0 (999) 888-77-6", 17), "+0 (999) 888-77-6", 17],
      [mask("+0 (999) 888-77-", 16), "+0 (999) 888-77", 15],
      [mask("+0 (999) 888-7", 14), "+0 (999) 888-7", 14],
      [mask("+0 (999) 888-", 13), "+0 (999) 888", 12],
      [mask("+0 (999) 88", 11), "+0 (999) 88", 11],
      [mask("+0 (999) 8", 10), "+0 (999) 8", 10],
      [mask("+0 (999) ", 9), "+0 (999", 7],
      [mask("+0 (99", 6), "+0 (99", 6],
      [mask("+0 (9", 5), "+0 (9", 5],
      [mask("+0 (", 4), "", 0],
    ])("step by step %#", (result, nextValue, nextCursor) => {
      if (result instanceof Object) {
        expect(result.nextValue).toBe(nextValue);
        expect(result.nextCursor).toBe(nextCursor);
      }
    });

    test.each([
      [mask("+0 (111) 222-33-44", 18), "+0 (111) 222-33-44", 18],
      [mask("+09998887766 (111) 222-33-44", 12), "+0 (999) 888-77-66", 18],
      [mask("5554443322+0 (999) 888-77-66", 10), "+0 (555) 444-33-22", 18],
      [mask("+0 (555333) 444-33-22", 10), "+0 (555) 333-44-43", 12],
      [mask("+0 (555) 0001122333-44-43", 16), "+0 (555) 000-11-22", 18],
      [mask("1+0 (555) 000-11-22", 1), "+0 (105) 550-00-11", 5],
      [mask("+10 (555) 000-11-22", 2), "+0 (105) 550-00-11", 5],
      [mask("+01 (555) 000-11-22", 3), "+0 (155) 500-01-12", 5],
      [mask("+0 1(555) 000-11-22", 4), "+0 (155) 500-01-12", 5],
      [mask("+0 (1555) 000-11-22", 5), "+0 (155) 500-01-12", 5],
      [mask("+0 (5155) 000-11-22", 6), "+0 (515) 500-01-12", 6],
      [mask("+0 (5515) 000-11-22", 7), "+0 (551) 500-01-12", 7],
      [mask("+0 (5551) 000-11-22", 8), "+0 (555) 100-01-12", 10],
      [mask("+0 (555)1 000-11-22", 9), "+0 (555) 100-01-12", 10],
      [mask("+0 (555) 1000-11-22", 10), "+0 (555) 100-01-12", 10],
      [mask("+0 (555) 0100-11-22", 11), "+0 (555) 010-01-12", 11],
      [mask("+0 (555) 0010-11-22", 12), "+0 (555) 001-01-12", 12],
      [mask("+0 (555) 0001-11-22", 13), "+0 (555) 000-11-12", 14],
      [mask("+0 (555) 000-191-22", 15), "+0 (555) 000-19-12", 15],
      [mask("+0 (555) 000-119-22", 16), "+0 (555) 000-11-92", 17],
      [mask("+0 (555) 000-11-922", 17), "+0 (555) 000-11-92", 17],
      [mask("+0 (555) 000-11-292", 18), "+0 (555) 000-11-29", 18],
      [mask("+0 (555) 000-11-229", 19), "+0 (555) 000-11-22", 18],
    ])("insert into between %#", (result, nextValue, nextCursor) => {
      if (result instanceof Object) {
        expect(result.nextValue).toBe(nextValue);
        expect(result.nextCursor).toBe(nextCursor);
      }
    });
  });
};

tests(phone);
testsStrict(phoneStrict);
