import * as React from "react";
import * as enzyme from "enzyme";
import testing from "react-dom/test-utils";
import { createEvent, restore } from "effector";
import { useStore } from "effector-react";

import { createMask, MaskResult } from "../../../src";
import { useMask } from "../../../src/react";

const mask = createMask("dd:dd", { d: /\d/ });

const updateValue = createEvent<MaskResult>();
const $value = restore(updateValue, { value: "", cursor: 0 });

const Input: React.FC = () => {
  const rawValue = useStore($value);
  const { value, onChange, ref } = useMask(mask, () => [rawValue, updateValue]);

  return <input value={value} onChange={onChange} ref={ref} />;
};

test.each([
  [
    { value: "1", cursor: 1 },
    { value: "1", cursor: 1 },
  ],
  [
    { value: "12", cursor: 2 },
    { value: "12", cursor: 2 },
  ],
  [
    { value: "123", cursor: 3 },
    { value: "12:3", cursor: 4 },
  ],
  [
    { value: "12:34", cursor: 5 },
    { value: "12:34", cursor: 5 },
  ],
  [
    { value: "12:3", cursor: 4 },
    { value: "12:3", cursor: 4 },
  ],
  [
    { value: "12:", cursor: 3 },
    { value: "12", cursor: 2 },
  ],
  [
    { value: "1", cursor: 1 },
    { value: "1", cursor: 1 },
  ],
  [
    { value: "", cursor: 0 },
    { value: "", cursor: 0 },
  ],
  [
    { value: "123", cursor: 3 },
    { value: "12:3", cursor: 4 },
  ],
  [
    { value: "124:3", cursor: 3 },
    { value: "12:43", cursor: 4 },
  ],
])("create mask, change input value %#", (insert, result) => {
  const component = enzyme.mount(<Input />);
  const input = component.find("input").getDOMNode<HTMLInputElement>();

  input.value = insert.value;
  input.selectionStart = insert.cursor;
  input.selectionEnd = insert.cursor;

  component.find("input").simulate("change");

  expect($value.getState()).toEqual(result);

  expect(component.find("input")).toHaveLength(1);
  expect(input.value).toBe(result.value);
  expect(input.selectionStart).toBe(result.cursor);
});

test.each([
  [
    { value: "1", cursor: 1 },
    { value: "1", cursor: 1 },
  ],
  [
    { value: "12", cursor: 2 },
    { value: "12", cursor: 2 },
  ],
  [
    { value: "123", cursor: 3 },
    { value: "12:3", cursor: 4 },
  ],
  [
    { value: "12:34", cursor: 5 },
    { value: "12:34", cursor: 5 },
  ],
  [
    { value: "12:3", cursor: 4 },
    { value: "12:3", cursor: 4 },
  ],
  [
    { value: "12:", cursor: 3 },
    { value: "12", cursor: 2 },
  ],
  [
    { value: "1", cursor: 1 },
    { value: "1", cursor: 1 },
  ],
  [
    { value: "", cursor: 0 },
    { value: "", cursor: 0 },
  ],
  [
    { value: "123", cursor: 3 },
    { value: "12:3", cursor: 4 },
  ],
  [
    { value: "124:3", cursor: 3 },
    { value: "12:43", cursor: 4 },
  ],
])("create mask, change store value %#", (insert, result) => {
  const component = enzyme.mount(<Input />);
  const input = component.find("input").getDOMNode<HTMLInputElement>();

  testing.act(() => {
    updateValue(result);
  });

  component.find("input").simulate("change");

  expect($value.getState()).toEqual(result);

  expect(component.find("input")).toHaveLength(1);
  expect(input.value).toBe(result.value);
  expect(input.selectionStart).toBe(result.cursor);
});
