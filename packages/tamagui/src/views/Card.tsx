import { isVariable, styled } from '@tamagui/core'
import React from 'react'

import { SizableFrame, getSize } from './SizableFrame'
import { getSizedElevation } from './Stacks'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

export const Card = styled(SizableFrame, {
  alignItems: 'flex-start',
  flexDirection: 'column',
  backgroundColor: '$bg',
  overflow: 'hidden',

  variants: {
    size: {
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
