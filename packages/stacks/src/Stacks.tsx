import { GetProps, Stack, styled } from '@tamagui/core'

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
  },
} as const

export const YStack = styled(Stack, {
  name: 'YStack',
  flexDirection: 'column',
  variants,
})

export const XStack = styled(Stack, {
  name: 'XStack',
  flexDirection: 'row',
  variants,
})

export const ZStack = styled(
  YStack,
  {
    name: 'ZStack',
    position: 'relative',
  },
  {
    neverFlatten: true,
    isZStack: true,
  }
)
