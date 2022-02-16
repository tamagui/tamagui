import { GetProps, styled } from '@tamagui/core'
import React from 'react'

import { SizableFrame } from './SizableFrame'

export const Circle = styled(SizableFrame, {
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 100_000_000,
  overflow: 'hidden',

  variants: {
    size: {
      '...size': (size, { tokens }) => {
        return {
          width: tokens.size[size] ?? size,
          height: tokens.size[size] ?? size,
        }
      },
    },
  },
})

export type CircleProps = GetProps<typeof Circle>

// test types
// const a = <Circle size={100} />
// const b = <Circle size="sm" />
// const c = <Circle size="nope" />
