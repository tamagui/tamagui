import generate from '@babel/generator'
import * as t from '@babel/types'

import { accessSafe } from './accessSafe'

/**
 * getPropValueFromAttributes gets a prop by name from a list of attributes and accounts for potential spread operators.
 * Here's an example. Given this component:
 * ```
 * <Block coolProp="wow" {...spread1} neatProp="ok" {...spread2} />```
 * getPropValueFromAttributes will return the following:
 * - for propName `coolProp`:
 *   ```
 * accessSafe(spread1, 'coolProp') || accessSafe(spread2, 'coolProp') || 'wow'```
 * - for propName `neatProp`:
 *   ```
 * accessSafe(spread2, 'neatProp') || 'ok'```
 * - for propName `notPresent`: `null`
 *
 * The returned value should (obviously) be placed after spread operators.
 */
export function getPropValueFromAttributes(
  propName: string,
  attrs: (t.JSXAttribute | t.JSXSpreadAttribute)[]
): t.Expression | null {
  let propIndex = -1
  let jsxAttr: t.JSXAttribute | null = null
  for (let idx = -1, len = attrs.length; ++idx < len; ) {
    const attr = attrs[idx]
    if (t.isJSXAttribute(attr) && attr.name && attr.name.name === propName) {
      propIndex = idx
      jsxAttr = attr
      break
    }
  }

  if (!jsxAttr || jsxAttr.value == null) {
    return null
  }

  let propValue:
    | t.JSXElement
    | t.JSXFragment
    | t.StringLiteral
    | t.JSXExpressionContainer
    | t.JSXEmptyExpression
    | t.Expression = jsxAttr.value

  if (t.isJSXExpressionContainer(propValue)) {
    propValue = propValue.expression
  }

  // TODO how to handle this??
  if (t.isJSXEmptyExpression(propValue)) {
    console.error('encountered JSXEmptyExpression')
    return null
  }

  // filter out spread props that occur before propValue
  const applicableSpreads = attrs
    .filter(
      // 1. idx is greater than propValue prop index
      // 2. attr is a spread operator
      (attr, idx): attr is t.JSXSpreadAttribute => {
        if (t.isJSXSpreadAttribute(attr)) {
          if (t.isIdentifier(attr.argument) || t.isMemberExpression(attr.argument)) {
            return idx > propIndex
          }
          if (t.isLogicalExpression(attr.argument)) {
            return false
          }
          throw new Error(
            `unsupported spread of type "${attr.argument.type}": ${
              // @ts-ignore
              generate(attr as any).code
            }`
          )
        }
        return false
      }
    )
    .map((attr) => attr.argument)

  // if spread operators occur after propValue, create a binary expression for each operator
  // i.e. before1.propValue || before2.propValue || propValue
  // TODO: figure out how to do this without all the extra parens
  if (applicableSpreads.length > 0) {
    propValue = applicableSpreads.reduce<t.Expression>(
      (acc, val) => t.logicalExpression('||', accessSafe(val, propName), acc),
      propValue
    )
  }

  return propValue
}
