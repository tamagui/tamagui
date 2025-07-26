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
