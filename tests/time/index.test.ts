import { createMask } from "../../src";
import * as sets from "./sets";
import { checkValue, checkValueCursor } from "../common";

const time = createMask("h:m", {
  h: [
    /[012]/,
    ({ tokens: [h1] }) => (h1.value.match(/([01])/) ? /(\d)/ : /([0123])/),
  ],
  m: [/([012345])/, /\d/],
});

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
