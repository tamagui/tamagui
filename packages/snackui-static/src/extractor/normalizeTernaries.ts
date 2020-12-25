import generate from '@babel/generator'
import * as t from '@babel/types'
import invariant from 'invariant'

import { Ternary } from '../types'

export function normalizeTernaries(ternaries: Ternary[]) {
  invariant(
    Array.isArray(ternaries),
    'extractStaticTernaries expects param 1 to be an array of ternaries'
  )

  if (ternaries.length === 0) {
    return null
  }

  const ternariesByKey: { [key: string]: Ternary } = {}

  for (let idx = -1, len = ternaries.length; ++idx < len; ) {
    const { test, consequent, alternate, remove } = ternaries[idx]

    let ternaryTest = test

    // strip parens
    if (t.isExpressionStatement(test)) {
      ternaryTest = (test as any).expression
    }

    // convert `!thing` to `thing` with swapped consequent and alternate
    let shouldSwap = false
    if (t.isUnaryExpression(test) && test.operator === '!') {
      ternaryTest = test.argument
      shouldSwap = true
    } else if (t.isBinaryExpression(test)) {
      if (test.operator === '!==' || test.operator === '!=') {
        ternaryTest = t.binaryExpression(test.operator, test.left, test.right)
        shouldSwap = true
      }
    }

    const key = generate(ternaryTest).code

    if (!ternariesByKey[key]) {
      ternariesByKey[key] = {
        alternate: {},
        consequent: {},
        test: ternaryTest,
        remove,
      }
    }
    const altStyle = (shouldSwap ? consequent : alternate) ?? {}
    const consStyle = (shouldSwap ? alternate : consequent) ?? {}
    Object.assign(ternariesByKey[key].alternate, altStyle)
    Object.assign(ternariesByKey[key].consequent, consStyle)
  }

  const ternaryExpression = Object.keys(ternariesByKey).map((key) => {
    return ternariesByKey[key]
  })

  if (!ternaryExpression) {
    return null
  }

  return ternaryExpression
}
