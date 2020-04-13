import * as t from "@babel/types";
import { PluginObj } from "@babel/core";
import { typeVersion, ValidateTsType } from "../../common/validate-ts-type";

function typeParamToValidator(type: t.TSType): ValidateTsType {
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

    default:
      throw new Error(`Unimplemented type ${type.type}`);
  }
}

export default function (): PluginObj {
  return {
    visitor: {
      CallExpression(path) {
        if (
          !t.isIdentifier(path.node.callee) ||
          path.node.callee.name !== "validateType"
        ) {
          return;
        }

        if (
          !path.node.typeParameters ||
          path.node.typeParameters.params.length !== 1
        ) {
          throw new Error("Expected exactly one type parameter");
        }

        const runtimeType = typeParamToValidator(
          path.node.typeParameters.params[0]
        );

        path.node.arguments.push(t.stringLiteral(JSON.stringify(runtimeType)));
        path.node.arguments.push(t.numericLiteral(typeVersion));
      },
    },
  };
}
