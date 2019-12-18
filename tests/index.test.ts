import { useMatch, createMask } from "../src";

const d = useMatch(() => /\d/);
const s = useMatch(() => ":");
const h1 = useMatch(() => /[012]/);
const h2 = useMatch(({ nextValue: [h1Value] }) => {
  return h1Value.match(/([01])/) ? /(\d)/ : /([0123])/;
});
const m1 = useMatch(() => /([012345])/);

test("time", () => {
  const mask = createMask(h1, h2, s, m1, d);

  expect(mask("1237").nextValue).toBe("12:37");
  expect(mask("2132").nextValue).toBe("21:32");
  expect(mask("2400").nextValue).toBe("20:40");
  expect(mask("2900").nextValue).toBe("20:09");
  expect(mask("5555").nextValue).toBe("");
  expect(mask("0555").nextValue).toBe("05:55");
  expect(mask("555").nextValue).toBe("");
  expect(mask("12:37").nextValue).toBe("12:37");
});
