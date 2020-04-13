module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "extends": ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    "rules": {
        "@typescript-eslint/no-use-before-define": ["error", { "variables": false, "functions": false }],
        "@typescript-eslint/explicit-function-return-type": 0
    }
};
