import * as t from "@babel/types";
import { PluginObj, NodePath } from "@babel/core";
import { TsValidateType } from "./ts-validate-type";

function typeParamToValidator(
  type: t.TSType,
  path: NodePath<t.CallExpression>
): TsValidateType {
  switch (type.type) {
    case "TSStringKeyword":
      return { tag: "primitive", type: "string" };

    case "TSBooleanKeyword":
      return { tag: "primitive", type: "boolean" };

    case "TSNumberKeyword":
      return { tag: "primitive", type: "number" };

    case "TSBigIntKeyword":
      return { tag: "primitive", type: "bigint" };

    case "TSSymbolKeyword":
      return { tag: "primitive", type: "symbol" };

    case "TSNullKeyword":
      return { tag: "primitive", type: null };

    case "TSUndefinedKeyword":
      return { tag: "primitive", type: "undefined" };

    case "TSLiteralType":
      return { tag: "literal", value: type.literal.value };

    case "TSUnknownKeyword":
      return { tag: "other", type: "unknown" };

    case "TSAnyKeyword":
      return { tag: "other", type: "any" };

    case "TSTypeReference":
      throw path.buildCodeFrameError(
        "ts-validate-type only supports inline types"
      );

    case "TSUnionType":
      return {
        tag: "union",
        types: type.types.map((t) => typeParamToValidator(t, path)),
      };

    case "TSArrayType":
      return {
        tag: "array",
        elementType: typeParamToValidator(type.elementType, path),
      };

    case "TSParenthesizedType":
      return typeParamToValidator(type.typeAnnotation, path);

    case "TSTypeLiteral":
      return {
        tag: "record",
        fields: type.members.map((member) => {
          if (!t.isTSPropertySignature(member)) {
            throw path.buildCodeFrameError(`Unimplemented type ${member.type}`);
          }
          if (!t.isIdentifier(member.key)) {
            throw path.buildCodeFrameError("Keys must be string literals");
          }

          const isOptional = member.optional ?? false;

          const key = member.key.name;
          const value = typeParamToValidator(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            member.typeAnnotation!.typeAnnotation,
            path
          );
          return { key, value, isOptional };
        }),
      };

    case "TSTupleType":
      return {
        tag: "tuple",
        elementTypes: type.elementTypes.map((t) =>
          typeParamToValidator(t, path)
        ),
      };

    default: {
      const typeMap: Record<string, string | undefined> = {
        TSNeverKeyword: "never",
        TSObjectKeyword: "object",
        TSVoidKeyword: "void",
        TSThisType: "this",
        TSFunctionType: "function",
      };
      throw path.buildCodeFrameError(
        `${typeMap[type.type] ?? type.type} type not supported`
      );
    }
  }
}

export default function (): PluginObj {
  return {
    visitor: {
      CallExpression(path) {
        if (
          (t.isIdentifier(path.node.callee) &&
            path.node.callee.name === "validateType") ||
          (t.isMemberExpression(path.node.callee) &&
            path.node.callee.property.name === "validateType")
        ) {
          if (
            !path.node.typeParameters ||
            path.node.typeParameters.params.length !== 1
          ) {
            throw path.buildCodeFrameError(
              "Expected exactly one type parameter"
            );
          }

          const runtimeType = typeParamToValidator(
            path.node.typeParameters.params[0],
            path
          );

          path.node.arguments.push(
            t.stringLiteral(JSON.stringify(runtimeType))
          );
        }
      },
    },
  };
}
