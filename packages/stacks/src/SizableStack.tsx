import {
  GetProps,
  ScaleVariantExtras,
  SizeTokens,
  buttonScaling,
  getButtonSize,
  getSizeScaledToFont,
  styled,
} from '@tamagui/core'

import { YStack, getElevation } from './Stacks'
import { focusable, hoverable, pressable } from './variants'

export const SizableStack = styled(YStack, {
  name: 'SizableStack',
  backgroundColor: '$background',
  flexDirection: 'row',
  flexShrink: 1,

  variants: {
    // allows the type to come in for use in size
    fontFamily: () => ({}),
    hoverable,
    pressable,
    focusable,
    size: {
      '...size': getButtonSize,
    },

    // matches circle to size
    circular: {
      true: (_, extras) => {
        const { props } = extras
        // @ts-ignore
        const size = getCircleSize(props.size, extras)
        return {
          width: size,
          height: size,
          maxWidth: size,
          maxHeight: size,
          minWidth: size,
          minHeight: size,
          borderRadius: 100_000,
          paddingVertical: 0,
          paddingHorizontal: 0,
        }
      },
    },

    // matches elevation to size
    elevate: {
      true: (_, extras) => {
        return getElevation(extras.props['size'], extras)
      },
    },
  },
})

export type SizableStackProps = GetProps<typeof SizableStack>

export function getCircleSize(size: SizeTokens, extras: ScaleVariantExtras) {
  const sizeVal = size ?? '$4'
  const scale = getSizeScaledToFont(sizeVal, buttonScaling, extras)
  return scale.minHeight
}
