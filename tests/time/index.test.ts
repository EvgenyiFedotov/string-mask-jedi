import * as sets from "./sets";
import { checkValue, checkValueCursor } from "../common";
import * as configs from "../configs";

test.each(sets.withoutCursor(configs.time))("without cursor", checkValue);

describe("with cursor", () => {
  test.each(sets.withCursor.stepByStep(configs.time))(
    "step by step %#",
    checkValueCursor,
  );

  describe("set in between", () => {
    test.each(sets.withCursor.setInBetween.bySingleNumber(configs.time))(
      "by single number %#",
      checkValueCursor,
    );

    test.each(sets.withCursor.setInBetween.byManyNumber(configs.time))(
      "by many number %#",
      checkValueCursor,
    );
  });
});
