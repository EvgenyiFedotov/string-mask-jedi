import { GetMatch, Token, Mask, isMask } from "./create-mask";

export interface TokenConfig {
  getMatch: GetMatch;
  defaultValue: string;
  additional: boolean;
}

export type Converter = (tokens: Token[], configTokens: TokenConfig[]) => void;

export interface Config {
  tokens: TokenConfig[];
  converters: Converter[];
}

export const isConfig = (x: any): x is Config => {
  return x.tokens instanceof Array && x.converters instanceof Array;
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
    converters: [],
    ...options,
  };
  const tokens = value.split("");

  const addTranslation = (translation: Translation) => {
    const parseTranlationResult = parseTranlation(translation);

    if (isMask(translation)) {
      const left = config.tokens.length;
      const right = left + parseTranlationResult.length;
      const translationConverters = translation.config.converters.map(
        (converter) => (tokens: Token[], configTokens: TokenConfig[]) => {
          return converter(
            tokens.slice(left, right),
            configTokens.slice(left, right),
          );
        },
      );

      config.converters = [...config.converters, ...translationConverters];
    }

    config.tokens = [...config.tokens, ...parseTranlationResult];
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
