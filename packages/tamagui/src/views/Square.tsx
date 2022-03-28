import { GetProps, styled } from '@tamagui/core'

import { SizableFrame } from './SizableFrame'

export const Square = styled(SizableFrame, {
  borderRadius: '$0',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  paddingHorizontal: 0,
  paddingVertical: 0,

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

export type SquareProps = GetProps<typeof Square>

// test types
// const a = <Square size={100} />
// const b = <Square size="$1" />
// const c = <Square size="nope" />
