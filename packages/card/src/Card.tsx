import { GetProps, SizeTokens, styled, withStaticProperties } from '@tamagui/core'
import { ScopedProps, createContextScope } from '@tamagui/create-context'
import { ThemeableSizableStack } from '@tamagui/stacks'
import React, { forwardRef } from 'react'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

const CARD_NAME = 'CARD'

type CardContextValue = {
  size?: SizeTokens
}

export const [createCardContext, createCardScope] = createContextScope(CARD_NAME)
const [CardProvider, useCardContext] = createCardContext<CardContextValue>(CARD_NAME)

export type CardProps = GetProps<typeof CardFrame>

const CardFrame = styled(ThemeableSizableStack, {
  name: 'Card',
  flexDirection: 'column',
  backgroundColor: '$background',

  variants: {
    size: {
      '...size': (val, { tokens }) => {
        return {
          borderRadius: tokens.size[val] ?? val,
        }
      },
    },
  },

  defaultVariants: {
    size: '$4',
  },
})

const CardHeader = styled(ThemeableSizableStack, {
  name: 'CardHeader',
  backgroundColor: 'transparent',
  flexDirection: 'row',
  marginBottom: 'auto',
})

const CardFooter = styled(ThemeableSizableStack, {
  name: 'CardFooter',
  backgroundColor: 'transparent',
  flexDirection: 'row',
  marginTop: 'auto',
})

const CardBackground = styled(ThemeableSizableStack, {
  name: 'CardBackground',
  zIndex: 0,
  fullscreen: true,
  pointerEvents: 'none',
})

export type CardHeaderProps = GetProps<typeof CardHeader>
export type CardFooterProps = GetProps<typeof CardFooter>

export const Card = withStaticProperties(
  forwardRef(({ size, __scopeCard, ...props }: ScopedProps<CardProps, 'Card'>) => {
    return (
      <CardProvider scope={__scopeCard} size={size}>
        <CardFrame {...props} />
      </CardProvider>
    )
  }),
  {
    Header: CardHeader,
    Footer: CardFooter,
    Background: CardBackground,
  }
)

export { useCardContext, CardHeader, CardFooter, CardBackground }
