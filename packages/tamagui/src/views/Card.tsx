import { isVariable, styled } from '@tamagui/core'
import React from 'react'

import { getSize } from '../helpers/getSize'
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
      // TODO add `elevated` boolean
      // + elevatedHover ?
      '...size': (size, extras) => {
        const { tokens, theme } = extras
        const token = tokens.size[size]
        const sizeNum = isVariable(token) ? +token.val : size
        return {
          ...getSize(1, 0.9)(size, extras),
          ...getSizedElevation(sizeNum, extras),
        }
      },
    },
  },
})
