import * as sets from "./sets";
import { checkValue, checkValueCursor } from "../common";
import { mask } from "../configs/date";

test.each(sets.withoutCursor(mask))("without cursor", checkValue);

describe("with cursor", () => {
  test.each(sets.withCursor.stepByStep(mask))("step by step", checkValueCursor);

  test.each(sets.withCursor.insertIntoBetween(mask))(
    "insert into between",
    checkValueCursor,
  );
});
