import type { GetProps } from '@tamagui/core'
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

/**
 * @summary A view that arranges its children in a vertical line.
 * @see — Docs https://tamagui.dev/ui/stacks#xstack-ystack-zstack
 */
export const YStack = styled(View, {
  flexDirection: 'column',
  variants,
})

YStack['displayName'] = 'YStack'

/**
 * @summary A view that arranges its children in a horizontal line.
 * @see — Docs https://tamagui.dev/ui/stacks#xstack-ystack-zstack
 */
export const XStack = styled(View, {
  flexDirection: 'row',
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
