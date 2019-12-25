import React from "react";
import { createMask } from "../src";
import { useStringMask } from "./lib";

const time = createMask("H:M", {
  H: [
    /[012]/,
    ({ state }) => {
      const [h1] = state.valueElements;

      if (h1 && h1.value.match(/([01])/)) {
        return /(\d)/;
      }

      return /([0123])/;
    },
  ],
  M: [/([012345])/, () => /\d/],
});

const phone = createMask("+0 (ddd) ddd-dd-dd", {
  d: /\d/,
});

const date = createMask("dd/dd/dddd", {
  d: /\d/,
});

export default {
  title: "init",
};

export const Time = () => {
  const { value, onChange, ref } = useStringMask(time);

  return <input value={value} onChange={onChange} ref={ref} />;
};

export const Phone = () => {
  const { value, onChange, ref } = useStringMask(phone);

  return <input value={value} onChange={onChange} ref={ref} />;
};

export const Date = () => {
  const { value, onChange, ref } = useStringMask(date);

  return <input value={value} onChange={onChange} ref={ref} />;
};
