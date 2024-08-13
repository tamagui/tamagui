import { getButtonSized } from '@tamagui/get-button-sized'
import { SizableText } from '@tamagui/text'
import type { GetProps, SizeTokens } from '@tamagui/web'
import { createStyledContext, styled, View } from '@tamagui/web'
import { createButton } from './createButton'

type ButtonVariant = 'outlined'

export type ButtonProps = GetProps<typeof Frame>

const Frame = styled(View, {
  variants: {
    unstyled: {
      false: {
        size: '$true',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        cursor: 'pointer',
        hoverTheme: true,
        pressTheme: true,
        backgrounded: true,
        borderWidth: 1,
        borderColor: 'transparent',

        focusVisibleStyle: {
          outlineColor: '$outlineColor',
          outlineStyle: 'solid',
          outlineWidth: 2,
        },
      },
    },

    variant: {
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '$borderColor',

        hoverStyle: {
          backgroundColor: 'transparent',
          borderColor: '$borderColorHover',
        },

        pressStyle: {
          backgroundColor: 'transparent',
          borderColor: '$borderColorPress',
        },

        focusVisibleStyle: {
          backgroundColor: 'transparent',
          borderColor: '$borderColorFocus',
        },
      },
    },

    size: {
      '...size': getButtonSized,
      ':number': getButtonSized,
    },

    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const Text = styled(SizableText, {
  variants: {
    unstyled: {
      false: {
        userSelect: 'none',
        cursor: 'pointer',
        // flexGrow 1 leads to inconsistent native style where text pushes to start of view
        flexGrow: 0,
        flexShrink: 1,
        ellipse: true,
        color: '$color',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const Icon = styled(SizableText, {
  variants: {
    unstyled: {
      false: {
        userSelect: 'none',
        cursor: 'pointer',
        // flexGrow 1 leads to inconsistent native style where text pushes to start of view
        flexGrow: 0,
        flexShrink: 1,
        ellipse: true,
        color: '$color',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export const ButtonContext = createStyledContext<{
  size?: SizeTokens
  variant?: ButtonVariant
}>({
  size: undefined,
  variant: undefined,
})

export const Button = createButton<{
  size?: SizeTokens
  variant?: ButtonVariant
}>({
  Frame,
  Text,
  Icon,
  defaultVariants: {
    size: undefined,
    variant: undefined,
  },
})
