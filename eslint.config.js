import eslint from '@eslint/js'
import tseslint from 'typescript-eslint';
import pluginJest from 'eslint-plugin-jest';
import pluginReact from 'eslint-plugin-react';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: [
          "./client/tsconfig.json",
          "./server/tsconfig.json",
          "./common/tsconfig.json",
        ],
        tsconfigRootDir: import.meta.dirname,
      }
    },
    plugins: {
      pluginJest,
      pluginReact,
    },
  },
  {
    ignores: [
      "**/*.config.js",
      "**/__generated__/"
    ]
  }
);