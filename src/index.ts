interface State {
  value: string;
  currValue: string;
  nextValue: string[];
  cursor: number;
  nextCursor: number;
}

type ConfigElement = (
  state: State,
  prevState: State,
  index: number,
) => State | void;

interface UseMatchOptions {
  replace?: string;
  defaultValue?: string;
  additional?: true;
}

const createEmptyValue = (config: ConfigElement[]) => config.map(() => "");

export const createMask = (...config: ConfigElement[]) => {
  let currState: State = {
    value: "",
    cursor: 0,
    currValue: "",
    nextValue: createEmptyValue(config),
    nextCursor: 0,
  };
  let prevState: State = { ...currState };

  return (value: string, cursor: number = 0) => {
    currState = {
      value,
      cursor,
      currValue: value,
      nextValue: createEmptyValue(config),
      nextCursor: 0,
    };

    for (let index = 0; index < config.length; index += 1) {
      const nextState = config[index](currState, prevState, index);

      if (!nextState || nextState === currState) break;
      currState = nextState;
    }

    prevState = { ...currState };

    return { ...currState, nextValue: currState.nextValue.join("") };
  };
};

export const useMatch = (
  getMatch: (state: State, prevState: State) => RegExp,
  options: UseMatchOptions = {},
): ConfigElement => (state, prevState, index) => {
  const { replace = "", defaultValue, additional } = options;
  const match = getMatch(state, prevState);
  const matchResult = state.currValue.match(match);

  if (matchResult) {
    const nextState = { ...state };

    nextState.currValue = nextState.currValue.replace(match, replace);

    if (additional) {
      if (nextState.currValue) {
        nextState.nextValue[index] = matchResult[0];

        if (state.cursor - 1 === index) {
          nextState.nextCursor = state.cursor + 1;
        } else if (state.cursor > index) {
          nextState.nextCursor = state.cursor;
          nextState.cursor += 1; // TODO use another name
        }
      } else {
        if (state.cursor - 1 === index) {
          nextState.nextCursor = state.cursor - 1;
        }
      }
    } else {
      nextState.nextValue[index] = matchResult[0];

      if (state.cursor - 1 === index) {
        nextState.nextCursor = state.cursor;
      }
    }

    return nextState;
  } else if (defaultValue) {
    const nextState = { ...state };

    if (additional) {
      if (nextState.currValue) {
        nextState.nextValue[index] = defaultValue;

        if (state.cursor - 1 === index) {
          nextState.nextCursor = state.cursor + 1;
        } else if (state.cursor > index) {
          nextState.nextCursor = state.cursor + 1;
          nextState.cursor += 1; // TODO use another name
        }
      }
    }

    return nextState;
  }

  return state;
};
