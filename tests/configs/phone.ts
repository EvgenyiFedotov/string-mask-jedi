import { createMask } from "../../src";

export const mask = createMask("+0 (ddd) ddd-dd-dd", {
  d: /\d/,
});

export const maskStrict = createMask("+z (ddd) ddd-dd-dd", {
  z: { getMatch: () => /^0/, additional: true, defaultValue: "0" },
  d: /\d/,
});
