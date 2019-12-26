import { createTokenConfig, createMaskByConfig } from "../../src";
import * as timeSets from "../time/sets";
import { checkValue, checkValueCursor } from "../common";

const time = createMaskByConfig([
  createTokenConfig(() => /[012]/),
  createTokenConfig(({ tokens: [h1] }) =>
    h1.value.match(/([01])/) ? /(\d)/ : /([0123])/,
  ),
  createTokenConfig(":"),
  createTokenConfig(() => /([012345])/),
  createTokenConfig(() => /\d/),
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
