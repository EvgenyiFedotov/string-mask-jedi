# 🛠 String-mask-jedi

[![npm](https://img.shields.io/npm/v/use-promise-element?style=flat)](https://www.npmjs.com/package/use-promise-element)
[![npm bundle size](https://img.shields.io/bundlephobia/min/use-promise-element?color=success&label=minified&style=flat)](https://bundlephobia.com/result?p=use-promise-element)
![license](https://img.shields.io/npm/l/use-promise-element?style=flat)
![David](https://img.shields.io/david/EvgenyiFedotov/use-promise-element?style=flat)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://evgenyifedotov.github.io/use-promise-element)

This package allows you to create dynamic masks for the input field with the ability to control the cursor position.

![string-mask-jedi demo]()

## Install

```sh
# npm
npm install string-mask-jedi

# yarn
yarn add string-mask-jedi
```

## Usage

### Create mask

```ts
import { createMask } from "string-mask-jedi";

const phoneMask = creaateMask("+0 (ddd) ddd-dd-dd", { d: /\d/ });

console.log(phoneMask.run("9998887766").value);
// +0 (999) 888-77-66
```

### React hook

```tsx
import * as React from "react";
import { createMask } from "string-mask-jedi";
import { useMask } from "string-mask-jedi/react";

const phoneMask = creaateMask("+0 (ddd) ddd-dd-dd", { d: /\d/ });

const App: React.FC = () => {
  const { value, onChange, ref } = useMask(phoneMask);

  return <input value={value} onChange={onChange} ref={ref} />;
};
```

## API

### `createMask`

```ts
/**
 * @param stringMask - mask format
 * @param translations - object with letters witch need translating
 * @param options - object with added options for mask
 */
type CreateMask = (
  stringMask: string,
  translations?: Translations,
  options?: Partial<Omit<Config, "tokens">>,
) => Mask;
```

### `Token`

Object witch cached value letter when process value after mask running.

```ts
interface Token {
  value: string;
  additional: boolean;
}
```

### `State`

Object current state mask in processing value after mask running.

```ts
interface State {
  remainder: string;
  tokens: Token[];
  cursor: number;
}
```

### `GetMatch`

Method fot get `RegExp` for each token.

```ts
type GetMatch = (state: State, index: number) => RegExp;
```

### `Mask`

Restult `createMask`.

```ts
interface Mask {
  run: MaskRun;
  config: Config;
}
```

### `MaskResult`

Result run mask.

```ts
interface MaskResult {
  value: string;
  cursor: number;
}
```

### `TokenConfig`

Token config for each letter in created mask.

```ts
interface TokenConfig {
  getMatch: GetMatch;
  defaultValue: string;
  additional: boolean;
}
```

### `Config`

Config for create mask.

> Please note. `createMask` automatically created config by `stringMask`, `translations` and `options`.

```ts
interface Config {
  tokens: TokenConfig[];
  converters: Converter[];
}
```

### `Converter`

Method for converting result after

```ts
type Converter = (tokens: Token[], configTokens: TokenConfig[]) => void;
```

---

### `Translation`

```ts
type Translation = string | RegExp | GetMatch | TokenConfig | Mask;
```

### `Translations`

```ts
interface Translations {
  [key: string]: Translation | Translation[];
}
```

### `RunMask`

```ts
type MaskRun = (value: string, cursor?: number) => MaskResult;
```

## Examples

See storybook with examples code.
