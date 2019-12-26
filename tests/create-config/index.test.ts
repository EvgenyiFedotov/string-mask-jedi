import { createConfig, createMaskByConfig, createTokenConfig } from "../../src";
import * as sets from "./sets";

const phone = createMaskByConfig(
  createConfig("+0 (ddd) ddd-dd-dd", {
    d: createTokenConfig(() => /\d/),
  }),
);

const phoneStrict = createMaskByConfig(
  createConfig("+Z (ddd) ddd-dd-dd", {
    d: createTokenConfig(() => /\d/),
    Z: createTokenConfig(() => /^0/, { additional: true, defaultValue: "0" }),
  }),
);

const phone2 = createMaskByConfig(
  createConfig("+0 (ddd) ddd-dd-dd", {
    d: /\d/,
  }),
);

const time1 = createMaskByConfig(
  createConfig("Hh:Mm", {
    H: createTokenConfig(() => /[012]/),
    h: createTokenConfig(({ tokens: [h1] }) =>
      h1 && h1.value.match(/([01])/) ? /(\d)/ : /([0123])/,
    ),
    M: createTokenConfig(() => /([012345])/),
    m: createTokenConfig(() => /\d/),
  }),
);

const time2 = createMaskByConfig(
  createConfig("HH:MM", {
    H: createTokenConfig(({ tokens: [h1] }, index) =>
      index === 0 ? /[012]/ : h1.value.match(/([01])/) ? /(\d)/ : /([0123])/,
    ),
    M: createTokenConfig((state, index) => (index === 3 ? /([012345])/ : /\d/)),
  }),
);

const time3 = createMaskByConfig(
  createConfig("H:M", {
    H: [
      createTokenConfig(() => /[012]/),
      createTokenConfig(({ tokens: [h1] }) =>
        h1 && h1.value.match(/([01])/) ? /(\d)/ : /([0123])/,
      ),
    ],
    M: [createTokenConfig(() => /([012345])/), createTokenConfig(() => /\d/)],
  }),
);

const time4 = createMaskByConfig(
  createConfig("Hh:Mm", {
    H: /[012]/,
    h: ({ tokens: [h1] }) => (h1.value.match(/([01])/) ? /(\d)/ : /([0123])/),
    M: /([012345])/,
    m: /\d/,
  }),
);

const time5 = createMaskByConfig(
  createConfig("H:M", {
    H: [
      /[012]/,
      ({ tokens: [h1] }) =>
        h1 && h1.value.match(/([01])/) ? /(\d)/ : /([0123])/,
    ],
    M: [createTokenConfig(() => /([012345])/), /\d/],
  }),
);

// Phones
sets.phone(phone, phoneStrict);
sets.phone(phone2);

// Times
sets.time(time1);
sets.time(time2);
sets.time(time3);
sets.time(time4);
sets.time(time5);
