import { GetProps, createGetStackSize, styled } from '@tamagui/core'
import { ThemeableSizableStack } from '@tamagui/stacks'
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
  elevate: true,

  variants: {
    size: {
      '...size': getCardSize,
    },
  },

  defaultVariants: {
    size: '$4',
  },
})

export type CardProps = GetProps<typeof Card>
