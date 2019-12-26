import { createMask } from "../../src";
import * as configSets from "../create-config/sets";

const phone = createMask("+0 (ddd) ddd-dd-dd", {
  d: /\d/,
});

const time = createMask("Hh:Mm", {
  H: /[012]/,
  h: ({ tokens: [h1] }) =>
    h1 && h1.value.match(/([01])/) ? /(\d)/ : /([0123])/,
  M: /([012345])/,
  m: /\d/,
});

configSets.phone(phone);
configSets.time(time);
