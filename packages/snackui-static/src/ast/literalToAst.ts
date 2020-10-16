import * as t from '@babel/types'

export function literalToAst(literal: any) {
  if (literal === null) {
    return t.nullLiteral()
  }
  switch (typeof literal) {
    case 'function':
      throw new Error('Unsupported')
    case 'number':
      return t.numericLiteral(literal)
    case 'string':
      return t.stringLiteral(literal)
    case 'boolean':
      return t.booleanLiteral(literal)
    case 'undefined':
      return t.unaryExpression('void', t.numericLiteral(0), true)
    default:
      if (Array.isArray(literal)) {
        return t.arrayExpression(literal.map(literalToAst))
      }
      return t.objectExpression(
        Object.keys(literal)
          .filter((k) => {
            return typeof literal[k] !== 'undefined'
          })
          .map((k) => {
            return t.objectProperty(
              t.stringLiteral(k),
              literalToAst(literal[k])
            )
          })
      )
  }
}
