interface State {
  value: string;
  currValue: string;
  nextValue: string[];
}

type ConfigElement = (state: State, index: number) => State | void;

export const createMask = (...config: ConfigElement[]) => {
  let currState: State = { value: "", currValue: "", nextValue: [] };

  return (value: string) => {
    currState = { value, currValue: value, nextValue: [] };

    for (let index = 0; index < config.length; index += 1) {
      const nextState = config[index](currState, index);

      if (!nextState || nextState === currState) break;
      currState = nextState;
    }

    return { ...currState, nextValue: currState.nextValue.join("") };
  };
};

interface UseMatchOptions {
  replace?: string;
  defValue?: string;
}

export const useMatch = (
  getMatch: (state: State) => RegExp | string,
  options: UseMatchOptions = {},
): ConfigElement => (state) => {
  const { replace = "", defValue } = options;
  const match = getMatch(state);
  let reg: RegExp;

  if (typeof match === "string") {
    reg = new RegExp(match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  } else {
    reg = match;
  }

  const matchResult = state.currValue.match(reg);

  if (matchResult) {
    const nextState = { ...state };

    nextState.nextValue.push(matchResult[0]);
    nextState.currValue = nextState.currValue.replace(match, replace);

    return nextState;
  } else if (typeof match === "string") {
    const nextState = { ...state };

    nextState.nextValue.push(match);

    return nextState;
  } else if (defValue) {
    const nextState = { ...state };

    nextState.nextValue.push(defValue);

    return nextState;
  }

  return state;
};
