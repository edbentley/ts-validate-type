# validate-ts

Validate data at runtime **using TypeScript types**.

```ts
const user = validateType<{ name: string }>(data);
```

## Setup

1. Install dependencies
  ```bash
  npm install validate-ts
  ```
  ```bash
  npm install --save-dev babel-plugin-validate-ts
  ```
2. Setup Babel plugin
  ```json
  "plugins": ["babel-plugin-validate-ts"]
  ```
3. Use in your code
  ```ts
  import { validateType } from "validate-ts";

  try {
    const myData = validateType<string>(data);
  } catch (e) {
    // handle incorrect type
  }
  ```

## How does it work?

Given this example:

```ts
validateType<string>(data);
```

The Babel plugin will add the `<string>` type parameter as a runtime argument,
which is then used for validation:

```ts
validateType<string>(data, "string");
```
