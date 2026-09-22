import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { expect, test } from 'vitest'

import { createTokens } from '../core/src'

test('snapshot', () => {
  expect(createTokens(getDefaultTamaguiConfig().tokens)).toMatchSnapshot()
})

test('color name no dot', () => {
  expect(
    createTokens({
      'color-yellow.10': 'yellow',
    })
  ).toMatchObject({
    'color-yellow.10': {
      isVar: true,
      key: 'color-yellow.10',
      name: 'c-yellow--10',
      val: 'yellow',
      variable: 'var(--c-yellow--10)',
    },
  })
})

test('a nested token group errors', () => {
  expect(() =>
    // @ts-expect-error tokens are flat
    createTokens({ radius: { sm: 4 } })
  ).toThrow(/nested group/)
})

test('true token keys error in development', () => {
  const originalNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'

  try {
    expect(() =>
      createTokens({
        'size-4': 44,
        'size-true': 44,
      })
    ).toThrow(/tokens\.size-true.*explicit token name/)
  } finally {
    process.env.NODE_ENV = originalNodeEnv
  }
})
