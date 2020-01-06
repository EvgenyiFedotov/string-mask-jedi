import * as sets from "./sets";
import { checkValue, checkValueCursor } from "../common";
import { mask, maskStrict } from "../configs/phone";

test.each(sets.withoutCursor(mask))("without cursor %#", checkValue);

test.each(sets.withoutCursor(maskStrict, true))(
  "without cursor [strict] %#",
  checkValue,
);

describe("with cursor", () => {
  test.each(sets.withCursor.stepByStep(mask))(
    "step by step %#",
    checkValueCursor,
  );

  test.each(sets.withCursor.stepByStep(maskStrict))(
    "step by step [strict] %#",
    checkValueCursor,
  );

  test.each(sets.withCursor.insertIntoBetween(mask))(
    "insert into between %#",
    checkValueCursor,
  );

  test.each(sets.withCursor.insertIntoBetween(maskStrict, true))(
    "insert into between [strict] %#",
    checkValueCursor,
  );
});
