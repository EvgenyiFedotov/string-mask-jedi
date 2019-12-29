import { createTokenConfig, State } from "../../src";

const state: State = { cursor: 0, tokens: [], remainder: "" };

test.each([
  [createTokenConfig("+"), "+", true],
  [createTokenConfig(":", { additional: false }), ":", false],
])("string %#", (config, defaultValue, additional) => {
  if (config instanceof Object) {
    expect(config.getMatch).toBeInstanceOf(Function);
    expect(config.getMatch(state, 0)).toBeInstanceOf(RegExp);
    expect(config.defaultValue).toBe(defaultValue);
    expect(config.additional).toBe(additional);
  }
});

test.each([
  [createTokenConfig(/\d/), "", false],
  [createTokenConfig(/\d/, { defaultValue: "_" }), "_", false],
  [createTokenConfig(/\d/, { defaultValue: "_", additional: true }), "_", true],
])("RegExp %#", (config, defaultValue, additional) => {
  if (config instanceof Object) {
    expect(config.getMatch).toBeInstanceOf(Function);
    expect(config.getMatch(state, 0)).toBeInstanceOf(RegExp);
    expect(config.defaultValue).toBe(defaultValue);
    expect(config.additional).toBe(additional);
  }
});

describe("getMatch", () => {
  let getMatch = jest.fn((state: State, index: number) => /\d/);

  beforeEach(() => {
    getMatch = jest.fn((state: State, index: number) => /\d/);
  });

  test.each([
    [createTokenConfig((...args) => getMatch(...args)), "", false],
    [
      createTokenConfig((...args) => getMatch(...args), { defaultValue: "_" }),
      "_",
      false,
    ],
    [
      createTokenConfig((...args) => getMatch(...args), { additional: true }),
      "",
      true,
    ],
  ])("main", (config, defaultValue, additional) => {
    if (config instanceof Object) {
      expect(config.getMatch).toBeInstanceOf(Function);
      expect(config.getMatch(state, 0)).toBeInstanceOf(RegExp);
      expect(config.defaultValue).toBe(defaultValue);
      expect(config.additional).toBe(additional);
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
      createTokenConfig({
        getMatch: (...args) => getMatch(...args),
        additional: false,
        defaultValue: "",
      }),
      "",
      false,
    ],

    [
      createTokenConfig({
        getMatch: (...args) => getMatch(...args),
        defaultValue: "",
        additional: true,
      }),
      "",
      true,
    ],
    [
      createTokenConfig({
        getMatch: (...args) => getMatch(...args),
        defaultValue: "+",
        additional: false,
      }),
      "+",
      false,
    ],
  ])("main", (config, defaultValue, additional) => {
    if (config instanceof Object) {
      expect(config.getMatch).toBeInstanceOf(Function);
      expect(config.getMatch(state, 0)).toBeInstanceOf(RegExp);
      expect(config.defaultValue).toBe(defaultValue);
      expect(config.additional).toBe(additional);
      expect(getMatch.mock.calls.length).toBe(1);
    }
  });
});
