/* eslint-disable @typescript-eslint/no-explicit-any */
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

describe("Can validate other types", () => {
  test("unknown", () => {
    const value = "hello";

    expect(validateType<unknown>(value)).toBe(value);
  });

  test("any", () => {
    const value = "hello";

    expect(validateType<any>(value)).toBe(value);
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

describe("Can validate union types", () => {
  test("string or number", () => {
    const valueStr = "hello";
    const valueNum = 5;

    expect(validateType<string | number>(valueStr)).toBe(valueStr);
    expect(validateType<string | number>(valueNum)).toBe(valueNum);

    expect(() => validateType<string | number>(true)).toThrowError(
      "Value is not expected union type string | number"
    );
  });

  test("string or literal", () => {
    const valueStr = "test";
    const value5 = 5;

    expect(validateType<string | 5>(valueStr)).toBe(valueStr);
    expect(validateType<string | 5>(value5)).toBe(value5);

    expect(() => validateType<string | 5>(1)).toThrowError(
      "Value is not expected union type string | 5"
    );
  });
});

describe("Can validate arrays", () => {
  test("string array", () => {
    const value = ["a", "b", "c"];
    const valueEmpty: unknown[] = [];

    expect(validateType<string[]>(value)).toBe(value);
    expect(validateType<string[]>(valueEmpty)).toBe(valueEmpty);

    expect(() => validateType<string[]>([1, 2, 3])).toThrowError(
      "Value of type number is not expected type string"
    );

    expect(() => validateType<string[]>("hello")).toThrowError(
      "Value is not expected type string[]"
    );
  });

  test("Union array", () => {
    const value = ["a", 1, "c"];

    expect(validateType<(string | number)[]>(value)).toBe(value);

    expect(() =>
      validateType<(string | number)[]>(["a", 1, true])
    ).toThrowError("Value is not expected union type string | number");

    expect(() => validateType<(string | number)[]>("hello")).toThrowError(
      "Value is not expected type (string | number)[]"
    );
  });
});

describe("Can validate records", () => {
  test("Simple record", () => {
    const value = { name: "hello" };

    expect(validateType<{ name: string }>(value)).toBe(value);

    expect(() => validateType<{ name: string }>({})).toThrowError(
      `Value is missing key "name"`
    );

    expect(() => validateType<{ name: string }>({ name: 1 })).toThrowError(
      "Value of type number is not expected type string"
    );

    expect(() => validateType<{ name: string }>("hello")).toThrowError(
      "Value is not expected type { name: string }"
    );
  });

  test("Multi-field record", () => {
    const value = { name: "hello", id: 0 };

    expect(validateType<{ name: string; id: number }>(value)).toBe(value);

    expect(() =>
      validateType<{ name: string; id: number }>({ name: "hello" })
    ).toThrowError(`Value is missing key "id"`);

    expect(() =>
      validateType<{ name: string; id: number }>({ name: "hello", id: "0" })
    ).toThrowError("Value of type string is not expected type number");

    expect(() =>
      validateType<{ name: string; id: number }>("hello")
    ).toThrowError("Value is not expected type { name: string; id: number }");
  });

  test("Nested record", () => {
    const value = { name: "hello", contact: { address: "000", phone: 123 } };

    expect(
      validateType<{
        name: string;
        contact: {
          address: string;
          phone: number;
        };
      }>(value)
    ).toBe(value);

    expect(() =>
      validateType<{
        name: string;
        contact: {
          address: string;
          phone: number;
        };
      }>({ name: "hello", contact: { address: "000" } })
    ).toThrowError(`Value is missing key "phone"`);

    expect(() =>
      validateType<{
        name: string;
        contact: {
          address: string;
          phone: number;
        };
      }>({ name: "hello", contact: { address: "000", phone: "123" } })
    ).toThrowError("Value of type string is not expected type number");

    expect(() =>
      validateType<{
        name: string;
        contact: {
          address: string;
          phone: number;
        };
      }>("hello")
    ).toThrowError(
      "Value is not expected type { name: string; contact: { address: string; phone: number } }"
    );
  });

  test("Empty record", () => {
    const value = {};
    const valueAddit = { name: "hello" };

    expect(validateType<{}>(value)).toBe(value);
    expect(validateType<{}>(valueAddit)).toBe(valueAddit);

    expect(() => validateType<{}>("hello")).toThrowError(
      "Value is not expected type {}"
    );
  });

  test("Record with optional fields", () => {
    const value = { name: "hello", id: 0 };
    const valueNoId = { name: "hello" };

    expect(validateType<{ name: string; id?: number }>(value)).toBe(value);
    expect(validateType<{ name: string; id?: number }>(valueNoId)).toBe(
      valueNoId
    );

    expect(() =>
      validateType<{ name: string; id?: number }>({
        name: "hello",
        id: "hello",
      })
    ).toThrowError("Value of type string is not expected type number");

    expect(() =>
      validateType<{ name: string; id?: number }>("hello")
    ).toThrowError("Value is not expected type { name: string; id?: number }");
  });
});

describe("Can validate tuples", () => {
  test("2 length tuple", () => {
    const value = ["hello", 5];

    expect(validateType<[string, number]>(value)).toBe(value);

    expect(() => validateType<[string, number]>(["hello", 5, 4])).toThrowError(
      "Tuple is not the same length as [string, number]"
    );

    expect(() => validateType<[string, number]>(["hello"])).toThrowError(
      "Tuple is not the same length as [string, number]"
    );

    expect(() => validateType<[string, number]>(["hello", "5"])).toThrowError(
      "Value of type string is not expected type number"
    );

    expect(() => validateType<[string, number]>("hello")).toThrowError(
      "Value is not expected type [string, number]"
    );
  });

  test("1 length tuple", () => {
    const value = ["hello"];

    expect(validateType<[string]>(value)).toBe(value);

    expect(() => validateType<[string]>([5])).toThrowError(
      "Value of type number is not expected type string"
    );

    expect(() => validateType<[string]>("hello")).toThrowError(
      "Value is not expected type [string]"
    );
  });

  test("Empty tuple", () => {
    const value: [] = [];

    expect(validateType<[]>(value)).toBe(value);

    expect(() => validateType<[]>(["a", 1, "c"])).toThrowError(
      "Tuple is not the same length as []"
    );
  });
});
