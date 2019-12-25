import { Mask } from "../../src";
import * as phoneSets from "../phone/sets";
import * as timeSets from "../time/sets";
import { checkValue, checkValueCursor } from "../common";

export const phone = (mask: Mask, maskStrict?: Mask) => {
  test.each(phoneSets.withoutCursor(mask))("without cursor %#", checkValue);

  if (maskStrict) {
    test.each(phoneSets.withoutCursor(maskStrict, true))(
      "without cursor [strict] %#",
      checkValue,
    );
  }

  describe("with cursor", () => {
    test.each(phoneSets.withCursor.stepByStep(mask))(
      "step by step %#",
      checkValueCursor,
    );

    if (maskStrict) {
      test.each(phoneSets.withCursor.stepByStep(maskStrict))(
        "step by step [strict] %#",
        checkValueCursor,
      );
    }

    test.each(phoneSets.withCursor.insertIntoBetween(mask))(
      "insert into between %#",
      checkValueCursor,
    );

    if (maskStrict) {
      test.each(phoneSets.withCursor.insertIntoBetween(maskStrict, true))(
        "insert into between [strict] %#",
        checkValueCursor,
      );
    }
  });
};

export const time = (mask: Mask) => {
  test.each(timeSets.withoutCursor(mask))("without cursor", checkValue);

  describe("with cursor", () => {
    test.each(timeSets.withCursor.stepByStep(mask))(
      "step by step %#",
      checkValueCursor,
    );

    describe("set in between", () => {
      test.each(timeSets.withCursor.setInBetween.bySingleNumber(mask))(
        "by single number %#",
        checkValueCursor,
      );

      test.each(timeSets.withCursor.setInBetween.byManyNumber(mask))(
        "by many number %#",
        checkValueCursor,
      );
    });
  });
};
