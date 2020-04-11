import { validateType } from ".";

test("Works", () => {
  expect(validateType<string>("hello", "string")).toBe("hello");
  expect(() =>
    validateType<string>(5, "string")
  ).toThrowErrorMatchingInlineSnapshot(
    `"Data of type number is not expected type string"`
  );
});
