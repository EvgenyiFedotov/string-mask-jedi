# 🛠 String-mask-jedi

[![npm](https://img.shields.io/npm/v/string-mask-jedi?style=flat)](https://www.npmjs.com/package/string-mask-jedi)
[![npm bundle size](https://img.shields.io/bundlephobia/min/string-mask-jedi?color=success&label=minified&style=flat)](https://bundlephobia.com/result?p=string-mask-jedi)
![license](https://img.shields.io/npm/l/string-mask-jedi?style=flat)
![David](https://img.shields.io/david/EvgenyiFedotov/string-mask-jedi?style=flat)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://evgenyifedotov.github.io/string-mask-jedi)

This package allows you to create dynamic masks for the input field with the ability to control the cursor position.

![string-mask-jedi demo](https://raw.githubusercontent.com/EvgenyiFedotov/string-mask-jedi/readme/next/readme/show-mask.gif)

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

_[[Translations]](#getprops-export)_
_[[Config]](#UsePromiseElement)_
_[[Mask]](#UsePromiseElement)_

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

_[[Token]](#getprops-export)_

### `GetMatch`

Method fot get `RegExp` for each token.

```ts
type GetMatch = (state: State, index: number) => RegExp;
```

### `Mask`

Restult `createMask`.

_[[MaskRun]](#getprops-export)_
_[[Config]](#getprops-export)_

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

_[[GetMatch]](#getprops-export)_

### `Config`

Config for create mask.

> Please note. `createMask` automatically created config by `stringMask`, `translations` and `options`.

```ts
interface Config {
  tokens: TokenConfig[];
  converters: Converter[];
}
```

_[[TokenConfig]](#getprops-export)_
_[[Converter]](#getprops-export)_

### `Converter`

Method for converting result after

```ts
type Converter = (tokens: Token[], configTokens: TokenConfig[]) => void;
```

_[[Token]](#getprops-export)_
_[[TokenConfig]](#getprops-export)_

---

### `Translation`

```ts
type Translation = string | RegExp | GetMatch | TokenConfig | Mask;
```

_[[GetMatch]](#getprops-export)_
_[[TokenConfig]](#getprops-export)_

### `Translations`

```ts
interface Translations {
  [key: string]: Translation | Translation[];
}
```

_[[Translation]](#getprops-export)_

### `RunMask`

```ts
type MaskRun = (value: string, cursor?: number) => MaskResult;
```

_[[MaskResult]](#getprops-export)_

## Examples

See storybook with examples code.

- [Date](#link)
- [Time](#link)
- [Phone](#link)

## Tests

```sh
# npm
npm install
npm run test

# yarn
yarn install
yarn test
```
