import traverse from '@babel/traverse'
import { babelParse } from './babelParse'

export function hasTopLevelAwait(contents: string, fileName?: string) {
  if (!contents.includes('await')) {
    return false
  }

  const ast = babelParse(contents, fileName)
  let found = false

  traverse(ast, {
    AwaitExpression(path) {
      if (!path.getFunctionParent()) {
        found = true
        path.stop()
      }
    },
    ForOfStatement(path) {
      if (path.node.await && !path.getFunctionParent()) {
        found = true
        path.stop()
      }
    },
  })

  return found
}
