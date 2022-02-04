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
        const base = isVariable(token) ? +token.val : size
        console.log('base', base)
        const [height, shadowRadius] = [base / 3 + 10, base / 2 + 10]
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
