import type { NodePath } from '@babel/traverse'
import type * as t from '@babel/types'

export function findTopmostFunction(jsxPath: NodePath<t.JSXElement>) {
  // get topmost fn
  const isFunction = (path: NodePath<any>) =>
    path.isArrowFunctionExpression() ||
    path.isFunctionDeclaration() ||
    path.isFunctionExpression()
  let compFn: NodePath<any> | null = jsxPath.findParent(isFunction)
  while (compFn) {
    const parent = compFn.findParent(isFunction)
    if (parent) {
      compFn = parent
    } else {
      break
    }
  }
  if (!compFn) {
    // console.error(`Couldn't find a topmost function for media query extraction`)
    return null
  }
  return compFn
}
