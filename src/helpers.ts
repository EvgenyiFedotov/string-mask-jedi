type CombineFn = <A extends Array<any> = [string, number]>(
  ...fns: Function[]
) => (...args: A) => void;

export const combineFn: CombineFn = (...fns) => {
  return (...args) => fns.forEach((fn) => fn(...args));
};
