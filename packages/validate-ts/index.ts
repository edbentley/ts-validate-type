import { ValidateTsType } from "../../common/validate-ts-type";

export function validateType<T>(
  data: unknown,
  doNotFillType?: ValidateTsType
): T {
  const typeofData = typeof data;
  if (typeofData !== doNotFillType) {
    throw new Error(
      `Data of type ${typeofData} is not expected type ${doNotFillType}`
    );
  }
  return data as T;
}
