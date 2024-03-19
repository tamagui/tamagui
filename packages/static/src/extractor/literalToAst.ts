import * as t from '@babel/types'

export function literalToAst(literal: any): t.Expression {
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
            return t.objectProperty(t.stringLiteral(k), literalToAst(literal[k]))
          })
      )
  }
}

const easyPeasies = ['BooleanLiteral', 'StringLiteral', 'NumericLiteral']

export function astToLiteral(node: any) {
  if (!node) {
    return
  }
  if (easyPeasies.includes(node.type)) {
    return node.value
  }
  if (node.name === 'undefined' && !node.value) {
    return undefined
  }
  if (t.isNullLiteral(node)) {
    return null
  }
  if (t.isObjectExpression(node)) {
    return computeProps(node.properties)
  }
  if (t.isArrayExpression(node)) {
    return node.elements.reduce(
      // @ts-ignore
      (acc, element) => [
        ...acc,
        ...(element?.type === 'SpreadElement'
          ? astToLiteral(element.argument)
          : [astToLiteral(element)]),
      ],
      []
    )
  }
}

function computeProps(props) {
  return props.reduce((acc, prop) => {
    if (prop.type === 'SpreadElement') {
      return {
        ...acc,
        ...astToLiteral(prop.argument),
      }
    }
    if (prop.type !== 'ObjectMethod') {
      const val = astToLiteral(prop.value)
      if (val !== undefined) {
        return {
          ...acc,
          [prop.key.name]: val,
        }
      }
    }
    return acc
  }, {})
}
