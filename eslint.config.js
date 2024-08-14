import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: [
          "packages/client/tsconfig.json",
          "packages/server/tsconfig.json",
          "packages/common/tsconfig.json",
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      pluginReact,
    },
  },
  {
    ignores: [
      "**/*.config.js",
      "**/*.config.ts",
      "**/build/",
      "**/test/setup.js",
      "**/webpack.*.js",
    ],
  },
);
