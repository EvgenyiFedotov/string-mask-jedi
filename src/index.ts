export interface MaskResult {
  value: string;
  cursor: number;
}

export type Mask = (value: string, cursor?: number) => MaskResult;

export interface Token {
  value: string;
  additional: boolean;
}

export interface State {
  remainder: string;
  tokens: Token[];
  cursor: number;
}

type GetMatch = (state: State, index: number) => RegExp;

export interface TokenConfig {
  getMatch: GetMatch;
  defaultValue: string;
  additional: boolean;
}

type Converter = (tokens: Token[], config: Config) => void;

export interface Config {
  tokens: TokenConfig[];
  converter?: Converter;
}

type CreateMaskByConfig = (config: Config) => Mask;

export const createMaskByConfig: CreateMaskByConfig = (config) => {
  const { tokens, converter = () => {} } = config;

  return (value, cursor = 0) => {
    let state = buildDefaultState(value, cursor);

    for (let index = 0; index < tokens.length; index += 1) {
      Object.freeze(state);
      Object.freeze(state.tokens);

      const nextState = buildNextState({ config: tokens[index], state, index });

      if (!nextState || nextState === state) {
        break;
      }

      state = nextState;

      if (converter) {
        Object.freeze(state);
        Object.freeze(state.tokens);

        converter(state.tokens, config);
      }
    }

    return buildMaskResult(state, config);
  };
};

type Translation = string | RegExp | GetMatch | TokenConfig;

interface Translations {
  [key: string]: Translation | Translation[];
}

type CreateTokenConfig = (
  translation: Translation,
  config?: Partial<Omit<TokenConfig, "getMatch">>,
) => TokenConfig;

export const createTokenConfig: CreateTokenConfig = (translation, config) => {
  if (translation instanceof RegExp) {
    return {
      getMatch: () => translation,
      defaultValue: "",
      additional: false,
      ...config,
    };
  } else if (translation instanceof Function) {
    return {
      getMatch: translation,
      defaultValue: "",
      additional: false,
      ...config,
    };
  } else if (typeof translation === "string") {
    const reg = new RegExp(translation.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

    return {
      getMatch: () => reg,
      defaultValue: translation,
      additional: true,
      ...config,
    };
  }

  return {
    ...config,
    ...translation,
  };
};

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
    config.tokens.push(createTokenConfig(translation));
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

type CombineConfigs = (...configs: Config[]) => Config;

export const combineConfigs: CombineConfigs = (...configs) => {
  const resultConfig: Config = {
    tokens: [],
    converter: () => {},
  };

  configs.forEach((config) => {
    resultConfig.tokens = [...resultConfig.tokens, ...config.tokens];

    if (resultConfig.converter && config.converter) {
      resultConfig.converter = combineFn(
        resultConfig.converter,
        config.converter,
      );
    }
  });

  return resultConfig;
};

type CombineFn = <A extends Array<any> = [string, number]>(
  ...fns: Function[]
) => (...args: A) => void;

const combineFn: CombineFn = (...fns) => {
  return (...args) => fns.forEach((fn) => fn(...args));
};

type CreateMask = (
  stringMask: string,
  translations?: Translations,
  options?: Partial<Omit<Config, "tokens">>,
) => Mask;

export const createMask: CreateMask = (
  stringMask,
  translations = {},
  options,
) => {
  const config = createConfig(stringMask, translations);

  return createMaskByConfig(config);
};

type BuildDefaultState = (value: string, cursor: number) => State;

const buildDefaultState: BuildDefaultState = (value, cursor) => {
  return {
    remainder: `${value.slice(0, cursor)}#cursor#${value.slice(cursor)}`,
    tokens: [],
    cursor: 0,
  };
};

interface BuildNextStateParams {
  config: TokenConfig;
  state: State;
  index: number;
}

type BuildNextState = (params: BuildNextStateParams) => State;

const buildNextState: BuildNextState = (params) => {
  const { config, state, index } = params;
  const { getMatch, defaultValue = "", additional = false } = config;

  const match = getMatch(state, index);
  const matchResult = filterCursor(state.remainder).match(match);

  if (defaultValue || matchResult) {
    let nextState = { ...state, tokens: [...state.tokens] };

    const setToken = (value: string) => {
      nextState.tokens[index] = { value, additional };
    };

    nextState = setCursorToState(nextState, index);

    if (matchResult) {
      nextState.remainder = nextState.remainder.replace(match, "");

      if (additional) {
        if (filterCursor(nextState.remainder)) {
          setToken(matchResult[0]);
        }
      } else {
        setToken(matchResult[0]);
      }
    } else if (defaultValue) {
      if (additional) {
        if (filterCursor(nextState.remainder)) {
          setToken(defaultValue);
        }
      }
    }

    return nextState;
  }

  return state;
};

type BuildMaskResult = (state: State, config: Config) => MaskResult;

const buildMaskResult: BuildMaskResult = (state, config) => {
  const nextState = { ...state, tokens: [...state.tokens] };

  // Check cursor, if one exist remove his and set cursor into nextState
  if (
    !!nextState.remainder.match(/^#cursor#/) ||
    !!nextState.remainder.match(/#cursor#$/)
  ) {
    nextState.cursor = nextState.tokens.length;
    nextState.remainder = nextState.remainder.replace(/^#cursor#/, "");
    nextState.remainder = nextState.remainder.replace(/#cursor#$/, "");
  }

  // Remove additional tokens if mask didn't complete
  if (
    nextState.tokens.length &&
    nextState.tokens.length < config.tokens.length
  ) {
    let lastToken = nextState.tokens[nextState.tokens.length - 1];

    while (lastToken && lastToken.additional) {
      if (nextState.cursor === nextState.tokens.length) {
        nextState.cursor -= 1;
      }

      nextState.tokens.splice(-1);

      lastToken = nextState.tokens[nextState.tokens.length - 1];
    }
  }

  const value = buildValue(nextState.tokens);
  const cursor = nextState.cursor;

  return { value, cursor };
};

type BuildValue = (tokens: Token[]) => string;

const buildValue: BuildValue = (tokens) => {
  return tokens.map((token) => token.value).join("");
};

type SetCursorToState = (state: State, index: number) => State;

const setCursorToState: SetCursorToState = (state, index) => {
  if (!!state.remainder.match(/^#cursor#/)) {
    return {
      ...state,
      cursor: index,
      remainder: state.remainder.replace(/^#cursor#/, ""),
    };
  }

  return state;
};

type FilterCursor = (value: string) => string;

const filterCursor: FilterCursor = (value) => {
  return value.replace(/^#cursor#/, "");
};
