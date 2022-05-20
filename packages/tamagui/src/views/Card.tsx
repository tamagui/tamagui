import { GetProps, createGetStackSize, isVariable, styled } from '@tamagui/core'
import { ThemeableSizableStack, getSizedElevation } from '@tamagui/stacks'
import React from 'react'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

const getCardSize = createGetStackSize({ sizeX: 1, sizeY: 0.9 })

export const Card = styled(ThemeableSizableStack, {
  name: 'Card',
  alignItems: 'flex-start',
  flexDirection: 'column',
  backgroundColor: '$background',
  overflow: 'hidden',

  variants: {
    size: {
      '...size': (size, extras) => {
        const { tokens } = extras
        const token = tokens.size[size]
        const sizeNum = isVariable(token) ? +token.val : size
        return {
          ...getCardSize(size, extras),
          ...getSizedElevation(sizeNum, extras),
        }
      },
    },
  },

  defaultVariants: {
    size: '$4',
  },
})

export type CardProps = GetProps<typeof Card>
