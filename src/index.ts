interface StateValue {
  value: string;
  additional?: boolean;
}

interface State {
  currValue: string;
  nextValue: StateValue[];
  nextCursor: number;
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

interface Translations {
  [name: string]: {
    getMatch: (state: State, index: number) => RegExp;
    defaultValue?: string;
    additional?: boolean;
  };
}

interface MaskResult {
  nextValue: string;
  nextCursor: number;
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

const removeAddititonalElementsInEnd = (state: State): State => {
  if (state.nextValue.length) {
    const nextState = { ...state };
    let lastNextValueEl = nextState.nextValue[nextState.nextValue.length - 1];

    while (lastNextValueEl && lastNextValueEl.additional) {
      if (nextState.nextCursor === nextState.nextValue.length) {
        nextState.nextCursor -= 1;
      }
      nextState.nextValue.splice(-1);
      lastNextValueEl = nextState.nextValue[nextState.nextValue.length - 1];
    }

    return nextState;
  }

  return state;
};

const removeCursor = (state: State, index: number): State => {
  const nextState = { ...state };

  if (!!nextState.currValue.match(/^#cursor#/)) {
    nextState.nextCursor = index;
    nextState.currValue = nextState.currValue.replace(/^#cursor#/, "");
  }

  return nextState;
};

const buildState = (value: string, cursor: number = 0): State => {
  return {
    currValue: addCursorToValue(value, cursor),
    nextValue: [],
    nextCursor: 0,
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

    if (
      !!currState.currValue.match(/^#cursor#/) ||
      !!currState.currValue.match(/#cursor#$/)
    ) {
      currState.nextCursor = currState.nextValue.length;
    }

    currState = removeAddititonalElementsInEnd(currState);

    return {
      nextCursor: currState.nextCursor,
      nextValue: currState.nextValue
        .map((valueElement) => valueElement.value)
        .join(""),
    };
  };
};

export const useMatch = (
  getMatch: (state: State, index: number) => RegExp,
  options: UseMatchOptions = {},
): ConfigElement => ({ currState, index }) => {
  const { defaultValue, additional = false } = options;
  const match = getMatch(currState, index);
  const matchResult = currState.currValue.match(match);

  if (matchResult) {
    const nextState = removeCursor(currState, index);

    nextState.currValue = nextState.currValue.replace(match, "");

    if (additional) {
      if (filterCursor(nextState.currValue)) {
        nextState.nextValue[index] = { value: matchResult[0], additional };
      }
    } else {
      nextState.nextValue[index] = { value: matchResult[0], additional };
    }

    return nextState;
  } else if (defaultValue) {
    const nextState = removeCursor(currState, index);

    if (additional) {
      if (filterCursor(nextState.currValue)) {
        nextState.nextValue[index] = { value: defaultValue, additional };
      }
    }

    return nextState;
  }

  return currState;
};

export const createConfig = (
  value: string,
  translations: Translations = {},
): ConfigElement[] => {
  const config: ConfigElement[] = [];
  const arrValue = value.split("");

  for (let index = 0; index < arrValue.length; index += 1) {
    const element = arrValue[index];
    const translationsElement = translations[element];

    if (translationsElement) {
      config.push(
        useMatch(translationsElement.getMatch, {
          defaultValue: translationsElement.defaultValue,
          additional: translationsElement.additional,
        }),
      );
    } else {
      config.push(
        useMatch(
          () => new RegExp(element.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
          { defaultValue: element, additional: true },
        ),
      );
    }
  }

  return config;
};
