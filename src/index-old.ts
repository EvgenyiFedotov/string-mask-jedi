interface ValueElement {
  value: string;
  additional?: boolean;
}

interface State {
  remainder: string;
  valueElements: ValueElement[];
  cursor: number;
}

interface ConfigElementParams {
  state: State;
  index: number;
}

type ConfigElement = (params: ConfigElementParams) => State;

interface CreateMatchOptions {
  defaultValue?: string;
  additional?: boolean;
}

type GetMatch = (params: ConfigElementParams) => RegExp;

type SimpleTranslation = RegExp | GetMatch | ConfigElement;

interface Translations {
  [name: string]: SimpleTranslation | SimpleTranslation[];
}

const isGetMatch = (x: any): x is GetMatch => {
  return (
    x instanceof Function &&
    x({
      state: { remainder: "", valueElements: [], cursor: 0 },
      index: 0,
    }) instanceof RegExp
  );
};

export interface MaskResult {
  value: string;
  valueElements: ValueElement[];
  cursor: number;
  remainder: string;
  completed: boolean;
}

export type Mask = (value: string, cursor?: number) => MaskResult;

const addCursorToValue = (value: string, cursor: number): string => {
  const before = value.slice(0, cursor);
  const after = value.slice(cursor);

  return `${before}#cursor#${after}`;
};

const filterCursor = (value: string): string => {
  return value.replace(/^#cursor#/, "");
};

const buildValue = (valueElements: ValueElement[]): string => {
  return valueElements.map((valueElement) => valueElement.value).join("");
};

const removeAddititonalElementsInEnd = (maskResult: MaskResult): MaskResult => {
  if (maskResult.valueElements.length) {
    const nextState = { ...maskResult };
    let lastNextValueEl =
      nextState.valueElements[nextState.valueElements.length - 1];

    while (lastNextValueEl && lastNextValueEl.additional) {
      if (nextState.cursor === nextState.valueElements.length) {
        nextState.cursor -= 1;
      }
      nextState.valueElements.splice(-1);
      lastNextValueEl =
        nextState.valueElements[nextState.valueElements.length - 1];
    }

    return { ...nextState, value: buildValue(nextState.valueElements) };
  }

  return maskResult;
};

const setCursor = (state: State, index: number): State => {
  const nextState = { ...state };

  if (!!nextState.remainder.match(/^#cursor#/)) {
    nextState.cursor = index;
    nextState.remainder = nextState.remainder.replace(/^#cursor#/, "");
  }

  return nextState;
};

const buildState = (value: string, cursor: number = 0): State => {
  return {
    remainder: addCursorToValue(value, cursor),
    valueElements: [],
    cursor: 0,
  };
};

const removeCursor = (state: State): State => {
  const nextState = { ...state };

  if (
    !!nextState.remainder.match(/^#cursor#/) ||
    !!nextState.remainder.match(/#cursor#$/)
  ) {
    nextState.cursor = nextState.valueElements.length;
    nextState.remainder = nextState.remainder.replace(/^#cursor#/, "");
    nextState.remainder = nextState.remainder.replace(/#cursor#$/, "");
  }

  return nextState;
};

const buildMaskResult = (state: State, config: ConfigElement[]): MaskResult => {
  return {
    value: buildValue(state.valueElements),
    valueElements: state.valueElements,
    cursor: state.cursor,
    remainder: state.remainder,
    completed: state.valueElements.length === config.length,
  };
};

export const createMaskByConfig = (config: ConfigElement[]): Mask => {
  let state: State = buildState("");

  return (value: string, cursor: number = 0): MaskResult => {
    state = buildState(value, cursor);

    for (let index = 0; index < config.length; index += 1) {
      const nextState = config[index]({ state, index });

      if (!nextState || nextState === state) {
        break;
      }

      state = nextState;
    }

    state = removeCursor(state);

    let result = buildMaskResult(state, config);

    if (state.valueElements.length < config.length) {
      result = removeAddititonalElementsInEnd(result);
    }

    return result;
  };
};

export const createMatch = (
  getMatch: GetMatch,
  options: CreateMatchOptions = {},
): ConfigElement => ({ state, index }): State => {
  const { defaultValue, additional = false } = options;
  const match = getMatch({ state, index });
  const matchResult = state.remainder.match(match);

  if (matchResult) {
    const nextState = setCursor(state, index);

    nextState.remainder = nextState.remainder.replace(match, "");

    if (additional) {
      if (filterCursor(nextState.remainder)) {
        nextState.valueElements[index] = { value: matchResult[0], additional };
      }
    } else {
      nextState.valueElements[index] = { value: matchResult[0], additional };
    }

    return nextState;
  } else if (defaultValue) {
    const nextState = setCursor(state, index);

    if (additional) {
      if (filterCursor(nextState.remainder)) {
        nextState.valueElements[index] = { value: defaultValue, additional };
      }
    }

    return nextState;
  }

  return state;
};

export const createMatchStatic = (value: string): ConfigElement => {
  return createMatch(
    () => new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    { defaultValue: value, additional: true },
  );
};

export const createConfig = (
  value: string,
  translations: Translations = {},
): ConfigElement[] => {
  let config: ConfigElement[] = [];
  const arrValue = value.split("");
  const pushTranslation = (translation: SimpleTranslation) => {
    if (translation instanceof RegExp) {
      config.push(createMatch(() => translation));
    } else if (isGetMatch(translation)) {
      config.push(createMatch(translation));
    } else {
      config.push(translation);
    }
  };

  for (let index = 0; index < arrValue.length; index += 1) {
    const element = arrValue[index];
    const translation = translations[element];

    if (translation) {
      if (translation instanceof Array) {
        translation.forEach(pushTranslation);
      } else {
        pushTranslation(translation);
      }
    } else {
      config.push(createMatchStatic(element));
    }
  }

  return config;
};

export const createMask = (value: string, translations: Translations = {}) => {
  return createMaskByConfig(createConfig(value, translations));
};
