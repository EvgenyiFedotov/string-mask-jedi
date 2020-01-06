import { MaskResult } from "../src";

export const checkValue = (result: MaskResult, value: string) => {
  expect(result.value).toBe(value);
};

export const checkValueCursor = (
  result: MaskResult,
  value: string,
  cursor: number,
) => {
  expect(result.value).toBe(value);
  expect(result.cursor).toBe(cursor);
};
