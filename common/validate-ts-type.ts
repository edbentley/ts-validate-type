export type ValidateTsType =
  | {
      tag: "record";
      fields: { key: string; value: ValidateTsType; isOptional: boolean }[];
    }
  | { tag: "tuple"; elementTypes: ValidateTsType[] }
  | { tag: "array"; elementType: ValidateTsType }
  | { tag: "union"; types: ValidateTsType[] }
  | { tag: "primitive"; type: Primitive }
  | { tag: "literal"; value: Literal }
  | { tag: "other"; type: OtherType };

export type Primitive =
  | null
  | "undefined"
  | "string"
  | "boolean"
  | "number"
  | "bigint"
  | "symbol";

export type Literal = string | number | boolean;

export type OtherType = "unknown" | "any";
