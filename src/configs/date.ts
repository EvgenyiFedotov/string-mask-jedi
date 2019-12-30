import { Token, State, Config, createConfig } from "../";

const numToStr = (value: number): string => {
  return value < 10 ? `0${value}` : `${value}`;
};

const tokensToValue = (tokens: Token[]) => {
  return tokens.map((token) => token.value).join("");
};

const date1 = (state: State) => {
  const { tokens } = state;
  const prevToken = tokens[tokens.length - 1];

  if (prevToken.value.match(/3/)) {
    return /[01]/;
  }

  if (prevToken.value.match(/0/)) {
    return /[123456789]/;
  }

  return /\d/;
};

const month1 = (state: State) => {
  const { tokens } = state;
  const prevToken = tokens[tokens.length - 1];

  if (prevToken.value.match(/1/)) {
    return /[012]/;
  }

  if (prevToken.value.match(/0/)) {
    return /[123456789]/;
  }

  return /\d/;
};

const converter = (tokens: Token[], config: Config) => {
  if (tokens.length === config.tokens.length) {
    const day = tokensToValue([tokens[0], tokens[1]]);
    const month = tokensToValue([tokens[3], tokens[4]]);
    const year = tokensToValue([tokens[6], tokens[7], tokens[8], tokens[9]]);
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
};

export const config = createConfig(
  "d/m/y",
  {
    d: [/[0123]/, date1],
    m: [/[01]/, month1],
    y: [/\d/, /\d/, /\d/, /\d/],
  },
  { converter },
);
