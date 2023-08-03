import * as t from '@babel/types'

// accessSafe wraps memberExpressions in object/null checks
// TODO: inject this as a function? this gets pretty repetitive
export function accessSafe(obj: t.Expression, member: string): t.LogicalExpression {
  return t.logicalExpression(
    '&&',
    t.logicalExpression(
      '&&',
      // typeof obj === 'object
      t.binaryExpression(
        '===',
        t.unaryExpression('typeof', obj),
        t.stringLiteral('object')
      ),
      // obj !== null
      t.binaryExpression('!==', obj, t.nullLiteral())
    ),
    // obj.member
    t.memberExpression(obj, t.identifier(member), false)
  )
}
