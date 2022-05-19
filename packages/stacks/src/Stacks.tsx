import {
  GetProps,
  SizeTokens,
  SizeVariantSpreadFunction,
  Stack,
  StackProps,
  VariantSpreadExtras,
  getVariableValue,
  isVariable,
  styled,
} from '@tamagui/core'

export type YStackProps = GetProps<typeof YStack>
export type XStackProps = GetProps<typeof YStack>
export type ZStackProps = GetProps<typeof ZStack>

export const getElevation: SizeVariantSpreadFunction<StackProps> = (size, extras) => {
  const { tokens } = extras
  const token = tokens.size[size]
  const sizeNum = (isVariable(token) ? +token.val : size) as number
  // TODO this could be configurable with require('tamagui').configure({ elevation: () => {} })
  return getSizedElevation(sizeNum, extras)
}

const fullscreenStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
} as const

export const YStack = styled(Stack, {
  flexDirection: 'column',
  name: 'YStack',
  variants: {
    fullscreen: {
      true: fullscreenStyle,
    },
    elevation: {
      '...size': getElevation,
    },
  },
})

export const XStack = styled(Stack, {
  flexDirection: 'row',
  name: 'XStack',
  variants: {
    fullscreen: {
      true: fullscreenStyle,
    },
    elevation: {
      '...size': getElevation,
    },
  },
})

export const ZStack = styled(
  YStack,
  {
    name: 'ZStack',
    position: 'relative',
  },
  {
    neverFlatten: true,
    isZStack: true,
  }
)

export const getSizedElevation = (
  val: SizeTokens | number | boolean,
  { theme, tokens }: VariantSpreadExtras<any>
) => {
  const num =
    val === false
      ? 0
      : val === true
      ? // handles true
        (() => {
          const val = getVariableValue(tokens.size['true'])
          if (typeof val === 'number') {
            return val
          }
          return 10
        })()
      : +val
  const [height, shadowRadius] = [Math.round(num / 4 + 1), Math.round(num / 2 + 2)]
  const shadow = {
    shadowColor: theme.shadowColor,
    shadowRadius,
    shadowOffset: { height, width: 0 },
  }
  return shadow
}
