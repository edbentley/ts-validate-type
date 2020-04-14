# validate-ts

## What?

Validate data at runtime **using TypeScript types**.

```ts
const user = validateType<{ name: string }>(data);
```

## Why?

Building apps in TypeScript often requires handling data we don't know the type
of at compile time. For example fetching data:

```ts
const myData = fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then(response => response.json())
  .then(response => {
    // casting is unsafe!
    return response as {
      userId: number;
      id: number;
      title: string;
      completed: boolean;
    };
  });
```

With validate-ts:

```ts
const myData = fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then(response => response.json())
  .then(response => {
    // throws error if response and type don't match
    return validateType<{
      userId: number;
      id: number;
      title: string;
      completed: boolean;
    }>(response);
  });
```

## How?

validate-ts requires a compile-time plugin to work. Given this example:

```ts
validateType<string>(data);
```

The plugin will add the `<string>` type parameter as a runtime argument (a
stringified object of type [`ValidateTsType`](./common/validate-ts-type.ts)),
which is then used for validation:

```ts
validateType<string>(data, "{ ... }");
```

## Setup

> Note: currently only a TypeScript setup using Babel is supported.

1. Install dependencies
  ```bash
  npm install validate-ts
  ```
  ```bash
  npm install --save-dev babel-plugin-validate-ts
  ```
2. Add Babel plugin
  ```json
  "plugins": ["babel-plugin-validate-ts", ...]
  ```

## API

### `validateType`

```ts
function validateType<T>(value: unknown): T;
```

Checks the type of the `value` passed in matches the type argument `T`. Throws
error if the types don't match, otherwise returns the `value` passed in.

`T` must be an inline type. Using type variables like `<MyData>` is not
supported.

#### Examples

```ts
import { validateType } from "validate-ts";

try {
  const myValue = validateType<string>(value);
} catch (e) {
  // handle incorrect type
}
```

```ts
validateType<{
  version: "1";
  name: string;
  id: string | number;
  tags: string[];
  nested: { value: boolean };
  tuple: [bigint, bigint];
  data: any;
}>(data);
```
