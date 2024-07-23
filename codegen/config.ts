import { CodegenConfig } from "@graphql-codegen/cli";
import { defineConfig } from "@eddeee888/gcg-typescript-resolver-files";

const config: CodegenConfig = {
  schema: "./common/graphql-schema/**/schema.graphql",
  documents: "./client/src/graphql/*.ts",
  hooks: {
    afterOneFileWrite: ["prettier --write"],
    beforeDone: [
      "del ./server/src/graphql/__generated__/resolverTypes.generated.ts",
      "node --loader ts-node/esm ./codegen/fixImports.ts"
    ]
  },
  generates: {
    "./common/types/__generated__/types.generated.ts": {
      plugins: [
        {
          add: {
            content: [
              `import type { ApolloContext } from "@battleship/common/utils/ApolloContext.js";`
            ]
          },
        },
        {
          "typescript": {
            enumsAsTypes: false,
            namingConvention: "change-case-all#pascalCase",
          }
        },
        {
          "typescript-resolvers": {
            namingConvention: "change-case-all#pascalCase",
            contextType: "ApolloContext",
          }
        },
        {
          "typescript-operations": {
            namingConvention: "change-case-all#pascalCase",
          },
        },
      ],
    },
    "./client/src/graphql/__generated__/operationHooks.ts": {
      plugins: [
        {
          add: {
            content: [
              `import * as Types from "@battleship/common/types/__generated__/types.generated";`,
            ]
          },
        },
        {
          "typescript-react-apollo": {
            importOperationTypesFrom: "Types",
          },
        },
      ],
    },
    "./server/src/graphql/__generated__": defineConfig({
      mode: "merged",
      resolverTypesPath: "./resolverTypes.generated.ts",
      resolverRelativeTargetDir: "../resolvers",
      resolverMainFileMode: "merged",
      emitLegacyCommonJSImports: false,
      add: {
        './resolverTypes.generated.ts': {
          content: [
            `import * as Types from "@battleship/common/types/__generated__/types.generated.js";`,
            `import type { ApolloContext } from "@battleship/common/utils/ApolloContext.js";`
          ],
        }
      },
      typesPluginsConfig: {
        enumsAsTypes: false,
        namespacedImportName: "Types",
        contextType: "ApolloContext",
        namingConvention: "change-case-all#pascalCase",
      },
      mergeSchema: false,
    }),

  },
};

export default config;
