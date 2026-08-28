process.env.TAMAGUI_TARGET = 'web'

import { expect, test } from 'vitest'

import { View, createTamagui, styled } from '../web/src'
import { getDefaultTamaguiConfig } from '../config-default'
import { simplifiedGetSplitStyles } from './utils'

createTamagui(getDefaultTamaguiConfig('web'))

const Sized = styled(View, {
  variants: {
    size: {
      big: { width: 10 },
    },
  } as const,
})

// identity derives from the slot's winning content after normalization: a
// variant's numeric width and a directly authored numeric width are the same
// rule, so they must be the same class
test('a variant numeric and a direct numeric produce one atomic identity', () => {
  const viaVariant = simplifiedGetSplitStyles(Sized, { size: 'big' })
  const direct = simplifiedGetSplitStyles(Sized, { width: 10 })
  expect(viaVariant.classNames.width).toBeTruthy()
  expect(viaVariant.classNames.width).toBe(direct.classNames.width)
})
