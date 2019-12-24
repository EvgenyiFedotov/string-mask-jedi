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
  currState: State;
  index: number;
}

type ConfigElement = (params: ConfigElementParams) => State | void;

interface UseMatchOptions {
  defaultValue?: string;
  additional?: boolean;
}

type GetMatch = (params: { state: State; index: number }) => RegExp;

interface Translations {
  [name: string]: ConfigElement | ConfigElement[];
}

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

export const createMask = (config: ConfigElement[]): Mask => {
  let currState: State = buildState("");

  return (value: string, cursor: number = 0): MaskResult => {
    currState = buildState(value, cursor);

    for (let index = 0; index < config.length; index += 1) {
      const nextState = config[index]({ currState, index });

      if (!nextState || nextState === currState) break;
      currState = nextState;
    }

    currState = removeCursor(currState);

    let result = buildMaskResult(currState, config);

    if (currState.valueElements.length < config.length) {
      result = removeAddititonalElementsInEnd(result);
    }

    return result;
  };
};

export const useMatch = (
  getMatch: GetMatch,
  options: UseMatchOptions = {},
): ConfigElement => ({ currState, index }): State => {
  const { defaultValue, additional = false } = options;
  const match = getMatch({ state: currState, index });
  const matchResult = currState.remainder.match(match);

  if (matchResult) {
    const nextState = setCursor(currState, index);

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
    const nextState = setCursor(currState, index);

    if (additional) {
      if (filterCursor(nextState.remainder)) {
        nextState.valueElements[index] = { value: defaultValue, additional };
      }
    }

    return nextState;
  }

  return currState;
};

export const useMatchStatic = (value: string): ConfigElement => {
  return useMatch(
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

  for (let index = 0; index < arrValue.length; index += 1) {
    const element = arrValue[index];
    const translation = translations[element];

    if (translation) {
      if (translation instanceof Array) {
        config = [...config, ...translation];
      } else {
        config.push(translation);
      }
    } else {
      config.push(useMatchStatic(element));
    }
  }

  return config;
};
