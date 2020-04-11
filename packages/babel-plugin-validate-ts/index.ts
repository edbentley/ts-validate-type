import * as t from "@babel/types";
import { PluginObj } from "@babel/core";
import { ValidateTsType } from "../../common/validate-ts-type";

function typeParamToValidator(type: t.TSType): ValidateTsType {
  switch (type.type) {
    case "TSStringKeyword":
      return "string";

    default:
      throw new Error(`Unimplemented type ${type.type}`);
  }
}

export default function (): PluginObj {
  return {
    visitor: {
      CallExpression(path) {
        if (
          path.node.callee.type !== "Identifier" ||
          path.node.callee.name !== "validateType"
        )
          return;
        if (path.node.typeParameters?.type !== "TSTypeParameterInstantiation")
          return;
        const runtimeType = typeParamToValidator(
          path.node.typeParameters?.params[0]
        );

        path.node.arguments.push(t.stringLiteral(runtimeType));
      },
    },
  };
}
