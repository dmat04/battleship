import { CodegenConfig } from '@graphql-codegen/cli';
import { defineConfig } from '@eddeee888/gcg-typescript-resolver-files';

const config: CodegenConfig = {
  schema: './common/graphql-schema/**/schema.graphql',
  documents: './client/src/graphql/*.ts',
  generates: {
    './common/types/types.generated.ts': {
      plugins: ['typescript', 'typescript-operations']
    },
    './server/src/graphql/resolvers.generated.ts': {
      plugins: [
        {
          add: {
            content: `import * as Types from '@battleship/common/types/types.generated';`
          },
        },
        {
          'typescript-resolvers': {
            namespacedImportName: 'Types'
          }
        },
      ]
    },
    // './server/GENERATED/RESOLVERS/': defineConfig({
    //   resolverTypesPath: 
    // }),
  }
}

export default config