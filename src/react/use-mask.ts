import * as React from "react";
import { Mask, MaskResult } from "..";

const isHTMLInput = (x: any): x is HTMLInputElement | HTMLTextAreaElement => {
  return typeof x.value === "string";
};

type OnChange = React.ChangeEventHandler<
  HTMLInputElement | HTMLTextAreaElement
>;

interface UseStringMaskResult<T = any> {
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  ref: React.RefObject<T>;
}

export const useMask = <T = HTMLInputElement>(
  mask: Mask,
): UseStringMaskResult<T> => {
  const ref = React.useRef<T>(null);

  const [maskResult, setMaskResult] = React.useState<MaskResult>({
    value: "",
    cursor: 0,
  });

  const value = React.useMemo(() => maskResult.value, [maskResult]);

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
