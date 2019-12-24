import { useMatch, createMask } from "../../src";
import * as sets from "./sets";
import { checkValue, checkValueCursor } from "../common";

const d = useMatch(() => /\d/);
const plus = useMatch(() => /\+/, { defaultValue: "+", additional: true });
const prenumber = useMatch(() => /0/, { defaultValue: "0", additional: true });
const prenumberStrict = useMatch(() => /^0/, {
  defaultValue: "0",
  additional: true,
});
const space = useMatch(() => / /, { defaultValue: " ", additional: true });
const open = useMatch(() => /\(/, { defaultValue: "(", additional: true });
const close = useMatch(() => /\)/, { defaultValue: ")", additional: true });
const tr = useMatch(() => /-/, { defaultValue: "-", additional: true });

const phone = createMask([
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

const phoneStrict = createMask([
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
