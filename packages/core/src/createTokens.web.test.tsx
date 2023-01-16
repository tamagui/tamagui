import { getDefaultTamaguiConfig } from '@tamagui/config-default-node'
import { expect, test } from 'vitest'

import { createTokens } from './createTokens'

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
        key: 'yellow101a',
        name: 'color-1',
        val: 'yellow',
        variable: 'var(--color-1)',
      },
    },
  })
})
