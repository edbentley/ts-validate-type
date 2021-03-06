import { TsValidateType, Primitive, Literal } from "./ts-validate-type";

/**
 * Validates the type of the `value` passed in matches the type argument `T`.
 * Throws error if the types don't match, otherwise returns the `value` passed
 * in.
 *
 * @param value The value to validate.
 * @param doNotFillType Do not used this parameter, this is filled in by the
 * compile-time plugin.
 */
export function validateType<T>(value: unknown, doNotFillType?: string): T {
  if (doNotFillType === undefined) {
    throw new Error(
      "ts-validate-type requires a build step such as babel-plugin-ts-validate-type"
    );
  }

  const type: TsValidateType = JSON.parse(doNotFillType);

  return validateAllTypes(value, type);
}

function validateAllTypes<T>(value: unknown, type: TsValidateType): T {
  switch (type.tag) {
    case "array":
      if (!value || !Array.isArray(value)) {
        throw new Error(`Value is not expected type ${printType(type)}`);
      }
      value.forEach((item) => {
        validateAllTypes(item, type.elementType);
      });
      return (value as unknown) as T;

    case "tuple":
      if (!value || !Array.isArray(value)) {
        throw new Error(`Value is not expected type ${printType(type)}`);
      }
      if (value.length !== type.elementTypes.length) {
        throw new Error(`Tuple is not the same length as ${printType(type)}`);
      }
      type.elementTypes.forEach((elType, index) => {
        validateAllTypes(value[index], elType);
      });
      return (value as unknown) as T;

    case "union": {
      for (let i = 0; i < type.types.length; i++) {
        try {
          return validateAllTypes(value, type.types[i]);
        } catch {
          // try next type
        }
      }
      // failed all
      throw new Error(`Value is not expected union type ${printType(type)}`);
    }

    case "primitive":
      return validatePrimitiveType(value, type.type);

    case "literal":
      return validateLiteralType(value, type.value);

    case "record":
      if (!value || typeof value !== "object") {
        throw new Error(`Value is not expected type ${printType(type)}`);
      }

      type.fields.forEach((field) => {
        if (value && !(field.key in value)) {
          if (field.isOptional) return;
          throw new Error(`Value is missing key "${field.key}"`);
        }
        validateAllTypes(
          (value as Record<string, unknown>)[field.key],
          field.value
        );
      });

      return (value as unknown) as T;

    case "other":
      // unknown or any
      return value as T;
  }
}

function validatePrimitiveType<T>(value: unknown, type: Primitive): T {
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

function validateLiteralType<T>(value: unknown, type: Literal): T {
  if (value !== type) {
    throw new Error(`Value is not expected literal type ${String(type)}`);
  }
  return value as T;
}

function printType(type: TsValidateType): string {
  switch (type.tag) {
    case "array":
      if (type.elementType.tag === "union") {
        // add parenths
        return `(${printType(type.elementType)})[]`;
      }
      return `${printType(type.elementType)}[]`;

    case "literal":
      return String(type.value);

    case "primitive":
      return printPrimitive(type.type);

    case "union":
      return type.types.map(printType).join(" | ");

    case "tuple":
      return `[${type.elementTypes.map(printType).join(", ")}]`;

    case "record":
      if (type.fields.length === 0) {
        return "{}";
      }
      return `{ ${type.fields
        .map((field) => {
          return `${field.key}${field.isOptional ? "?" : ""}: ${printType(
            field.value
          )}`;
        })
        .join("; ")} }`;

    case "other":
      return type.type;
  }
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
