import { GetProps, SizeVariantSpreadFunction, styled } from '@tamagui/core'

import { SizableStack, SizableStackProps } from './SizableStack'

export const getSquareSize: SizeVariantSpreadFunction<SizableStackProps> = (size, { tokens }) => {
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
}

export const Square = styled(SizableStack, {
  name: 'Square',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',

  variants: {
    size: {
      '...size': getSquareSize,
    },
  },
})

export type SquareProps = GetProps<typeof Square>

// test types
// const a = <Square size={100} />
// const b = <Square size="$1" />
// const c = <Square size="nope" />
