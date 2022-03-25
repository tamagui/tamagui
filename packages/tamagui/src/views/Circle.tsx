import { GetProps, styled } from '@tamagui/core'

import { SizableFrame } from './SizableFrame'

export const Circle = styled(SizableFrame, {
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 100_000_000,
  overflow: 'hidden',

  variants: {
    size: {
      '...size': (size, { tokens }) => {
        const width = tokens.size[size] ?? size
        const height = tokens.size[size] ?? size
        return {
          width,
          height,
          minWidth: width,
          maxWidth: width,
          maxHeight: height,
          minHeight: height,
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
