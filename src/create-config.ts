import { GetMatch, Token, Mask, isMask } from "./create-mask";
import { combineFn } from "./helpers";

export interface TokenConfig {
  getMatch: GetMatch;
  defaultValue: string;
  additional: boolean;
}

export type Converter = (tokens: Token[], config: Config) => void;

export interface Config {
  tokens: TokenConfig[];
  converter?: Converter;
}

export const isConfig = (x: any): x is Config => {
  return x.tokens instanceof Array;
};

type Translation = string | RegExp | GetMatch | TokenConfig | Mask;

type ParseTranlation = (
  translation: Translation,
  config?: Partial<Omit<TokenConfig, "getMatch">>,
) => TokenConfig[];

export const parseTranlation: ParseTranlation = (translation, config) => {
  if (translation instanceof RegExp) {
    return [
      {
        getMatch: () => translation,
        defaultValue: "",
        additional: false,
        ...config,
      },
    ];
  } else if (translation instanceof Function) {
    return [
      {
        getMatch: translation,
        defaultValue: "",
        additional: false,
        ...config,
      },
    ];
  } else if (typeof translation === "string") {
    const reg = new RegExp(translation.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

    return [
      {
        getMatch: () => reg,
        defaultValue: translation,
        additional: true,
        ...config,
      },
    ];
  } else if (isMask(translation)) {
    return [...translation.config.tokens];
  }

  return [
    {
      ...config,
      ...translation,
    },
  ];
};

export interface Translations {
  [key: string]: Translation | Translation[];
}

type CreateConfig = (
  stringMask: string,
  translations?: Translations,
  options?: Partial<Omit<Config, "tokens">>,
) => Config;

export const createConfig: CreateConfig = (
  value,
  translations = {},
  options,
) => {
  const config: Config = {
    tokens: [],
    ...options,
  };
  const tokens = value.split("");

  const addTranslation = (translation: Translation) => {
    const converter = isMask(translation) && translation.config.converter;

    config.tokens = [...config.tokens, ...parseTranlation(translation)];

    if (config.converter && converter) {
      config.converter = combineFn(config.converter, converter);
    } else if (!config.converter && converter) {
      config.converter = converter;
    }
  };

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const translation = translations[token];

    if (translation) {
      if (translation instanceof Array) {
        translation.forEach((subTranslation) => {
          addTranslation(subTranslation);
        });
      } else {
        addTranslation(translation);
      }
    } else {
      addTranslation(token);
    }
  }

  return config;
};
