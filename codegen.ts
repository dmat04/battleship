import { CodegenConfig } from "@graphql-codegen/cli";
import { defineConfig } from "@eddeee888/gcg-typescript-resolver-files";

const config: CodegenConfig = {
  schema: "./common/graphql-schema/**/schema.graphql",
  documents: "./client/src/graphql/*.ts",
  hooks: {
    afterOneFileWrite: ["prettier --write"],
  },
  generates: {
    "./common/types/__generated__/types.generated.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
    "./server/src/graphql/__generated__/resolverTypes.generated.ts": {
      plugins: [
        {
          add: {
            content: [
              `import * as Types from "@battleship/common/types/__generated__/types.generated";`,
              `import type { ApolloContext } from "@battleship/common/utils/ApolloContext";`
            ],
          },
        },
        {
          "typescript-resolvers": {
            namespacedImportName: "Types",
            contextType: "ApolloContext",
          },
        },
      ],
    },
    "./server/src/graphql/__generated__": defineConfig({
      mode: "merged",
      resolverTypesPath: "resolverTypes.generated.ts",
      resolverRelativeTargetDir: "../resolvers",
      resolverMainFileMode: "merged",
      typeDefsFilePath: false,
      mergeSchema: false,
    }),
    "./client/src/graphql/__generated__/operationHooks.ts": {
      plugins: [
        {
          add: {
            content: `import * as Types from '@battleship/common/types/__generated__/types.generated';`,
          },
        },
        {
          "typescript-react-apollo": {
            importOperationTypesFrom: "Types",
          },
        },
      ],
    },
  },
};

export default config;
