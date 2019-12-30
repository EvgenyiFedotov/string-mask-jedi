import { createConfig } from "../../src";

export const config = createConfig("h:m", {
  h: [
    /[012]/,
    ({ tokens: [h1] }) => (h1.value.match(/([01])/) ? /(\d)/ : /([0123])/),
  ],
  m: [/([012345])/, /\d/],
});
