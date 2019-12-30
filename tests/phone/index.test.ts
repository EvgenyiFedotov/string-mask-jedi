import { createMaskByConfig } from "../../src";
import * as sets from "./sets";
import { checkValue, checkValueCursor } from "../common";
import { config, configStrict } from "../../src/configs/phone";

const phone = createMaskByConfig(config);

const phoneStrict = createMaskByConfig(configStrict);

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
