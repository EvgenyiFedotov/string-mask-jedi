import { createConfig } from "../../src";

export const config = createConfig("+0 (ddd) ddd-dd-dd", {
  d: /\d/,
});

export const configStrict = createConfig("+z (ddd) ddd-dd-dd", {
  z: { getMatch: () => /^0/, additional: true, defaultValue: "0" },
  d: /\d/,
});
