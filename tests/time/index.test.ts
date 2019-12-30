import { createMaskByConfig } from "../../src";
import * as sets from "./sets";
import { checkValue, checkValueCursor } from "../common";
import * as configs from "../../src/configs";

const time = createMaskByConfig(configs.time);

test.each(sets.withoutCursor(time))("without cursor", checkValue);

describe("with cursor", () => {
  test.each(sets.withCursor.stepByStep(time))(
    "step by step %#",
    checkValueCursor,
  );

  describe("set in between", () => {
    test.each(sets.withCursor.setInBetween.bySingleNumber(time))(
      "by single number %#",
      checkValueCursor,
    );

    test.each(sets.withCursor.setInBetween.byManyNumber(time))(
      "by many number %#",
      checkValueCursor,
    );
  });
});
