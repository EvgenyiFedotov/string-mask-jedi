import { createConfig, createMask } from "../../src";
import * as phoneSets from "../phone/sets";
import * as timeSets from "../time/sets";
import { checkValue, checkValueCursor } from "../common";

const phone = createMask(
  createConfig("+0 (ddd) ddd-dd-dd", {
    d: { getMatch: () => /\d/ },
  }),
);

const phoneStrict = createMask(
  createConfig("+0 (ddd) ddd-dd-dd", {
    d: { getMatch: () => /\d/ },
    "0": { getMatch: () => /^0/, additional: true, defaultValue: "0" },
  }),
);

const time1 = createMask(
  createConfig("Hh:Mm", {
    H: { getMatch: () => /[012]/ },
    h: {
      getMatch: ({ valueElements: [h1Value] }) => {
        return h1Value.value.match(/([01])/) ? /(\d)/ : /([0123])/;
      },
    },
    M: { getMatch: () => /([012345])/ },
    m: { getMatch: () => /\d/ },
  }),
);

const time2 = createMask(
  createConfig("HH:MM", {
    H: {
      getMatch: (state, index) => {
        const { valueElements: nextValue } = state;
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
  }),
);

// Tests phone
test.each(phoneSets.withoutCursor(phone))("without cursor %#", checkValue);

test.each(phoneSets.withoutCursor(phoneStrict, true))(
  "without cursor [strict] %#",
  checkValue,
);

describe("with cursor", () => {
  test.each(phoneSets.withCursor.stepByStep(phone))(
    "step by step %#",
    checkValueCursor,
  );

  test.each(phoneSets.withCursor.stepByStep(phoneStrict))(
    "step by step [strict] %#",
    checkValueCursor,
  );

  test.each(phoneSets.withCursor.insertIntoBetween(phone))(
    "insert into between %#",
    checkValueCursor,
  );

  test.each(phoneSets.withCursor.insertIntoBetween(phoneStrict, true))(
    "insert into between [strict] %#",
    checkValueCursor,
  );
});

// Test time
test.each(timeSets.withoutCursor(time1))("without cursor", checkValue);

describe("with cursor", () => {
  test.each(timeSets.withCursor.stepByStep(time1))(
    "step by step %#",
    checkValueCursor,
  );

  describe("set in between", () => {
    test.each(timeSets.withCursor.setInBetween.bySingleNumber(time1))(
      "by single number %#",
      checkValueCursor,
    );

    test.each(timeSets.withCursor.setInBetween.byManyNumber(time1))(
      "by many number %#",
      checkValueCursor,
    );
  });
});

test.each(timeSets.withoutCursor(time2))("without cursor", checkValue);

describe("with cursor", () => {
  test.each(timeSets.withCursor.stepByStep(time2))(
    "step by step %#",
    checkValueCursor,
  );

  describe("set in between", () => {
    test.each(timeSets.withCursor.setInBetween.bySingleNumber(time2))(
      "by single number %#",
      checkValueCursor,
    );

    test.each(timeSets.withCursor.setInBetween.byManyNumber(time2))(
      "by many number %#",
      checkValueCursor,
    );
  });
});
