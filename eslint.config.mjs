import globals from "globals";
import pluginJs from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      indent: ["error", 2, { SwitchCase: 1 }],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      // "padding-line-between-statements": [
      //   "error",
      //   { blankLine: "never", prev: "*", next: "for" },
      //   { blankLine: "never", prev: "*", next: "function" },
      //   { blankLine: "never", prev: "*", next: "class" },
      //   { blankLine: "never", prev: "*", next: "switch" },
      //   { blankLine: "never", prev: "*", next: "if" },
      //   { blankLine: "never", prev: "*", next: "const" },
      //   { blankLine: "never", prev: "*", next: "case" },
      //   { blankLine: "never", prev: "*", next: "return" },
      //   { blankLine: "never", prev: "*", next: "while" },
      // ],
      "no-warning-comments": [1, { "terms": ["rework"], "location": "start" }]
    },
  },
];