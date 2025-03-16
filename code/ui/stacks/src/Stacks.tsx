import type { GetProps, SizeTokens } from '@tamagui/core'
import { View, styled } from '@tamagui/core'

import { getElevation } from './getElevation'

// Base type for stacks
type BaseStackProps = GetProps<typeof View>

// Remove flexDirection from allowed props
export type YStackProps = Omit<BaseStackProps, 'flexDirection'>
export type XStackProps = Omit<BaseStackProps, 'flexDirection'>
export type ZStackProps = YStackProps

export const fullscreenStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
} as const

type Insets = {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

const getInset = (val: number | SizeTokens | Insets | null) =>
  val && typeof val === 'object'
    ? val
    : {
        top: val,
        left: val,
        bottom: val,
        right: val,
      }

const variants = {
  fullscreen: {
    true: fullscreenStyle,
  },

  elevation: {
    '...size': getElevation,
    ':number': getElevation,
  },

  inset: getInset,
} as const

/**
 * @summary A view that arranges its children in a vertical line.
 * @see — Docs https://tamagui.dev/ui/stacks#xstack-ystack-zstack
 */
export const YStack = styled(View, {
  // Set flexDirection in the style object
  flexDirection: 'column' as const,
  variants,
})

YStack['displayName'] = 'YStack'

/**
 * @summary A view that arranges its children in a horizontal line.
 * @see — Docs https://tamagui.dev/ui/stacks#xstack-ystack-zstack
 */
export const XStack = styled(View, {
  // Set flexDirection in the style object
  flexDirection: 'row' as const,
  variants,
})

XStack['displayName'] = 'XStack'

/**
 * @summary A view that stacks its children on top of each other.
 * @see — Docs https://tamagui.dev/ui/stacks#xstack-ystack-zstack
 */
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
