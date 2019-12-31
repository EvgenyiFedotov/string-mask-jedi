import React from "react";
import { useMask } from "../src/react";
import * as masks from "../tests/configs";

export default {
  title: "init",
};

export const Time = () => {
  const { value, onChange, ref } = useMask(masks.time);

  return <input value={value} onChange={onChange} ref={ref} />;
};

export const Phone = () => {
  const { value, onChange, ref } = useMask(masks.phone);

  return <input value={value} onChange={onChange} ref={ref} />;
};

export const Date = () => {
  const { value, onChange, ref } = useMask(masks.date);

  return <input value={value} onChange={onChange} ref={ref} />;
};
