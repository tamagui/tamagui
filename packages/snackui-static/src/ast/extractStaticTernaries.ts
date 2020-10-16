import generate from '@babel/generator'
import * as t from '@babel/types'
import invariant from 'invariant'

import { CacheObject } from '../types'

export interface Ternary {
  test: t.Expression
  consequent: Object | null
  alternate: Object | null
}

export type TernaryRecord = {
  test: t.Expression
  consequentStyles: Object
  alternateStyles: Object
}

export function extractStaticTernaries(
  ternaries: Ternary[],
  cacheObject: CacheObject
) {
  invariant(
    Array.isArray(ternaries),
    'extractStaticTernaries expects param 1 to be an array of ternaries'
  )
  invariant(
    typeof cacheObject === 'object' && cacheObject !== null,
    'extractStaticTernaries expects param 3 to be an object'
  )

  if (ternaries.length === 0) {
    return null
  }

  const ternariesByKey: Record<string, TernaryRecord> = {}

  for (let idx = -1, len = ternaries.length; ++idx < len; ) {
    const { test, consequent, alternate } = ternaries[idx]

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
      if (test.operator === '!==') {
        ternaryTest = t.binaryExpression('===', test.left, test.right)
        shouldSwap = true
      } else if (test.operator === '!=') {
        ternaryTest = t.binaryExpression('==', test.left, test.right)
        shouldSwap = true
      }
    }

    const key = generate(ternaryTest).code

    ternariesByKey[key] = ternariesByKey[key] || {
      alternateStyles: {},
      consequentStyles: {},
      test: ternaryTest,
    }
    const altStyle = (shouldSwap ? consequent : alternate) ?? {}
    const consStyle = (shouldSwap ? alternate : consequent) ?? {}
    Object.assign(ternariesByKey[key].alternateStyles, altStyle)
    Object.assign(ternariesByKey[key].consequentStyles, consStyle)
  }

  const ternaryExpression = Object.keys(ternariesByKey).map((key) => {
    return ternariesByKey[key]
  })

  if (!ternaryExpression) {
    return null
  }

  return ternaryExpression
}
