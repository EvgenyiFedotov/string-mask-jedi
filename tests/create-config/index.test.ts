import { createConfig, createMaskByConfig } from "../../src";

test("without paraments", () => {
  const config = createConfig("");

  expect(config).toEqual({ tokens: [] });
});

test("with translations", () => {
  const config = createConfig("+d (d-dd)", {
    d: /\d/,
  });

  expect(JSON.stringify(config)).toBe(
    JSON.stringify({
      tokens: [
        { getMatch: () => /\+/, defaultValue: "+", additional: true },
        { getMatch: () => /\d/, defaultValue: "", additional: false },
        { getMatch: () => / /, defaultValue: " ", additional: true },
        { getMatch: () => /\(/, defaultValue: "(", additional: true },
        { getMatch: () => /\d/, defaultValue: "", additional: false },
        { getMatch: () => /-/, defaultValue: "-", additional: true },
        { getMatch: () => /\d/, defaultValue: "", additional: false },
        { getMatch: () => /\d/, defaultValue: "", additional: false },
        { getMatch: () => /\)/, defaultValue: ")", additional: true },
      ],
    }),
  );
});

test("with converter", () => {
  const converter = () => {};
  const config = createConfig("+d", { d: /\d/ }, { converter });

  expect(JSON.stringify(config)).toBe(
    JSON.stringify({
      tokens: [
        { getMatch: () => /\+/, defaultValue: "+", additional: true },
        { getMatch: () => /\d/, defaultValue: "", additional: false },
      ],
      converter,
    }),
  );
});

test("combine masks", () => {
  const dateTime = createConfig("d t", {
    d: createMaskByConfig(
      createConfig("dd/dd/dddd", {
        d: /\d/,
      }),
    ),
    t: createMaskByConfig(
      createConfig("dd:dd", {
        d: /\d/,
      }),
    ),
  });

  expect(JSON.stringify(dateTime)).toBe(
    JSON.stringify({
      tokens: [
        // date
        { getMatch: () => /\d/, defaultValue: "", additional: false },
        { getMatch: () => /\d/, defaultValue: "", additional: false },
        { getMatch: () => /\//, defaultValue: "/", additional: true },
        { getMatch: () => /\d/, defaultValue: "", additional: false },
        { getMatch: () => /\d/, defaultValue: "", additional: false },
        { getMatch: () => /\//, defaultValue: "/", additional: true },
        { getMatch: () => /\d/, defaultValue: "", additional: false },
        { getMatch: () => /\d/, defaultValue: "", additional: false },
        { getMatch: () => /\d/, defaultValue: "", additional: false },
        { getMatch: () => /\d/, defaultValue: "", additional: false },

        { getMatch: () => / /, defaultValue: " ", additional: true },

        // time
        { getMatch: () => /\d/, defaultValue: "", additional: false },
        { getMatch: () => /\d/, defaultValue: "", additional: false },
        { getMatch: () => /:/, defaultValue: ":", additional: true },
        { getMatch: () => /\d/, defaultValue: "", additional: false },
        { getMatch: () => /\d/, defaultValue: "", additional: false },
      ],
    }),
  );
});
