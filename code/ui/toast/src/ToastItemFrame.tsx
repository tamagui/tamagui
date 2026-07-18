/**
 * Structural (unstyled) frames for toast items — the behavior-first primitives.
 * Shared across web and native — imported by ToastComposable.
 *
 * These keep ONLY the structural allowlist (layout, hit targets, positioning,
 * cursor/userSelect, native `render:'button'`). The v2-look skin (background,
 * border, radius, padding, shadow, hover/press/focus color styling, text color)
 * lives in the tamagui skin (code/ui/tamagui/src/components/Toast.tsx), which is
 * also the shadcn registry source.
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
 * ToastItemFrame - structural frame for the toast card (the visual skin lives in
 * the tamagui Toast skin).
 * -----------------------------------------------------------------------------------------------*/

export const ToastItemFrame = styled(YStack, {
  name: 'ToastItem',
  userSelect: 'none',
  cursor: 'default',
  tabIndex: 0,
})

/* -------------------------------------------------------------------------------------------------
 * ToastCloseFrame - structural button (layout + hit target only).
 * -----------------------------------------------------------------------------------------------*/

export const ToastCloseFrame = styled(XStack, {
  name: 'ToastClose',
  render: 'button',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  width: 18,
  height: 18,
})

/* -------------------------------------------------------------------------------------------------
 * ToastActionFrame - structural button for action/cancel buttons with text.
 * -----------------------------------------------------------------------------------------------*/

export const ToastActionFrame = styled(XStack, {
  name: 'ToastAction',
  render: 'button',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  height: 24,
})

/* -------------------------------------------------------------------------------------------------
 * DefaultCloseIcon - dependency-free glyph (inherits color; the skin sets it).
 * -----------------------------------------------------------------------------------------------*/

export const DefaultCloseIcon = () => <SizableText size="$1">✕</SizableText>
