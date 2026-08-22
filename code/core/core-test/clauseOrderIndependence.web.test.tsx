process.env.TAMAGUI_TARGET = 'web'

import { describe, expect, test } from 'vitest'

import { View, createTamagui } from '../web/src'
import { getDefaultTamaguiConfig } from '../config-default'
import { simplifiedGetSplitStyles } from './utils'

createTamagui(getDefaultTamaguiConfig('web'))

// index 4 of a StyleObject is the emitted CSS, which is where the condition lives
const cssFor = (props: Record<string, any>) =>
  Object.values(simplifiedGetSplitStyles(View, props).rulesToInsert ?? {}).flatMap(
    (rule: any) => rule[4] ?? []
  )

// strip the generated atomic identifier so two values that differ only by hash compare equal
const shape = (css: string[]) => css.map((rule) => rule.replace(/_bc-\d+/g, '_bc'))

describe('clause order inside a value', () => {
  test('writing a clause later does not make it win', () => {
    // props-level precedence is authored order, but clauses inside one value are
    // ordered by the precedence comparator: state outranks media whichever way
    // round they are written, so both spellings must emit the same cascade
    expect(shape(cssFor({ bg: 'red hover:blue sm:green' }))).toEqual(
      shape(cssFor({ bg: 'red sm:green hover:blue' }))
    )
  })

  test('state is emitted after media so it wins the cascade', () => {
    expect(shape(cssFor({ bg: 'red hover:blue sm:green' }))).toEqual([
      '._bc{background-color:red}',
      '@media (max-width: 800px) {._bc._bc{background-color:green}}',
      '@media (hover: hover) {._bc:hover{background-color:blue}}',
    ])
  })

  test('native-only platform clauses contribute nothing on web', () => {
    expect(shape(cssFor({ bg: 'red ios:blue native:green' }))).toEqual([
      '._bc{background-color:red}',
    ])
  })
})
