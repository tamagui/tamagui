import type { GetProps, SizeTokens } from '@tamagui/core'
import { View, styled } from '@tamagui/core'

import { getElevation } from './getElevation'

export type YStackProps = GetProps<typeof YStack>

export type XStackProps = YStackProps
export type ZStackProps = YStackProps

export const fullscreenStyle = {
  position: 'absolute',
  inset: 0,
} as const

const variants = {
  fullscreen: {
    true: fullscreenStyle,
  },

  elevation: {
    '...size': getElevation,
    ':number': getElevation,
  },
} as const

// compat with older react native versions
if (process.env.TAMAGUI_TARGET === 'native') {
  type Insets = {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }

  const getInset = (val: number | SizeTokens | Insets) =>
    val && typeof val === 'object'
      ? val
      : {
          top: val,
          left: val,
          bottom: val,
          right: val,
        }

  variants['inset'] = getInset
}

export const YStack = styled(View, {
  flexDirection: 'column',
  variants,
})

YStack['displayName'] = 'YStack'

export const XStack = styled(View, {
  flexDirection: 'row',
  variants,
})

XStack['displayName'] = 'XStack'

export const ZStack = styled(
  YStack,
  {
    position: 'relative',
  },
  {
    neverFlatten: true,
    isZStack: true,
  }
)

ZStack['displayName'] = 'ZStack'
