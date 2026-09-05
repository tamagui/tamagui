import { StyleObjectValue } from '@tamagui/helpers'
import { safeAreaVariableNames } from '@tamagui/style-grammar/runtime'
import { render } from '@testing-library/react'
import React from 'react'
import { beforeAll, expect, test } from 'vitest'

import config from '../config-default'
import { TamaguiProvider, View, createTamagui } from '../web/src'
import { findRule, simplifiedGetSplitStyles } from './utils'

let tamaguiConfig: ReturnType<typeof createTamagui>

beforeAll(() => {
  tamaguiConfig = createTamagui(config.getDefaultTamaguiConfig())
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

test('safe-area values do not force a second commit on web mount', () => {
  let commits = 0

  render(
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <React.Profiler
        id="safe-area"
        onRender={() => {
          commits++
        }}
      >
        <View disableClassName paddingTop={safeAreaVariableNames.top} />
      </React.Profiler>
    </TamaguiProvider>
  )

  expect(commits).toBe(1)
})
