import {
  combineConfigs,
  createConfig,
  createMaskByConfig,
  Token,
} from "../../src";

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

    expect(time("2345").value).toBe("23:45");
  });
});

describe("combine date with time", () => {
  const numToStr = (value: number): string => {
    return value < 10 ? `0${value}` : `${value}`;
  };
  const tokensToValue = (tokens: Token[]) => {
    return tokens.map((token) => token.value).join("");
  };

  const time = createConfig("h:m", {
    h: [
      /[012]/,
      ({ tokens: [h1] }) => (h1.value.match(/([01])/) ? /(\d)/ : /([0123])/),
    ],
    m: [/[012345]/, /\d/],
  });
  const date = createConfig(
    "d/m/y",
    {
      d: [
        /[0123]/,
        (state) => {
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
      ],
      m: [
        /[01]/,
        (state) => {
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
      ],
      y: [/\d/, /\d/, /\d/, /\d/],
    },
    {
      converter: (tokens, config) => {
        if (tokens.length === config.tokens.length) {
          const day = tokensToValue([tokens[0], tokens[1]]);
          const month = tokensToValue([tokens[3], tokens[4]]);
          const year = tokensToValue([
            tokens[6],
            tokens[7],
            tokens[8],
            tokens[9],
          ]);
          const date = new Date(`${year}-${month}-${day}`);
          const dayArr = numToStr(date.getDate()).split("");
          const monthArr = numToStr(date.getMonth() + 1).split("");
          const yearArr = numToStr(date.getFullYear()).split("");

          tokens[0].value = dayArr[0];
          tokens[1].value = dayArr[1];
          tokens[3].value = monthArr[0];
          tokens[4].value = monthArr[1];
          tokens[6].value = yearArr[0];
          tokens[7].value = yearArr[1];
          tokens[8].value = yearArr[2];
          tokens[9].value = yearArr[3];
        }
      },
    },
  );
  const dateTimeConfig = combineConfigs(date, createConfig(" "), time);

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

    expect(dateTime("010120200355").value).toBe("01/01/2020 03:55");
  });
});
