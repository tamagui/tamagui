import { Stack, styled } from '@tamagui/core'

export const YStack = styled(Stack, {
  flexDirection: 'column',

  variants: {
    fullscreen: {
      true: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    },

    elevation: {
      '...size': (size, { tokens, theme }) => {
        const [shadowRadius, height] = (() => {
          const val = tokens.size[size]
          if (val) {
            const sizeKeys = Object.keys(tokens.size)
            const valIndex = sizeKeys.indexOf(size)
            const nextSizeUp = tokens.size[sizeKeys[valIndex + 1]]
            return [val, nextSizeUp] as const
          }
          return [size, size / 2] as const
        })()
        const shadow = {
          shadowColor: theme.shadowColor,
          shadowRadius,
          shadowOffset: { height, width: 0 },
        }
        return shadow
      },
    },
  },
})

export const XStack = styled(YStack, {
  flexDirection: 'row',
})

export const ZStack = styled(
  YStack,
  {
    position: 'relative',
  },
  {
    neverFlatten: true,
    isZStack: true,
  }
)
