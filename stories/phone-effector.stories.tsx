import React from "react";
import { createEvent, restore, combine } from "effector";
import { useStore } from "effector-react";
import { useMask } from "../src/react";
import { createMask, MaskResult } from "../src";

export default {
  title: "Phone-effector",
};

const mask = createMask("+0 (ddd) ddd-dd-dd", {
  d: /\d/,
});

const updateValue = createEvent<MaskResult>();
const $value = restore(updateValue, { value: "", cursor: 0 });

export const init = () => {
  const rawValue = useStore($value);
  const { value, onChange, ref } = useMask(mask, () => [rawValue, updateValue]);

  return <input value={value} onChange={onChange} ref={ref} />;
};

const updateValue1 = createEvent<MaskResult>();
const $value1 = restore(updateValue1, {
  value: "00001234455",
  cursor: 0,
});

const updateValue2 = createEvent<MaskResult>();
const $value2 = restore(updateValue2, { value: "", cursor: 0 });

const $formValues = combine({ value1: $value1, value2: $value2 });

export const form = () => {
  const rawValue1 = useStore($value1);
  const input1 = useMask(mask, () => [rawValue1, updateValue1]);

  const rawValue2 = useStore($value2);
  const input2 = useMask(mask, () => [rawValue2, updateValue2]);

  const formValues = useStore($formValues);

  return (
    <div>
      <input value={input1.value} onChange={input1.onChange} ref={input1.ref} />
      <input value={input2.value} onChange={input2.onChange} ref={input2.ref} />
      <div style={{ whiteSpace: "pre" }}>
        {JSON.stringify(formValues, null, 2)}
      </div>
    </div>
  );
};
