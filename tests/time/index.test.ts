import { useMatch, createMask } from "../../src";
import * as sets from "./sets";
import { checkValue, checkValueCursor } from "../common";

const d = useMatch(() => /\d/);
const s = useMatch(() => /:/, { defaultValue: ":", additional: true });
const h1 = useMatch(() => /[012]/);
const h2 = useMatch(({ valueElements: [h1Value] }) => {
  return h1Value.value.match(/([01])/) ? /(\d)/ : /([0123])/;
});
const m1 = useMatch(() => /([012345])/);

const time = createMask([h1, h2, s, m1, d]);

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
