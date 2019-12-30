import {
  combineConfigs,
  createConfig,
  createMaskByConfig,
  Token,
} from "../../src";
import * as configs from "../configs";

describe("combine time", () => {
  const hoursConfig = createConfig("Hh", {
    H: /[012]/,
    h: ({ tokens: [h1] }) => (h1.value.match(/([01])/) ? /(\d)/ : /([0123])/),
  });
  const separtorConfig = createConfig(":");
  const minutesConfig = createConfig("Mm", {
    M: /[012345]/,
    m: /\d/,
  });
  const timeConfig = combineConfigs(hoursConfig, separtorConfig, minutesConfig);

  test("structure", () => {
    expect(JSON.stringify(timeConfig)).toBe(
      JSON.stringify({
        tokens: [
          { getMatch: () => /[012]/, defaultValue: "", additional: false },
          {
            getMatch: ({ tokens: [h1] }) =>
              h1.value.match(/([01])/) ? /(\d)/ : /([0123])/,
            defaultValue: "",
            additional: false,
          },
          { getMatch: () => /:/, defaultValue: ":", additional: true },
          { getMatch: () => /[012345]/, defaultValue: "", additional: false },
          { getMatch: () => /\d/, defaultValue: "", additional: false },
        ],
      }),
    );
  });

  test("run mask", () => {
    const time = createMaskByConfig(timeConfig);

    expect(time.run("2345").value).toBe("23:45");
  });
});

describe("combine date with time", () => {
  const dateTimeConfig = combineConfigs(
    configs.date,
    createConfig(" "),
    configs.time,
  );

  test("structure", () => {
    expect(JSON.stringify(dateTimeConfig)).toBe(
      JSON.stringify({
        tokens: [
          // date
          { getMatch: () => /[0123]/, defaultValue: "", additional: false },
          {
            getMatch: (state) => {
              const { tokens } = state;
              const prevToken = tokens[tokens.length - 1];

              if (prevToken.value.match(/3/)) {
                return /[01]/;
              }

              if (prevToken.value.match(/0/)) {
                return /[123456789]/;
              }

              return /\d/;
            },
            defaultValue: "",
            additional: false,
          },
          { getMatch: () => /\//, defaultValue: "/", additional: true },
          { getMatch: () => /[01]/, defaultValue: "", additional: false },
          {
            getMatch: (state) => {
              const { tokens } = state;
              const prevToken = tokens[tokens.length - 1];

              if (prevToken.value.match(/1/)) {
                return /[012]/;
              }

              if (prevToken.value.match(/0/)) {
                return /[123456789]/;
              }

              return /\d/;
            },
            defaultValue: "",
            additional: false,
          },
          { getMatch: () => /\//, defaultValue: "/", additional: true },
          { getMatch: () => /\d/, defaultValue: "", additional: false },
          { getMatch: () => /\d/, defaultValue: "", additional: false },
          { getMatch: () => /\d/, defaultValue: "", additional: false },
          { getMatch: () => /\d/, defaultValue: "", additional: false },

          // separator space between masks
          { getMatch: () => / /, defaultValue: " ", additional: true },

          // time
          { getMatch: () => /[012]/, defaultValue: "", additional: false },
          {
            getMatch: ({ tokens: [h1] }) =>
              h1.value.match(/([01])/) ? /(\d)/ : /([0123])/,
            defaultValue: "",
            additional: false,
          },
          { getMatch: () => /:/, defaultValue: ":", additional: true },
          { getMatch: () => /[012345]/, defaultValue: "", additional: false },
          { getMatch: () => /\d/, defaultValue: "", additional: false },
        ],
      }),
    );
  });

  test("run mask", () => {
    const dateTime = createMaskByConfig(dateTimeConfig);

    expect(dateTime.run("010120200355").value).toBe("01/01/2020 03:55");
  });
});
