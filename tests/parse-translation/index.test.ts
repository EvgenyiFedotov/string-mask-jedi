import { parseTranlation } from "../../src/create-config";
import { State, createMask } from "../../src";

const state: State = { cursor: 0, tokens: [], remainder: "" };

test.each([
  [parseTranlation("+"), "+", true],
  [parseTranlation(":", { additional: false }), ":", false],
])("string %#", (config, defaultValue, additional) => {
  if (config[0] instanceof Object) {
    expect(config[0].getMatch).toBeInstanceOf(Function);
    expect(config[0].getMatch(state, 0)).toBeInstanceOf(RegExp);
    expect(config[0].defaultValue).toBe(defaultValue);
    expect(config[0].additional).toBe(additional);
  }
});

test.each([
  [parseTranlation(/\d/), "", false],
  [parseTranlation(/\d/, { defaultValue: "_" }), "_", false],
  [parseTranlation(/\d/, { defaultValue: "_", additional: true }), "_", true],
])("RegExp %#", (config, defaultValue, additional) => {
  if (config[0] instanceof Object) {
    expect(config[0].getMatch).toBeInstanceOf(Function);
    expect(config[0].getMatch(state, 0)).toBeInstanceOf(RegExp);
    expect(config[0].defaultValue).toBe(defaultValue);
    expect(config[0].additional).toBe(additional);
  }
});

describe("getMatch", () => {
  let getMatch = jest.fn((state: State, index: number) => /\d/);

  beforeEach(() => {
    getMatch = jest.fn((state: State, index: number) => /\d/);
  });

  test.each([
    [parseTranlation((...args) => getMatch(...args)), "", false],
    [
      parseTranlation((...args) => getMatch(...args), { defaultValue: "_" }),
      "_",
      false,
    ],
    [
      parseTranlation((...args) => getMatch(...args), { additional: true }),
      "",
      true,
    ],
  ])("main", (config, defaultValue, additional) => {
    if (config[0] instanceof Object) {
      expect(config[0].getMatch).toBeInstanceOf(Function);
      expect(config[0].getMatch(state, 0)).toBeInstanceOf(RegExp);
      expect(config[0].defaultValue).toBe(defaultValue);
      expect(config[0].additional).toBe(additional);
      expect(getMatch.mock.calls.length).toBe(1);
    }
  });
});

describe("TokenConfig", () => {
  let getMatch = jest.fn((state: State, index: number) => /\d/);

  beforeEach(() => {
    getMatch = jest.fn((state: State, index: number) => /\d/);
  });

  test.each([
    [
      parseTranlation({
        getMatch: (...args) => getMatch(...args),
        additional: false,
        defaultValue: "",
      }),
      "",
      false,
    ],

    [
      parseTranlation({
        getMatch: (...args) => getMatch(...args),
        defaultValue: "",
        additional: true,
      }),
      "",
      true,
    ],
    [
      parseTranlation({
        getMatch: (...args) => getMatch(...args),
        defaultValue: "+",
        additional: false,
      }),
      "+",
      false,
    ],
  ])("main", (config, defaultValue, additional) => {
    if (config[0] instanceof Object) {
      expect(config[0].getMatch).toBeInstanceOf(Function);
      expect(config[0].getMatch(state, 0)).toBeInstanceOf(RegExp);
      expect(config[0].defaultValue).toBe(defaultValue);
      expect(config[0].additional).toBe(additional);
      expect(getMatch.mock.calls.length).toBe(1);
    }
  });
});

test("Mask", () => {
  const tokensConfig = parseTranlation(
    createMask("dd:dd", {
      d: /\d/,
    }),
  );

  expect(JSON.stringify(tokensConfig)).toBe(
    JSON.stringify([
      { getMatch: () => /\d/, defaultValue: "", additional: false },
      { getMatch: () => /\d/, defaultValue: "", additional: false },
      { getMatch: () => /:/, defaultValue: ":", additional: true },
      { getMatch: () => /\d/, defaultValue: "", additional: false },
      { getMatch: () => /\d/, defaultValue: "", additional: false },
    ]),
  );
});
