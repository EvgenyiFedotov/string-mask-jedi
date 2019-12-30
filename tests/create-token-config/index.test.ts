import {
  createTokenConfig,
  State,
  createMaskByConfig,
  createConfig,
} from "../../src";

const state: State = { cursor: 0, tokens: [], remainder: "" };

test.each([
  [createTokenConfig("+"), "+", true],
  [createTokenConfig(":", { additional: false }), ":", false],
])("string %#", (config, defaultValue, additional) => {
  if (config[0] instanceof Object) {
    expect(config[0].getMatch).toBeInstanceOf(Function);
    expect(config[0].getMatch(state, 0)).toBeInstanceOf(RegExp);
    expect(config[0].defaultValue).toBe(defaultValue);
    expect(config[0].additional).toBe(additional);
  }
});

test.each([
  [createTokenConfig(/\d/), "", false],
  [createTokenConfig(/\d/, { defaultValue: "_" }), "_", false],
  [createTokenConfig(/\d/, { defaultValue: "_", additional: true }), "_", true],
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
  const tokensConfig = createTokenConfig(
    createMaskByConfig(
      createConfig("dd:dd", {
        d: /\d/,
      }),
    ),
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
