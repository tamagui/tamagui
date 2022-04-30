import { GetProps, isVariable, styled } from '@tamagui/core'
import React from 'react'

import { getButtonSize } from '../helpers/getButtonSize'
import { SizableStack } from './SizableStack'
import { getSizedElevation } from './Stacks'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

export const Card = styled(SizableStack, {
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
          ...getButtonSize(1, 0.9)(size, extras),
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
