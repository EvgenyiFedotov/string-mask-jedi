import { createConfig, createMaskByConfig, createMatch } from "../../src";
import * as sets from "./sets";

const phone = createMaskByConfig(
  createConfig("+0 (ddd) ddd-dd-dd", {
    d: createMatch(() => /\d/),
  }),
);

const phoneStrict = createMaskByConfig(
  createConfig("+Z (ddd) ddd-dd-dd", {
    d: createMatch(() => /\d/),
    Z: createMatch(() => /^0/, { additional: true, defaultValue: "0" }),
  }),
);

const phone2 = createMaskByConfig(
  createConfig("+0 (ddd) ddd-dd-dd", {
    d: /\d/,
  }),
);

const time1 = createMaskByConfig(
  createConfig("Hh:Mm", {
    H: createMatch(() => /[012]/),
    h: createMatch(({ state: { valueElements: [h1] } }) =>
      h1 && h1.value.match(/([01])/) ? /(\d)/ : /([0123])/,
    ),
    M: createMatch(() => /([012345])/),
    m: createMatch(() => /\d/),
  }),
);

const time2 = createMaskByConfig(
  createConfig("HH:MM", {
    H: createMatch(({ state: { valueElements: [h1] }, index }) =>
      index === 0
        ? /[012]/
        : h1 && h1.value.match(/([01])/)
        ? /(\d)/
        : /([0123])/,
    ),
    M: createMatch(({ index }) => (index === 3 ? /([012345])/ : /\d/)),
  }),
);

const time3 = createMaskByConfig(
  createConfig("H:M", {
    H: [
      createMatch(() => /[012]/),
      createMatch(({ state: { valueElements: [h1] } }) =>
        h1 && h1.value.match(/([01])/) ? /(\d)/ : /([0123])/,
      ),
    ],
    M: [createMatch(() => /([012345])/), createMatch(() => /\d/)],
  }),
);

const time4 = createMaskByConfig(
  createConfig("Hh:Mm", {
    H: /[012]/,
    h: ({
      state: {
        valueElements: [h1],
      },
    }) => (h1 && h1.value.match(/([01])/) ? /(\d)/ : /([0123])/),
    M: /([012345])/,
    m: /\d/,
  }),
);

const time5 = createMaskByConfig(
  createConfig("H:M", {
    H: [
      /[012]/,
      ({
        state: {
          valueElements: [h1],
        },
      }) => (h1 && h1.value.match(/([01])/) ? /(\d)/ : /([0123])/),
    ],
    M: [createMatch(() => /([012345])/), /\d/],
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
