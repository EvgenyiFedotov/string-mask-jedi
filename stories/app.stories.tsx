import React from "react";
import { useMatch, createConfig, createMask } from "../src";
import { useStringMask } from "./lib";

const time = createMask(
  createConfig("H:M", {
    H: [
      useMatch(() => /[012]/),
      useMatch(({ state: { valueElements: [h1] } }) =>
        h1.value.match(/([01])/) ? /(\d)/ : /([0123])/,
      ),
    ],
    M: [useMatch(() => /([012345])/), useMatch(() => /\d/)],
  }),
);

const phone = createMask(
  createConfig("+0 (ddd) ddd-dd-dd", {
    d: useMatch(() => /\d/),
  }),
);

const date = createMask(
  createConfig("dd/dd/dddd", {
    d: useMatch(() => /\d/),
  }),
);

export default {
  title: "init",
};

export const Time = () => {
  const ref = useStringMask(time);

  return <input ref={ref} />;
};

export const Phone = () => {
  const ref = useStringMask(phone);

  return <input ref={ref} />;
};

export const Date = () => {
  const ref = useStringMask(date);

  return <input ref={ref} />;
};
