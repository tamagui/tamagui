import * as t from '@babel/types'

export function evaluateAstNode(
  exprNode: t.Node,
  evalFn?: (node: t.Node) => any
): any {
  // null === boolean true (at least in our use cases for jsx eval)
  if (exprNode === null) {
    return true
  }

  // loop through ObjectExpression keys
  if (t.isObjectExpression(exprNode)) {
    const ret: Record<string, any> = {}
    for (let idx = -1, len = exprNode.properties.length; ++idx < len; ) {
      const value = exprNode.properties[idx]

      if (!t.isObjectProperty(value)) {
        throw new Error('evaluateAstNode can only evaluate object properties')
      }

      let key: string | number | null | undefined | boolean
      if (value.computed) {
        if (typeof evalFn !== 'function') {
          throw new Error(
            'evaluateAstNode does not support computed keys unless an eval function is provided'
          )
        }
        key = evaluateAstNode(value.key, evalFn)
      } else if (t.isIdentifier(value.key)) {
        key = value.key.name
      } else if (
        t.isStringLiteral(value.key) ||
        t.isNumberLiteral(value.key) ||
        t.isNumericLiteral(value.key)
      ) {
        key = value.key['value']
      } else {
        throw new Error('Unsupported key type: ' + value.key.type)
      }

      if (typeof key !== 'string' && typeof key !== 'number') {
        throw new Error('key must be either a string or a number')
      }

      ret[key] = evaluateAstNode(value.value, evalFn)
    }
    return ret
  }

  if (t.isArrayExpression(exprNode)) {
    return exprNode.elements.map((x) => {
      return evaluateAstNode(x as any, evalFn)
    })
  }

  if (t.isUnaryExpression(exprNode) && exprNode.operator === '-') {
    const ret = evaluateAstNode(exprNode.argument, evalFn)
    if (ret == null) {
      return null
    }
    return -ret
  }

  if (t.isTemplateLiteral(exprNode)) {
    if (typeof evalFn !== 'function') {
      throw new Error(
        'evaluateAstNode does not support template literals unless an eval function is provided'
      )
    }

    let ret: string = ''
    for (let idx = -1, len = exprNode.quasis.length; ++idx < len; ) {
      const quasi = exprNode.quasis[idx]
      const expr = exprNode.expressions[idx]
      ret += quasi.value.raw
      if (expr) {
        ret += evaluateAstNode(expr, evalFn)
      }
    }
    return ret
  }

  // In the interest of representing the "evaluated" prop
  // as the user intended, we support negative null. Why not.
  if (t.isNullLiteral(exprNode)) {
    return null
  }

  if (
    t.isNumericLiteral(exprNode) ||
    t.isStringLiteral(exprNode) ||
    t.isBooleanLiteral(exprNode)
  ) {
    // In the interest of representing the "evaluated" prop
    // as the user intended, we support negative null. Why not.
    return exprNode.value
  }

  if (t.isBinaryExpression(exprNode)) {
    if (exprNode.operator === '+') {
      return (
        evaluateAstNode(exprNode.left, evalFn) +
        evaluateAstNode(exprNode.right, evalFn)
      )
    } else if (exprNode.operator === '-') {
      return (
        evaluateAstNode(exprNode.left, evalFn) -
        evaluateAstNode(exprNode.right, evalFn)
      )
    } else if (exprNode.operator === '*') {
      return (
        evaluateAstNode(exprNode.left, evalFn) *
        evaluateAstNode(exprNode.right, evalFn)
      )
    } else if (exprNode.operator === '/') {
      return (
        evaluateAstNode(exprNode.left, evalFn) /
        evaluateAstNode(exprNode.right, evalFn)
      )
    }
  }

  // TODO: member expression?
  // console.log('what failed', exprNode)

  // if we've made it this far, the value has to be evaluated
  if (typeof evalFn !== 'function') {
    throw new Error(
      'evaluateAstNode does not support non-literal values unless an eval function is provided'
    )
  }

  return evalFn(exprNode)
}
