import { ThemeableStack } from '@tamagui/stacks'
import type { GetProps, SizeTokens } from '@tamagui/web'
import { createStyledContext, styled, withStaticProperties } from '@tamagui/web'

const CardContext = createStyledContext({
  size: '$true' as SizeTokens,
})

export const CardFrame = styled(
  ThemeableStack,
  {
    context: CardContext,

    variants: {
      unstyled: {
        false: {
          size: '$true',
          backgroundColor: '$background',
          position: 'relative',
        },
      },

      size: {
        '...size': (val, { tokens }) => {
          return {
            borderRadius: tokens.radius[val] ?? val,
          }
        },
      },
    } as const,

    defaultVariants: {
      unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
    },
  },
  {
    name: 'Card',
  }
)

export const CardHeader = styled(
  ThemeableStack,
  {
    context: CardContext,

    variants: {
      unstyled: {
        false: {
          zIndex: 10,
          backgroundColor: 'transparent',
          marginBottom: 'auto',
        },
      },

      size: {
        '...size': (val, { tokens }) => {
          return {
            padding: tokens.space[val] ?? val,
          }
        },
      },
    } as const,

    defaultVariants: {
      unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
    },
  },
  {
    name: 'CardHeader',
  }
)

export const CardFooter = styled(
  CardHeader,
  {
    variants: {
      unstyled: {
        false: {
          zIndex: 5,
          flexDirection: 'row',
          marginTop: 'auto',
          marginBottom: 0,
        },
      },
    } as const,

    defaultVariants: {
      unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
    },
  },
  {
    name: 'CardFooter',
  }
)

export const CardBackground = styled(
  ThemeableStack,
  {
    variants: {
      unstyled: {
        false: {
          zIndex: 0,
          fullscreen: true,
          overflow: 'hidden',
          pointerEvents: 'none',
          padding: 0,
        },
      },
    } as const,

    defaultVariants: {
      unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
    },
  },
  {
    name: 'CardBackground',
  }
)

export type CardHeaderProps = GetProps<typeof CardHeader>
export type CardFooterProps = GetProps<typeof CardFooter>
export type CardProps = GetProps<typeof CardFrame>

export const Card = withStaticProperties(CardFrame, {
  Header: CardHeader,
  Footer: CardFooter,
  Background: CardBackground,
})
