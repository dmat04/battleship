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
          "./tsconfig.json",
          "./packages/common/tsconfig.json",
          "./packages/client/tsconfig.eslint.json",
          "./packages/server/tsconfig.eslint.json",
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      pluginReact,
    },
    rules: {
      "no-console": "warn",
    }
  },
  {
    ignores: [
      "**/*.config.js",
      "**/*.config.ts",
      "**/build/",
      "**/test/setup.js",
      "**/webpack.*.js",
      "**/*.generated.ts",
      "db/mongo-init.js"
    ],
  },
);
