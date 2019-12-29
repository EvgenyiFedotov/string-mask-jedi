import { createConfig } from "../../src";

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
