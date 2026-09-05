process.env.TAMAGUI_TARGET = 'web'

import { expect, test } from 'vitest'

import { View, createTamagui, styled } from '../web/src'
import { getDefaultTamaguiConfig } from '../config-default'
import { getStyleValue, simplifiedGetSplitStyles } from './utils'

createTamagui(getDefaultTamaguiConfig('web'))

const Sized = styled(View, {
  variants: {
    size: {
      big: { width: 10 },
    },
  } as const,
})

test('a variant numeric and a direct numeric produce the same declaration', () => {
  const viaVariant = simplifiedGetSplitStyles(Sized, { size: 'big' })
  const direct = simplifiedGetSplitStyles(Sized, { width: 10 })
  expect(getStyleValue(viaVariant, 'width')).toBe('10px')
  expect(getStyleValue(direct, 'width')).toBe('10px')
})
