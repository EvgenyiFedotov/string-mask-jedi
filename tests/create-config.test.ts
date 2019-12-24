import { createConfig, createMask } from "../src";
import * as phoneTests from "./phone.test";
import * as timeTests from "./time.test";

// Phone
const phoneConfig = createConfig("+0 (ddd) ddd-dd-dd", {
  d: { getMatch: () => /\d/ },
});
const phone = createMask(phoneConfig);

phoneTests.tests(phone);

const phoneConfigStrict = createConfig("+0 (ddd) ddd-dd-dd", {
  d: { getMatch: () => /\d/ },
  "0": { getMatch: () => /^0/, additional: true, defaultValue: "0" },
});
const phoneStrict = createMask(phoneConfigStrict);

phoneTests.testsStrict(phoneStrict);

// Time
const timeConfigSetup1 = createConfig("Hh:Mm", {
  H: { getMatch: () => /[012]/ },
  h: {
    getMatch: ({ nextValue: [h1Value] }) => {
      return h1Value.value.match(/([01])/) ? /(\d)/ : /([0123])/;
    },
  },
  M: { getMatch: () => /([012345])/ },
  m: { getMatch: () => /\d/ },
});
const timeSetup1 = createMask(timeConfigSetup1);

timeTests.tests(timeSetup1);

const timeConfigSetup2 = createConfig("HH:MM", {
  H: {
    getMatch: (state, index) => {
      const { nextValue } = state;
      const [h1Value] = nextValue;

      if (index === 0) {
        return /[012]/;
      }

      return h1Value.value.match(/([01])/) ? /(\d)/ : /([0123])/;
    },
  },
  M: {
    getMatch: (state, index) => {
      if (index === 3) {
        return /([012345])/;
      }

      return /\d/;
    },
  },
});
const timeSetup2 = createMask(timeConfigSetup2);

timeTests.tests(timeSetup2);
