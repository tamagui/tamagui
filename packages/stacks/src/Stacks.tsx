import { GetProps, View, styled } from '@tamagui/core'

import { getElevation } from './getElevation'

export type YStackProps = GetProps<typeof YStack>

export type XStackProps = YStackProps
export type ZStackProps = YStackProps

export const fullscreenStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
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
