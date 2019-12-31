import React from "react";
import { useMask } from "../src/react";
import { createMask } from "../src";

export default {
  title: "Phone",
};

const mask = createMask("+0 (ddd) ddd-dd-dd", {
  d: /\d/,
});

export const init = () => {
  const { value, onChange, ref } = useMask(mask);

  return <input value={value} onChange={onChange} ref={ref} />;
};
