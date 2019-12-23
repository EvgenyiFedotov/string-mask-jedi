import { useMatch, createMask } from "../src";

const d = useMatch(() => /\d/);
const plus = useMatch(() => /\+/, { defaultValue: "+", additional: true });
const seven = useMatch(() => /^0/, { defaultValue: "0", additional: true });
const space = useMatch(() => / /, { defaultValue: " ", additional: true });
const open = useMatch(() => /\(/, { defaultValue: "(", additional: true });
const close = useMatch(() => /\)/, { defaultValue: ")", additional: true });
const tr = useMatch(() => /-/, { defaultValue: "-", additional: true });

const phone = createMask(
  plus,
  seven,
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
);

test.each([
  [phone("999 888 77 66"), "+0 (999) 888-77-66"],
  [phone("+01112223344"), "+0 (111) 222-33-44"],
  [phone("01112223344"), "+0 (111) 222-33-44"],
  [phone("_01112223344"), "+0 (011) 122-23-34"],
  [phone("+0 (999) 888-77-66"), "+0 (999) 888-77-66"],
  [phone("2w2ASD!@@#233q34e455e"), "+0 (222) 333-44-55"],
])("without cursor %#", (result, nextValue) => {
  if (result instanceof Object) {
    expect(result.nextValue).toBe(nextValue);
  }
});

describe("with cursor", () => {
  test.each([
    [phone("9", 1), "+0 (9", 5],
    [phone("+0 (99", 6), "+0 (99", 6],
    [phone("+0 (999", 7), "+0 (999", 7],
    [phone("+0 (9998", 8), "+0 (999) 8", 10],
    [phone("+0 (999) 88", 11), "+0 (999) 88", 11],
    [phone("+0 (999) 888", 12), "+0 (999) 888", 12],
    [phone("+0 (999) 8887", 13), "+0 (999) 888-7", 14],
    [phone("+0 (999) 888-77", 15), "+0 (999) 888-77", 15],
    [phone("+0 (999) 888-776", 16), "+0 (999) 888-77-6", 17],
    [phone("+0 (999) 888-77-66", 18), "+0 (999) 888-77-66", 18],
    [phone("+0 (999) 888-77-66", 18), "+0 (999) 888-77-66", 18],
    [phone("+0 (999) 888-77-6", 17), "+0 (999) 888-77-6", 17],
    [phone("+0 (999) 888-77-", 16), "+0 (999) 888-77", 15],
    [phone("+0 (999) 888-7", 14), "+0 (999) 888-7", 14],
    [phone("+0 (999) 888-", 13), "+0 (999) 888", 12],
    [phone("+0 (999) 88", 11), "+0 (999) 88", 11],
    [phone("+0 (999) 8", 10), "+0 (999) 8", 10],
    [phone("+0 (999) ", 9), "+0 (999", 7],
    [phone("+0 (99", 6), "+0 (99", 6],
    [phone("+0 (9", 5), "+0 (9", 5],
    [phone("+0 (", 4), "", 0],
  ])("step by step %#", (result, nextValue, nextCursor) => {
    if (result instanceof Object) {
      expect(result.nextValue).toBe(nextValue);
      expect(result.nextCursor).toBe(nextCursor);
    }
  });

  test.each([
    [phone("+0 (111) 222-33-44", 18), "+0 (111) 222-33-44", 18],
    [phone("+09998887766 (111) 222-33-44", 12), "+0 (999) 888-77-66", 18],
    [phone("5554443322+0 (999) 888-77-66", 10), "+0 (555) 444-33-22", 18],
    [phone("+0 (555333) 444-33-22", 10), "+0 (555) 333-44-43", 12],
    [phone("+0 (555) 0001122333-44-43", 16), "+0 (555) 000-11-22", 18],
    [phone("1+0 (555) 000-11-22", 1), "+0 (105) 550-00-11", 5],
    [phone("+10 (555) 000-11-22", 2), "+0 (105) 550-00-11", 5],
    [phone("+01 (555) 000-11-22", 3), "+0 (155) 500-01-12", 5],
    [phone("+0 1(555) 000-11-22", 4), "+0 (155) 500-01-12", 5],
    [phone("+0 (1555) 000-11-22", 5), "+0 (155) 500-01-12", 5],
    [phone("+0 (5155) 000-11-22", 6), "+0 (515) 500-01-12", 6],
    [phone("+0 (5515) 000-11-22", 7), "+0 (551) 500-01-12", 7],
    [phone("+0 (5551) 000-11-22", 8), "+0 (555) 100-01-12", 10],
    [phone("+0 (555)1 000-11-22", 9), "+0 (555) 100-01-12", 10],
    [phone("+0 (555) 1000-11-22", 10), "+0 (555) 100-01-12", 10],
    [phone("+0 (555) 0100-11-22", 11), "+0 (555) 010-01-12", 11],
    [phone("+0 (555) 0010-11-22", 12), "+0 (555) 001-01-12", 12],
    [phone("+0 (555) 0001-11-22", 13), "+0 (555) 000-11-12", 14],
    [phone("+0 (555) 000-191-22", 15), "+0 (555) 000-19-12", 15],
    [phone("+0 (555) 000-119-22", 16), "+0 (555) 000-11-92", 17],
    [phone("+0 (555) 000-11-922", 17), "+0 (555) 000-11-92", 17],
    [phone("+0 (555) 000-11-292", 18), "+0 (555) 000-11-29", 18],
    [phone("+0 (555) 000-11-229", 19), "+0 (555) 000-11-22", 18],
  ])("insert into between %#", (result, nextValue, nextCursor) => {
    if (result instanceof Object) {
      expect(result.nextValue).toBe(nextValue);
      expect(result.nextCursor).toBe(nextCursor);
    }
  });
});
