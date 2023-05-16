import { ScopedProps } from '@tamagui/create-context'
import { ThemeableStack } from '@tamagui/stacks'
import {
  GetProps,
  TamaguiElement,
  isTamaguiElement,
  styled,
  withStaticProperties,
} from '@tamagui/web'
import React, { cloneElement, forwardRef } from 'react'

export const CardFrame = styled(ThemeableStack, {
  name: 'Card',

  variants: {
    unstyled: {
      false: {
        size: '$true',
        backgroundColor: '$background',
        position: 'relative',
        overflow: 'hidden',
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
    unstyled: false,
  },
})

export const CardHeader = styled(ThemeableStack, {
  name: 'CardHeader',

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
    unstyled: false,
  },
})

export const CardFooter = styled(CardHeader, {
  name: 'CardFooter',

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
    unstyled: false,
  },
})

export const CardBackground = styled(ThemeableStack, {
  name: 'CardBackground',

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
    unstyled: false,
  },
})

export type CardHeaderProps = GetProps<typeof CardHeader>
export type CardFooterProps = GetProps<typeof CardFooter>
export type CardProps = GetProps<typeof CardFrame>

export const Card = withStaticProperties(
  CardFrame.styleable<CardProps>(
    forwardRef<TamaguiElement, ScopedProps<CardProps, 'Card'>>(
      ({ __scopeCard, children, ...props }, ref) => {
        return (
          <CardFrame ref={ref} {...props}>
            {React.Children.map(children, (child) => {
              // @ts-ignore
              if (isTamaguiElement(child) && !child.props.size) {
                return cloneElement(child, {
                  size: props.size,
                })
              }
              return child
            })}
          </CardFrame>
        )
      }
    )
  ),
  {
    Header: CardHeader,
    Footer: CardFooter,
    Background: CardBackground,
  }
)
