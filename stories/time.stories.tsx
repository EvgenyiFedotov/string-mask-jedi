import React from "react";
import { useMask } from "../src/react";
import { createMask } from "../src";

export default {
  title: "Time",
};

const mask = createMask("Hh:M", {
  H: /[012]/,
  h: ({ tokens: [h1] }) => (h1.value.match(/([01])/) ? /(\d)/ : /([0123])/),
  M: [/([012345])/, /\d/],
});

export const init = () => {
  const { value, onChange, ref } = useMask(mask);

  return <input value={value} onChange={onChange} ref={ref} />;
};
