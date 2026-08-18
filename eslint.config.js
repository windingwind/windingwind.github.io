import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist/", "public/", "node_modules/"] },
  js.configs.recommended,
  {
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["src/**/*.js"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["scripts/**/*.js", "vite.config.js"],
    languageOptions: { globals: globals.node },
  },
];
