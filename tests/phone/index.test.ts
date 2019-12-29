import { createTokenConfig, createMaskByConfig, createMask } from "../../src";
import * as sets from "./sets";
import { checkValue, checkValueCursor } from "../common";

const phone = createMask("+0 (ddd) ddd-dd-dd", {
  d: /\d/,
});

const phoneStrict = createMask("+z (ddd) ddd-dd-dd", {
  z: { getMatch: () => /^0/, additional: true, defaultValue: "0" },
  d: /\d/,
});

test.each(sets.withoutCursor(phone))("without cursor %#", checkValue);

test.each(sets.withoutCursor(phoneStrict, true))(
  "without cursor [strict] %#",
  checkValue,
);

describe("with cursor", () => {
  test.each(sets.withCursor.stepByStep(phone))(
    "step by step %#",
    checkValueCursor,
  );

  test.each(sets.withCursor.stepByStep(phoneStrict))(
    "step by step [strict] %#",
    checkValueCursor,
  );

  test.each(sets.withCursor.insertIntoBetween(phone))(
    "insert into between %#",
    checkValueCursor,
  );

  test.each(sets.withCursor.insertIntoBetween(phoneStrict, true))(
    "insert into between [strict] %#",
    checkValueCursor,
  );
});
