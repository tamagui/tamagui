import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { expect, test } from 'vitest'

import { createTokens } from '../core/src'

test('snapshot', () => {
  expect(createTokens(getDefaultTamaguiConfig().tokens)).toMatchSnapshot()
})

test('color name no dot', () => {
  expect(
    // @ts-ignore partial
    createTokens({
      color: {
        'yellow.10': 'yellow',
      },
    })
  ).toMatchObject({
    color: {
      'yellow.10': {
        isVar: true,
        key: '$yellow.10',
        name: 'c-yellow--10',
        val: 'yellow',
        variable: 'var(--c-yellow--10)',
      },
    },
  })
})

test('true token keys error in development', () => {
  const originalNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'

  try {
    expect(() =>
      createTokens({
        size: {
          4: 44,
          true: 44,
        },
      })
    ).toThrow(/tokens\.size\.true.*settings\.defaultSize/)

    const prefixedTrueKey = `$${'true'}`

    expect(() =>
      createTokens({
        radius: {
          4: 9,
          [prefixedTrueKey]: 9,
        },
      })
    ).toThrow(
      new RegExp(`tokens\\.radius\\.\\${prefixedTrueKey}.*settings\\.defaultSize`)
    )
  } finally {
    process.env.NODE_ENV = originalNodeEnv
  }
})
