import { getButtonSized } from '@tamagui/get-button-sized'
import { withStaticProperties } from '@tamagui/helpers'
import { SizableText } from '@tamagui/text'
import type { GetProps, SizeTokens } from '@tamagui/web'
import { createStyledContext, styled, View } from '@tamagui/web'

type ButtonVariant = 'outlined'

// export const example = (
//   <Button>
//     <Button.Group
//     // can put shared styles here
//     >
//       <Button.Icon />
//       <Button.Text />
//     </Button.Group>
//   </Button>
// )

export const ButtonContext = createStyledContext<{
  size?: SizeTokens
  variant?: ButtonVariant
}>({
  size: undefined,
  variant: undefined,
})

export type ButtonProps = GetProps<typeof ButtonFrame>

// keep all under the same name so themed together
const BUTTON_NAME = 'Button'

export const ButtonFrame = styled(View, {
  name: BUTTON_NAME,
  tag: 'button',
  role: 'button',

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

export const ButtonText = styled(SizableText, {
  name: BUTTON_NAME,

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

export const ButtonIcon = styled(SizableText, {
  name: BUTTON_NAME,

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

export const Button = withStaticProperties(ButtonFrame, {
  Text: ButtonText,
  Icon: ButtonIcon,
})
