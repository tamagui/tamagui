import type { GetProps } from '@tamagui/core'
import { styled } from '@tamagui/core'

import { YStack } from './Stacks'

import { bordered, circular, elevate } from './variants'

const chromelessStyle = {
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  shadowColor: 'transparent',

  hoverStyle: {
    borderColor: 'transparent',
  },
}

const outlinedStyle = {
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: '$borderColor',

  hoverStyle: {
    backgroundColor: 'transparent',
    borderColor: '$borderColorHover',
  },

  pressStyle: {
    backgroundColor: 'transparent',
    borderColor: '$borderColorPress',
  },
}

export const themeableVariantStyles = {
  outlined: outlinedStyle,
} as const

export const themeableVariants = {
  circular,
  elevate,

  bordered: {
    true: bordered,
  },

  transparent: {
    true: {
      backgroundColor: 'transparent',
    },
  },

  chromeless: {
    true: chromelessStyle,
    all: {
      ...chromelessStyle,
      hoverStyle: chromelessStyle,
      pressStyle: chromelessStyle,
      focusStyle: chromelessStyle,
    },
  },
} as const

/**
 * @deprecated v3 no longer uses ThemeableStack in its behavior packages. Kept as
 * a compat shim for external consumers. Prefer `styled(YStack, { … })` or the
 * copied Surface fixture + facets.
 */
export const ThemeableStack = styled(YStack, {
  variants: themeableVariants,
})

export type ThemeableStackProps = GetProps<typeof ThemeableStack>
