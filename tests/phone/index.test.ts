import { createMatch, createMaskByConfig } from "../../src";
import * as sets from "./sets";
import { checkValue, checkValueCursor } from "../common";

const d = createMatch(() => /\d/);
const plus = createMatch(() => /\+/, { defaultValue: "+", additional: true });
const prenumber = createMatch(() => /0/, {
  defaultValue: "0",
  additional: true,
});
const prenumberStrict = createMatch(() => /^0/, {
  defaultValue: "0",
  additional: true,
});
const space = createMatch(() => / /, { defaultValue: " ", additional: true });
const open = createMatch(() => /\(/, { defaultValue: "(", additional: true });
const close = createMatch(() => /\)/, { defaultValue: ")", additional: true });
const tr = createMatch(() => /-/, { defaultValue: "-", additional: true });

const phone = createMaskByConfig([
  plus,
  prenumber,
  space,
  open,
  d,
  d,
  d,
  close,
  space,
  d,
  d,
  d,
  tr,
  d,
  d,
  tr,
  d,
  d,
]);

const phoneStrict = createMaskByConfig([
  plus,
  prenumberStrict,
  space,
  open,
  d,
  d,
  d,
  close,
  space,
  d,
  d,
  d,
  tr,
  d,
  d,
  tr,
  d,
  d,
]);

test.each(sets.withoutCursor(phone))("without cursor %#", checkValue);

test.each(sets.withoutCursor(phoneStrict, true))(
  "without cursor [strict] %#",
  checkValue,
);

describe("with cursor", () => {
  test.each(sets.withCursor.stepByStep(phone))(
    "step by step %#",
    checkValueCursor,
  );

  test.each(sets.withCursor.stepByStep(phoneStrict))(
    "step by step [strict] %#",
    checkValueCursor,
  );

  test.each(sets.withCursor.insertIntoBetween(phone))(
    "insert into between %#",
    checkValueCursor,
  );

  test.each(sets.withCursor.insertIntoBetween(phoneStrict, true))(
    "insert into between [strict] %#",
    checkValueCursor,
  );
});
