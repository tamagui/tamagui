import type { GetProps } from '@tamagui/style'
import { View, styled } from '@tamagui/style'

export interface StackVariants {}

export type YStackProps = GetProps<typeof YStack>
export type XStackProps = YStackProps
export type ZStackProps = YStackProps

/**
 * @summary A view that arranges its children in a vertical line.
 * @see — Docs https://tamagui.dev/ui/stacks#xstack-ystack-zstack
 */
export const YStack = styled(View, {
  flexDirection: 'column',
})

YStack['displayName'] = 'YStack'

/**
 * @summary A view that arranges its children in a horizontal line.
 * @see — Docs https://tamagui.dev/ui/stacks#xstack-ystack-zstack
 */
export const XStack = styled(View, {
  flexDirection: 'row',
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
