import * as babel from "@babel/core";
import plugin from ".";

const example = `
const out = validateType<string>("hello");
`;

test("Works", () => {
  const out = babel.transform(example, {
    filename: "test.ts",
    plugins: [plugin],
    presets: ["@babel/preset-typescript"],
  });

  expect(out?.code).toMatchInlineSnapshot(
    `"const out = validateType(\\"hello\\", \\"string\\");"`
  );
});
