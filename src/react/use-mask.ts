import * as React from "react";
import { Mask, MaskResult } from "..";

const isHTMLInput = (x: any): x is HTMLInputElement | HTMLTextAreaElement => {
  return typeof x.value === "string";
};

type OnChange = React.ChangeEventHandler<
  HTMLInputElement | HTMLTextAreaElement
>;

interface UseStringMaskResult<T = HTMLInputElement | HTMLTextAreaElement> {
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  ref: React.RefObject<T>;
}

export type UseStateHandler = (
  initialState: MaskResult,
) => [MaskResult, (state: MaskResult) => any];

export const useMask = <T = HTMLInputElement>(
  mask: Mask,
  useState: UseStateHandler = React.useState,
): UseStringMaskResult<T> => {
  const ref = React.useRef<T>(null);

  const [maskResult, setMaskResult] = useState({
    value: "",
    cursor: 0,
  });

  const value = React.useMemo(() => {
    const nextValue = mask.run(maskResult.value, maskResult.cursor);

    if (maskResult.value !== nextValue.value) {
      setMaskResult(nextValue);
    }

    return nextValue.value;
  }, [maskResult]);

  const onChange = React.useCallback<OnChange>(
    (event) => {
      const { currentTarget } = event;
      const { value, selectionStart } = currentTarget;

      if (typeof selectionStart === "number") {
        setMaskResult(mask.run(value, selectionStart));
      }
    },
    [mask],
  );

  React.useEffect(() => {
    const { current } = ref;

    if (current && isHTMLInput(current)) {
      current.selectionStart = maskResult.cursor;
      current.selectionEnd = maskResult.cursor;
    }
  }, [maskResult]);

  return { value, onChange, ref };
};
