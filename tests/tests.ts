import { validateType } from "../packages/validate-ts";

describe("Can validate primitive types", () => {
  test("string", () => {
    const value = "hello";

    expect(validateType<string>(value)).toBe(value);

    expect(() => validateType<string>(5)).toThrowError(
      "Value of type number is not expected type string"
    );
  });

  test("boolean", () => {
    const value = true;

    expect(validateType<boolean>(value)).toBe(value);

    expect(() => validateType<boolean>(5)).toThrowError(
      "Value of type number is not expected type boolean"
    );
  });

  test("number", () => {
    const value = 5;

    expect(validateType<number>(value)).toBe(value);

    expect(() => validateType<number>("hello")).toThrowError(
      "Value of type string is not expected type number"
    );
  });

  test("bigint", () => {
    const value = BigInt(1);

    expect(validateType<bigint>(value)).toBe(value);

    expect(() => validateType<bigint>(5)).toThrowError(
      "Value of type number is not expected type bigint"
    );
  });

  test("symbol", () => {
    const value = Symbol();

    expect(validateType<symbol>(value)).toBe(value);

    expect(() => validateType<symbol>(5)).toThrowError(
      "Value of type number is not expected type symbol"
    );
  });

  test("null", () => {
    const value = null;

    expect(validateType<null>(value)).toBe(value);

    expect(() => validateType<null>(5)).toThrowError(
      "Value of type number is not expected type null"
    );
  });

  test("undefined", () => {
    const value = undefined;

    expect(validateType<undefined>(value)).toBe(value);

    expect(() => validateType<undefined>(5)).toThrowError(
      "Value of type number is not expected type undefined"
    );
  });
});

describe("Can validate literal types", () => {
  test("Literal string", () => {
    const value = "hello";

    expect(validateType<"hello">(value)).toBe(value);

    expect(() => validateType<"hello">("hi")).toThrowError(
      "Value is not expected literal type hello"
    );

    expect(() => validateType<"hello">(5)).toThrowError(
      "Value is not expected literal type hello"
    );
  });

  test("Literal number", () => {
    const value = 5;

    expect(validateType<5>(value)).toBe(value);

    expect(() => validateType<5>(1)).toThrowError(
      "Value is not expected literal type 5"
    );

    expect(() => validateType<5>("hello")).toThrowError(
      "Value is not expected literal type 5"
    );
  });

  test("Literal boolean", () => {
    const value = true;

    expect(validateType<true>(value)).toBe(value);

    expect(() => validateType<true>(false)).toThrowError(
      "Value is not expected literal type true"
    );

    expect(() => validateType<true>("hello")).toThrowError(
      "Value is not expected literal type true"
    );
  });
});
