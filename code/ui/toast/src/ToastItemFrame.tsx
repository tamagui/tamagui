/**
 * Shared visual styled components for toast items.
 * Used by both web (ToastComposable) and native (ToastItemInner.native) implementations.
 */

import { styled } from '@tamagui/core'
import { XStack, YStack } from '@tamagui/stacks'
import { SizableText } from '@tamagui/text'

/* -------------------------------------------------------------------------------------------------
 * ToastPositionWrapper - handles absolute positioning and stacking animations
 * On web: uses Tamagui transition/enterStyle/exitStyle
 * On native: replaced by Animated.View with useAnimatedStyle
 * -----------------------------------------------------------------------------------------------*/

export const ToastPositionWrapper = styled(YStack, {
  name: 'ToastPositionWrapper',
  pointerEvents: 'auto',
  position: 'absolute',
  left: 0,
  right: 0,
  opacity: 1,
  scale: 1,
  y: 0,
  x: 0,
})

/* -------------------------------------------------------------------------------------------------
 * ToastItemFrame - visual styling for the toast
 * Shared across web and native — the visual appearance of the toast card.
 * -----------------------------------------------------------------------------------------------*/

export const ToastItemFrame = styled(YStack, {
  name: 'ToastItem',
  userSelect: 'none',
  cursor: 'default',
  focusable: true,

  variants: {
    unstyled: {
      false: {
        backgroundColor: '$background',
        borderRadius: '$5',
        paddingHorizontal: '$3',
        paddingVertical: '$2.5',
        borderWidth: 1,
        borderColor: '$borderColor',
        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        focusVisibleStyle: {
          outlineWidth: 2,
          outlineColor: '$color8',
          outlineStyle: 'solid',
        },
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

/* -------------------------------------------------------------------------------------------------
 * ToastCloseButton
 * -----------------------------------------------------------------------------------------------*/

export const ToastCloseButton = styled(XStack, {
  name: 'ToastClose',
  render: 'button',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',

  variants: {
    unstyled: {
      false: {
        width: 18,
        height: 18,
        borderRadius: '$10',
        backgroundColor: '$background',
        borderWidth: 1,
        borderColor: '$borderColor',
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        hoverStyle: { backgroundColor: '$color3' },
        pressStyle: { backgroundColor: '$color4' },
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

/* -------------------------------------------------------------------------------------------------
 * ToastActionButton - for action/cancel buttons with text
 * -----------------------------------------------------------------------------------------------*/

export const ToastActionFrame = styled(XStack, {
  name: 'ToastActionButton',
  render: 'button',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',

  variants: {
    unstyled: {
      false: {
        borderRadius: '$2',
        paddingHorizontal: '$2',
        height: 24,
        backgroundColor: '$color5',
        hoverStyle: { backgroundColor: '$color6' },
        pressStyle: { backgroundColor: '$color7' },
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

/* -------------------------------------------------------------------------------------------------
 * DefaultCloseIcon
 * -----------------------------------------------------------------------------------------------*/

export const DefaultCloseIcon = () => (
  <SizableText size="$1" color="$color11">
    ✕
  </SizableText>
)
