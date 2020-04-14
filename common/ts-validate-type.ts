export type TsValidateType =
  | {
      tag: "record";
      fields: { key: string; value: TsValidateType; isOptional: boolean }[];
    }
  | { tag: "tuple"; elementTypes: TsValidateType[] }
  | { tag: "array"; elementType: TsValidateType }
  | { tag: "union"; types: TsValidateType[] }
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
