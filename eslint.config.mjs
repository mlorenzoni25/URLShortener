import js from "@eslint/js";
import googleConfig from "eslint-config-google";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      "coverage",
      "*.config.js",
      "*.d.ts",
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...googleConfig.rules,
      "require-jsdoc": "off",
      "valid-jsdoc": "off",
      "quotes": ["error", "double"],
      "comma-dangle": ["error", "always-multiline"],
      "no-console": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", {argsIgnorePattern: "^_"}],
      "import/order": [
        "warn",
        {
          "groups": [["builtin", "external"], "internal", ["parent", "sibling", "index"]],
          "newlines-between": "always",
        },
      ],
    },
  },
];
