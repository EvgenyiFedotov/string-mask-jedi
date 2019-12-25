import { createMatch, createMaskByConfig } from "../../src";
import * as sets from "./sets";
import { checkValue, checkValueCursor } from "../common";

const d = createMatch(() => /\d/);
const s = createMatch(() => /:/, { defaultValue: ":", additional: true });
const h1 = createMatch(() => /[012]/);
const h2 = createMatch(({ state: { valueElements: [h1] } }) =>
  h1.value.match(/([01])/) ? /(\d)/ : /([0123])/,
);
const m1 = createMatch(() => /([012345])/);

const time = createMaskByConfig([h1, h2, s, m1, d]);

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
