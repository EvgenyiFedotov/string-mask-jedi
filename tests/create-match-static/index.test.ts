import { createMatch, createMatchStatic, createMaskByConfig } from "../../src";
import * as timeSets from "../time/sets";
import { checkValue, checkValueCursor } from "../common";

const time = createMaskByConfig([
  createMatch(() => /[012]/),
  createMatch(({ state: { valueElements: [h1] } }) =>
    h1.value.match(/([01])/) ? /(\d)/ : /([0123])/,
  ),
  createMatchStatic(":"),
  createMatch(() => /([012345])/),
  createMatch(() => /\d/),
]);

test.each(timeSets.withoutCursor(time))("without cursor", checkValue);

describe("with cursor", () => {
  test.each(timeSets.withCursor.stepByStep(time))(
    "step by step %#",
    checkValueCursor,
  );

  describe("set in between", () => {
    test.each(timeSets.withCursor.setInBetween.bySingleNumber(time))(
      "by single number %#",
      checkValueCursor,
    );

    test.each(timeSets.withCursor.setInBetween.byManyNumber(time))(
      "by many number %#",
      checkValueCursor,
    );
  });
});
