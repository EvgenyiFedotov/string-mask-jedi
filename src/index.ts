export interface MaskResult {
  value: string;
  cursor: number;
}

export type Mask = (value: string, cursor?: number) => MaskResult;

interface Token {
  value: string;
  additional: boolean;
}

interface State {
  remainder: string;
  tokens: Token[];
  cursor: number;
}

type GetMatch = (state: State, index: number) => RegExp;

interface TokenConfig {
  getMatch: GetMatch;
  defaultValue: string;
  additional: boolean;
}

type CreateMaskByConfig = (config: TokenConfig[]) => Mask;

export const createMaskByConfig: CreateMaskByConfig = (config) => {
  return (value, cursor = 0) => {
    let state = buildDefaultState(value, cursor);

    for (let index = 0; index < config.length; index += 1) {
      const nextState = buildNextState({ config: config[index], state, index });

      if (!nextState || nextState === state) {
        break;
      }

      state = nextState;
    }

    return buildMaskResult(state, config);
  };
};

type Translation = string | RegExp | GetMatch | TokenConfig;

interface Translations {
  [key: string]: Translation | Translation[];
}

type CreateConfig = (
  stringMask: string,
  translations?: Translations,
) => TokenConfig[];

type CreateTokenConfig = (
  translation: Translation,
  config?: Omit<TokenConfig, "getMatch">,
) => TokenConfig;

export const createTokenConfig: CreateTokenConfig = (translation, config) => {
  if (translation instanceof RegExp) {
    return {
      getMatch: () => translation,
      additional: false,
      defaultValue: "",
      ...config,
    };
  } else if (translation instanceof Function) {
    return {
      getMatch: translation,
      additional: false,
      defaultValue: "",
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

  return translation;
};

export const createConfig: CreateConfig = (value, translations = {}) => {
  const config: TokenConfig[] = [];
  const tokens = value.split("");

  const addTranslation = (translation: Translation) => {
    config.push(createTokenConfig(translation));
  };

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const translation = translations[token];

    if (translation) {
      if (translation instanceof Array) {
        translation.forEach(addTranslation);
      } else {
        addTranslation(translation);
      }
    } else {
      addTranslation(token);
    }
  }

  return config;
};

type CreateMask = (stringMask: string, translations?: Translations) => Mask;

export const createMask: CreateMask = (stringMask, translations = {}) => {
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

const buildNextState: BuildNextState = ({ config, state, index }) => {
  const { getMatch, defaultValue, additional = false } = config;

  const match = getMatch(state, index);
  const matchResult = state.remainder.match(match);

  if (defaultValue || matchResult) {
    let nextState = { ...state };

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

type BuildMaskResult = (state: State, config: TokenConfig[]) => MaskResult;

const buildMaskResult: BuildMaskResult = (state, config) => {
  const nextState = { ...state };

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
  if (nextState.tokens.length && nextState.tokens.length < config.length) {
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
