import path from "path";
import { CodegenConfig } from "@graphql-codegen/cli";
import { defineConfig } from "@eddeee888/gcg-typescript-resolver-files";

const projectRootDir = process.cwd();
const schemaDir = path.relative(projectRootDir, "graphql-schema")
const commonPackage = path.relative(projectRootDir, "packages/common")
const clientPackage = path.relative(projectRootDir, "packages/client")
const serverPackage = path.relative(projectRootDir, "packages/server")

const config: CodegenConfig = {
  schema: `${schemaDir}/**/schema.graphql`,
  documents: `${clientPackage}/src/graphql/*.ts`,
  hooks: {
    afterOneFileWrite: ["prettier --write"],
    beforeDone: [
      `del ${serverPackage}/src/graphql/__generated__/resolverTypes.generated.ts`,
      "node --loader ts-node/esm ./codegen/fixImports.ts"
    ]
  },
  generates: {
    [`${commonPackage}/src/types/__generated__/types.generated.ts`]: {
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
    [`${clientPackage}/src/graphql/__generated__/operationHooks.ts`]: {
      plugins: [
        {
          add: {
            content: [
              `import * as Types from "@battleship/common/types/__generated__/types.generated.js";`,
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
    [`${serverPackage}/src/graphql/__generated__`]: defineConfig({
      mode: "merged",
      resolverTypesPath: "./resolverTypes.generated.ts",
      resolverRelativeTargetDir: "../resolvers",
      resolverMainFileMode: "merged",
      emitLegacyCommonJSImports: false,
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
