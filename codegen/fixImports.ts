import path from "path";
import { replaceInFileSync } from 'replace-in-file';

const serverPackage = path.resolve(import.meta.dirname, "../packages/server")

const options = {
  files: `${serverPackage}/src/graphql/**/**/*.ts`,
  from: /\.\/(\.\.\/)*(__generated__\/)*resolverTypes\.generated/,
  to: '@battleship/common/types/__generated__/types.generated'
}

replaceInFileSync(options)
