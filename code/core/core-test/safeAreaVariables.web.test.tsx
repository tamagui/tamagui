import { StyleObjectValue } from '@tamagui/helpers'
import { safeAreaVariableNames } from '@tamagui/style-grammar/runtime'
import { beforeAll, expect, test } from 'vitest'

import config from '../config-default'
import { View, createTamagui } from '../web/src'
import { findRule, simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

test.each([
  ['paddingTop', safeAreaVariableNames.top, 'env(safe-area-inset-top)'],
  ['paddingRight', safeAreaVariableNames.right, 'env(safe-area-inset-right)'],
  ['paddingBottom', safeAreaVariableNames.bottom, 'env(safe-area-inset-bottom)'],
  ['paddingLeft', safeAreaVariableNames.left, 'env(safe-area-inset-left)'],
])('%s resolves %s through the built-in length namespace', (property, value, env) => {
  const styles = simplifiedGetSplitStyles(View, { [property]: value })

  expect(findRule(styles.rulesToInsert, property)[StyleObjectValue]).toBe(env)
})

test('literal CSS math containing the platform env stays intact', () => {
  const value = 'calc(env(safe-area-inset-top) + 16px)'
  const styles = simplifiedGetSplitStyles(View, { paddingTop: value })

  expect(findRule(styles.rulesToInsert, 'paddingTop')[StyleObjectValue]).toBe(value)
})
