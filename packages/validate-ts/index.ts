import {
  typeVersion,
  ValidateTsType,
  Primitive,
  Literal,
} from "../../common/validate-ts-type";

export function validateType<T>(
  value: unknown,
  doNotFillType?: string,
  doNotFillTypeVersion?: number
): T {
  if (doNotFillType === undefined || doNotFillTypeVersion === undefined) {
    throw new Error(
      "validate-ts requires a build step such as babel-plugin-validate-ts"
    );
  }
  if (typeVersion !== doNotFillTypeVersion) {
    if (typeVersion > doNotFillTypeVersion) {
      throw new Error(
        "Please update the build step package for validate-ts to the latest version"
      );
    }
    throw new Error("Please update validate-ts to the latest version");
  }

  const type: ValidateTsType = JSON.parse(doNotFillType);

  if (type.tag === "primitive") {
    return validatePrimitiveType(value, type.type);
  }

  return validateLiteralType(value, type.value);
}

export function validatePrimitiveType<T>(value: unknown, type: Primitive): T {
  // special null case since typeof null = "object"
  if (value === null && type === null) {
    return (value as unknown) as T;
  }

  const typeofValue = typeof value;

  if (typeofValue !== type) {
    throw new Error(
      `Value of type ${typeofValue} is not expected type ${printPrimitive(
        type
      )}`
    );
  }
  return value as T;
}

export function validateLiteralType<T>(value: unknown, type: Literal): T {
  if (value !== type) {
    throw new Error(`Value is not expected literal type ${String(type)}`);
  }
  return value as T;
}

function printPrimitive(type: Primitive): string {
  switch (type) {
    case null:
      return "null";
    case "undefined":
    case "string":
    case "boolean":
    case "number":
    case "bigint":
    case "symbol":
      return type;
  }
}
