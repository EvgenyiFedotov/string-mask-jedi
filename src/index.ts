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

interface TokenConfig {
  getMatch: GetMatch;
  defaultValue: string;
  additional: boolean;
  id: string;
  subscribeTo: string[];
  onChange?: (token: Token, listeningTokens: Token[]) => string | void;
}

type CreateMaskByConfig = (config: TokenConfig[]) => Mask;

export const createMaskByConfig: CreateMaskByConfig = (config) => {
  const tokensListeners = buildTokensListeners(config);

  return (value, cursor = 0) => {
    let state = buildDefaultState(value, cursor);

    for (let index = 0; index < config.length; index += 1) {
      const nextState = buildNextState({ config: config[index], state, index });

      if (!nextState || nextState === state) {
        break;
      }

      state = nextState;
      state = runTokenListeners(config, tokensListeners, state, index);
    }

    return buildMaskResult(state, config);
  };
};

type RunTokenListeners = (
  config: TokenConfig[],
  tokensListeners: TokenListeners[],
  state: State,
  index: number,
) => State;

const runTokenListeners: RunTokenListeners = (
  config,
  tokensListeners,
  state,
  index,
) => {
  const tokenListeners = tokensListeners[index];

  if (tokenListeners) {
    const nextState = { ...state, tokens: [...state.tokens] };

    tokenListeners.forEach(([tokenListenerIndex, indexTokens]) => {
      const { onChange = () => {} } = config[tokenListenerIndex];
      const tokenListener = nextState.tokens[tokenListenerIndex];

      const onChangeResult = onChange(
        tokenListener,
        indexTokens.map((index) => state.tokens[index] || null),
      );

      if (typeof onChangeResult === "string") {
        tokenListener.value = onChangeResult;
      }
    });
  }

  return state;
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
  config?: Partial<Omit<TokenConfig, "getMatch">> & Pick<TokenConfig, "id">,
) => TokenConfig;

export const createTokenConfig: CreateTokenConfig = (translation, config) => {
  if (translation instanceof RegExp) {
    return {
      getMatch: () => translation,
      additional: false,
      defaultValue: "",
      id: config ? config.id : "",
      subscribeTo: [],
      ...config,
    };
  } else if (translation instanceof Function) {
    return {
      getMatch: translation,
      additional: false,
      defaultValue: "",
      id: config ? config.id : "",
      subscribeTo: [],
      ...config,
    };
  } else if (typeof translation === "string") {
    const reg = new RegExp(translation.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

    return {
      getMatch: () => reg,
      defaultValue: translation,
      additional: true,
      id: config ? config.id : "",
      subscribeTo: [],
      ...config,
    };
  }

  return {
    ...config,
    ...translation,
  };
};

export const createConfig: CreateConfig = (value, translations = {}) => {
  const config: TokenConfig[] = [];
  const tokens = value.split("");

  const addTranslation = (translation: Translation, index: number) => {
    config.push(createTokenConfig(translation, { id: `token-${index}` }));
  };

  let tokenIndex = 0;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const translation = translations[token];

    if (translation) {
      if (translation instanceof Array) {
        translation.forEach((subTranslation) => {
          addTranslation(subTranslation, tokenIndex);
          tokenIndex += 1;
        });
      } else {
        addTranslation(translation, tokenIndex);
        tokenIndex += 1;
      }
    } else {
      addTranslation(token, tokenIndex);
      tokenIndex += 1;
    }
  }

  return config;
};

type CreateMask = (stringMask: string, translations?: Translations) => Mask;

export const createMask: CreateMask = (stringMask, translations = {}) => {
  const config = createConfig(stringMask, translations);

  return createMaskByConfig(config);
};

type TokenListener = [number, number[]];

type TokenListeners = TokenListener[];

type BuildTokensListeners = (config: TokenConfig[]) => TokenListeners[];

const buildTokensListeners: BuildTokensListeners = (config) => {
  const indexTokens = buildIndexTokens(config);

  return config.reduce<TokenListeners[]>((memo, tokenConfig, index) => {
    const { subscribeTo = [] } = tokenConfig;

    subscribeTo.forEach((tokenConfigId) => {
      const tokenConfigIndex = indexTokens[tokenConfigId];

      if (!memo[tokenConfigIndex]) {
        memo[tokenConfigIndex] = [];
      }

      const indexSubscribes = subscribeTo.map((id) => indexTokens[id]);
      memo[tokenConfigIndex].push([index, indexSubscribes]);
    });

    return memo;
  }, []);
};

interface IndexTokens {
  [tokenConfigId: string]: number;
}

type BuildIndexTokens = (config: TokenConfig[]) => IndexTokens;

const buildIndexTokens: BuildIndexTokens = (config) => {
  return config.reduce<IndexTokens>((memo, tokenConfig, index) => {
    const { id } = tokenConfig;

    if (id && memo[id] === undefined) {
      memo[id] = index;
    }

    return memo;
  }, {});
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
