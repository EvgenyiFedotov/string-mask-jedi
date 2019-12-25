import * as React from "react";
import { Mask } from "string-mask-jedi";

const isHTMLElement = (x: any): x is HTMLElement => {
  return x.addEventListener instanceof Function;
};

const isHTMLInputElement = (x: any): x is HTMLInputElement => {
  return typeof x.value === "string";
};

const change = (mask: Mask) => {
  let prevValue: string = "";

  return (event: KeyboardEvent) => {
    event.stopPropagation();

    if (isHTMLInputElement(event.currentTarget)) {
      const { currentTarget } = event;
      const { value, selectionStart } = currentTarget;

      if (prevValue !== value) {
        const maskResult = mask(value, selectionStart);

        currentTarget.value = maskResult.value;
        currentTarget.selectionStart = maskResult.cursor;
        currentTarget.selectionEnd = maskResult.cursor;

        prevValue = currentTarget.value;
      }
    }
  };
};

export const useStringMask = <T = HTMLInputElement>(
  mask: Mask,
): React.MutableRefObject<T> => {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    const { current } = ref;

    if (isHTMLElement(current)) {
      const changeMask = change(mask);

      current.addEventListener("keydown", changeMask);
      current.addEventListener("keyup", changeMask);
    }
  }, [mask, ref]);

  return ref;
};
