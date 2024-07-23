import { replaceInFileSync } from 'replace-in-file';

const options = {
  files: './server/src/graphql/**/**/*.ts',
  from: /\.\/(\.\.\/)*(__generated__\/)*resolverTypes\.generated/,
  to: '@battleship/common/types/__generated__/types.generated.js'
}

replaceInFileSync(options)
