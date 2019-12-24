interface StateValue {
  value: string;
  additional?: boolean;
}

interface State {
  value: string;
  currValue: string;
  nextValue: StateValue[];
  cursor: number;
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

export type Mask = (value: string, cursor?: number) => ReturnState;

const setCursorToValue = (value: string, cursor: number): string => {
  const before = value.slice(0, cursor);
  const after = value.slice(cursor);

  return `${before}#cursor#${after}`;
};

const filterCursor = (value: string): string => {
  return value.replace(/^#cursor#/, "");
};

const removeAddititonalInEnd = (state: State): State => {
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

interface ReturnState {
  nextValue: string;
  nextCursor: number;
}

export const createMask = (config: ConfigElement[]): Mask => {
  let currState: State = {
    value: "",
    cursor: 0,
    currValue: "",
    nextValue: [],
    nextCursor: 0,
  };

  return (value: string, cursor: number = 0): ReturnState => {
    currState = {
      value,
      cursor,
      currValue: setCursorToValue(value, cursor),
      nextValue: [],
      nextCursor: 0,
    };

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

    currState = removeAddititonalInEnd(currState);

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
    const nextState = { ...currState };

    if (!!currState.currValue.match(/^#cursor#/)) {
      nextState.nextCursor = index;
      nextState.currValue = nextState.currValue.replace(/^#cursor#/, "");
    }

    nextState.currValue = nextState.currValue.replace(match, "");

    if (additional) {
      if (filterCursor(nextState.currValue)) {
        nextState.nextValue[index] = { value: "", additional };
        nextState.nextValue[index].value = matchResult[0];
      }
    } else {
      nextState.nextValue[index] = { value: "", additional };
      nextState.nextValue[index].value = matchResult[0];
    }

    return nextState;
  } else if (defaultValue) {
    const nextState = { ...currState };

    if (!!currState.currValue.match(/^#cursor#/)) {
      nextState.nextCursor = index;
      nextState.currValue = nextState.currValue.replace(/^#cursor#/, "");
    }

    if (additional) {
      if (filterCursor(nextState.currValue)) {
        nextState.nextValue[index] = { value: "", additional };
        nextState.nextValue[index].value = defaultValue;
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
