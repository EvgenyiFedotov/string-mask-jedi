import * as React from "react";
import * as enzyme from "enzyme";

import { createMask } from "../../../src";
import { useMask } from "../../../src/react";

const mask = createMask("dd:dd", { d: /\d/ });

const Input: React.FC = () => {
  const { value, onChange, ref } = useMask(mask);

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
])("craete mask, change input value %#", (insert, result) => {
  const component = enzyme.mount(<Input />);
  const input = component.find("input").getDOMNode<HTMLInputElement>();

  input.value = insert.value;
  input.selectionStart = insert.cursor;
  input.selectionEnd = insert.cursor;

  component.find("input").simulate("change");

  expect(component.find("input")).toHaveLength(1);
  expect(input.value).toBe(result.value);
  expect(input.selectionStart).toBe(result.cursor);
});
