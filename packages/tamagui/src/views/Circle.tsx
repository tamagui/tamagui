import { Stack, styled } from '@tamagui/core'

export const Circle = styled(Stack, {
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

// test types
// const a = <Circle size={100} />
// const b = <Circle size="sm" />
// const c = <Circle size="nope" />
