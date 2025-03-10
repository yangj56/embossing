/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  plugins: ["import", "@typescript-eslint", "turbo"],
  ignorePatterns: [
    "node_modules/**",
    "storybook-static/**",
    ".next/**",
    "out/**",
    "dist/**",
    "**/*.config.js",
    "**/*.config.cjs",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  extends: [
    "next",
    "turbo",
    "plugin:@typescript-eslint/recommended",
    "plugin:sonarjs/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "no-console": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/ban-ts-comment": "warn",
    "sonarjs/no-duplicate-string": ["warn"],
    "sonarjs/cognitive-complexity": ["warn", 40],
    "sonarjs/no-collapsible-if": "warn",
    "@next/next/no-html-link-for-pages": "off",
    "@next/next/no-img-element": "off",
    "@typescript-eslint/triple-slash-reference": "off",
    "@typescript-eslint/consistent-type-imports": "error",
  },
  ignorePatterns: ["**/*.config.js", "**/*.config.cjs", "dist/*"],
  reportUnusedDisableDirectives: true,
};

module.exports = config;
