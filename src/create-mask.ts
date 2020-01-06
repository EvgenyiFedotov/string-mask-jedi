import {
  Config,
  isConfig,
  TokenConfig,
  Translations,
  createConfig,
} from "./create-config";

export interface MaskResult {
  value: string;
  cursor: number;
}

export type GetMatch = (state: State, index: number) => RegExp;

type MaskRun = (value: string, cursor?: number) => MaskResult;

export interface Mask {
  run: MaskRun;
  config: Config;
}

export const isMask = (x: any): x is Mask => {
  return x.run instanceof Function && isConfig(x.config);
};

export interface Token {
  value: string;
  additional: boolean;
}

export interface State {
  remainder: string;
  tokens: Token[];
  cursor: number;
}

type CreateMask = (
  stringMask: string,
  translations?: Translations,
  options?: Partial<Omit<Config, "tokens">>,
) => Mask;

export const createMask: CreateMask = (
  stringMask,
  translations = {},
  options = {},
) => {
  const config = createConfig(stringMask, translations, options);

  const run: MaskRun = (value, cursor = 0) => {
    let state = buildDefaultState(value, cursor);

    for (let index = 0; index < config.tokens.length; index += 1) {
      Object.freeze(state);
      Object.freeze(state.tokens);

      const nextState = buildNextState({
        config: config.tokens[index],
        state,
        index,
      });

      if (!nextState || nextState === state) {
        break;
      }

      state = nextState;

      if (config.converters.length) {
        Object.freeze(state);
        Object.freeze(state.tokens);

        config.converters.forEach((converter) => {
          converter(state.tokens, config.tokens);
        });
      }
    }

    return buildMaskResult(state, config);
  };

  return { run, config };
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
