import { GetProps, Stack, isVariable, styled } from '@tamagui/core'

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
        const token = tokens.size[size]
        const [height, shadowRadius] = (() => {
          if (isVariable(token)) {
            return [+token.val / 3, +token.val / 2] as const
          }
          return [size / 3, size / 2] as const
        })().map((x) => Math.round(x))
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

// these are all the same, really:
// we'll override core StackProps first
export type StackProps = GetProps<typeof YStack>
export type YStackProps = StackProps
export type XStackProps = StackProps
export type ZStackProps = StackProps
