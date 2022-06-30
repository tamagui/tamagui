import {
  GetProps,
  SizeTokens,
  isTamaguiElement,
  styled,
  themeable,
  withStaticProperties,
} from '@tamagui/core'
import { ScopedProps, createContextScope } from '@tamagui/create-context'
import { ThemeableStack } from '@tamagui/stacks'
import React, { cloneElement, forwardRef } from 'react'
import { View } from 'react-native'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

const CARD_NAME = 'CARD'

type CardContextValue = {
  size?: SizeTokens
}

const [createCardContext, createCardScope] = createContextScope(CARD_NAME)
const [CardProvider, useCardContext] = createCardContext<CardContextValue>(CARD_NAME)

export const CardFrame = styled(ThemeableStack, {
  name: 'Card',
  backgroundColor: '$background',
  position: 'relative',
  overflow: 'hidden',

  variants: {
    size: {
      '...size': (val, { tokens }) => {
        return {
          borderRadius: tokens.radius[val] ?? val,
        }
      },
    },
  },

  defaultVariants: {
    size: '$4',
  },
})

export const CardHeader = styled(ThemeableStack, {
  name: 'CardHeader',
  zIndex: 10,
  backgroundColor: 'transparent',
  marginBottom: 'auto',

  variants: {
    size: {
      '...size': (val, { tokens }) => {
        return {
          padding: tokens.space[val] ?? val,
        }
      },
    },
  },
})

export const CardFooter = styled(CardHeader, {
  name: 'CardFooter',
  zIndex: 5,
  flexDirection: 'row',
  marginTop: 'auto',
  marginBottom: 0,
})

export const CardBackground = styled(ThemeableStack, {
  name: 'CardBackground',
  zIndex: 0,
  fullscreen: true,
  overflow: 'hidden',
  pointerEvents: 'none',
  padding: 0,
})

export type CardHeaderProps = GetProps<typeof CardHeader>
export type CardFooterProps = GetProps<typeof CardFooter>

export type CardProps = GetProps<typeof CardFrame>

export const Card = withStaticProperties(
  CardFrame.extractable(
    themeable(
      forwardRef<HTMLElement | View, ScopedProps<CardProps, 'Card'>>(
        ({ size, __scopeCard, children, ...props }, ref) => {
          return (
            <CardProvider scope={__scopeCard} size={size}>
              <CardFrame ref={ref} {...props}>
                {React.Children.map(children, (child) => {
                  if (isTamaguiElement(child) && !child.props.size) {
                    return cloneElement(child, {
                      size,
                    })
                  }
                  return child
                })}
              </CardFrame>
            </CardProvider>
          )
        }
      )
    )
  ),
  {
    Header: CardHeader,
    Footer: CardFooter,
    Background: CardBackground,
  }
)

export { createCardScope, useCardContext }
