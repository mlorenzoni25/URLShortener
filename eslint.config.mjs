import js from "@eslint/js";
import prettierPlugin from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import tseslint from "typescript-eslint";

const config = tseslint.config(js.configs.recommended, tseslint.configs.recommended, {
  ignores: ["node_modules"],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: "./tsconfig.json",
    },
  },
  plugins: { import: importPlugin, jsdoc },
  rules: {
    ...prettierPlugin.rules,

    quotes: ["error", "double"],
    "object-curly-spacing": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "no-unused-vars": ["error", { args: "all", argsIgnorePattern: "^_" }],
    "no-console": "warn",

    "jsdoc/check-examples": "off",
    "jsdoc/require-example": "off",
    "jsdoc/require-hyphen-before-param-description": "off",
    "jsdoc/no-types": "off",
    "jsdoc/require-jsdoc": "error",
    "jsdoc/require-description": "error",
    "jsdoc/require-param": "error",
    "jsdoc/require-param-description": "error",
    "jsdoc/require-param-name": "error",
    "jsdoc/require-param-type": "error",
    "jsdoc/require-returns": "error",
    "jsdoc/require-returns-check": "error",
    "jsdoc/require-returns-description": "error",
    "jsdoc/require-returns-type": "error",
    "jsdoc/require-throws": "error",

    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    "@typescript-eslint/no-inferrable-types": [
      "warn",
      {
        ignoreParameters: true,
        ignoreProperties: true,
      },
    ],

    "import/order": [
      "warn",
      {
        groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"]],
        "newlines-between": "never",
      },
    ],
  },
});

export default config;
