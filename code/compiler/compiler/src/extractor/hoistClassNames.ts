import type { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

export function hoistClassNames(
  path: NodePath<t.JSXElement>,
  existing: { [key: string]: t.Identifier },
  expr: t.Expression
) {
  const hoist = hoistClassNames.bind(null, path, existing)
  if (t.isStringLiteral(expr)) {
    if (expr.value.trim() === '') {
      return expr
    }
    if (existing[expr.value]) {
      return existing[expr.value]
    }
    const identifier = replaceStringWithVariable(expr)
    existing[expr.value] = identifier
    return identifier
  }
  if (t.isBinaryExpression(expr)) {
    if (t.isPrivateName(expr.left)) {
      throw new Error(`no private name`)
    }
    return t.binaryExpression(expr.operator, hoist(expr.left), hoist(expr.right))
  }
  if (t.isLogicalExpression(expr)) {
    return t.logicalExpression(expr.operator, hoist(expr.left), hoist(expr.right))
  }
  if (t.isConditionalExpression(expr)) {
    return t.conditionalExpression(
      expr.test,
      hoist(expr.consequent),
      hoist(expr.alternate)
    )
  }
  return expr

  function replaceStringWithVariable(str: t.StringLiteral): t.Identifier {
    // hoist outside fn!
    const uid = path.scope.generateUidIdentifier('cn')
    const parent = path.findParent((path) => path.isProgram())
    if (!parent) throw new Error(`no program?`)
    const variable = t.variableDeclaration('const', [
      // adding a space for extra safety
      t.variableDeclarator(uid, t.stringLiteral(` ${str.value}`)),
    ])
    // @ts-ignore
    parent.unshiftContainer('body', variable)
    return uid
  }
}
