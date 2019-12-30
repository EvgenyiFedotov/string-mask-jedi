import { createMaskByConfig } from "../../src";
import * as sets from "./sets";
import { checkValue, checkValueCursor } from "../common";
import { config } from "../../src/configs/date";

const date = createMaskByConfig(config);

test.each(sets.withoutCursor(date))("without cursor", checkValue);

describe("with cursor", () => {
  test.each(sets.withCursor.stepByStep(date))("step by step", checkValueCursor);

  test.each(sets.withCursor.insertIntoBetween(date))(
    "insert into between",
    checkValueCursor,
  );
});
