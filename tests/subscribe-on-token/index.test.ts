import {
  createConfig,
  createMaskByConfig,
  createTokenConfig,
  Token,
} from "../../src";

const valueListeningToken = (
  cb: (value: string, token: Token) => string | void = () => {},
) => (token: Token, listeningTokens: Token[]): string | void => {
  const tokens = listeningTokens.filter(Boolean);

  if (tokens.length === 2) {
    return cb(tokens.map((token) => token.value).join(""), token);
  }
};

const dateConfig = createConfig("d/m/y", {
  d: [
    createTokenConfig(/^[0123]/, {
      id: "day-1",
      subscribeTo: ["month-1", "month-2"],
      onChange: valueListeningToken((value, token) => {
        if (value === "02" && token.value === "3") {
          return "2";
        }
      }),
    }),
    createTokenConfig(/\d/, {
      id: "day-2",
      subscribeTo: ["month-1", "month-2"],
      onChange: valueListeningToken((value, token) => {
        if (value === "02" && parseInt(token.value, 10) > 8) {
          return "8";
        }
      }),
    }),
  ],
  m: [
    createTokenConfig(/^[01]/, {
      id: "month-1",
    }),
    createTokenConfig(
      (state) => {
        const { tokens } = state;
        const prevToken = tokens[tokens.length - 1];

        return prevToken.value.match(/1/) ? /^[012]/ : /\d/;
      },
      {
        id: "month-2",
      },
    ),
  ],
  y: [/\d/, /\d/, /\d/, /\d/],
});

const date = createMaskByConfig(dateConfig);

test("init", () => {
  const r = date("31022020");
  console.log(r);
});
