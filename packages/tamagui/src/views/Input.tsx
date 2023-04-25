import {
  ColorStyleProp,
  GetProps,
  ModifyTamaguiComponentStyleProps,
  setupReactNative,
  styled,
} from '@tamagui/core'
import { focusableInputHOC } from '@tamagui/focusable'
import { ColorValue, TextInput } from 'react-native'

import { inputSizeVariant } from '../helpers/inputHelpers'

setupReactNative({
  TextInput,
})

export const defaultStyles = {
  size: '$true',
  fontFamily: '$body',
  borderWidth: 1,
  outlineWidth: 0,
  color: '$color',
  focusable: true,
  borderColor: '$borderColor',
  backgroundColor: '$background',
  placeholderTextColor: '$placeholderColor',

  // this fixes a flex bug where it overflows container
  minWidth: 0,

  hoverStyle: {
    borderColor: '$borderColorHover',
  },

  focusStyle: {
    outlineColor: '$borderColorFocus',
    outlineWidth: 2,
    outlineStyle: 'solid',
    borderColor: '$borderColorFocus',
  },
} as const

const InputFramePreTyped = styled(
  TextInput,
  {
    name: 'Input',

    variants: {
      unstyled: {
        false: defaultStyles,
      },

      size: {
        '...size': inputSizeVariant,
      },
    } as const,

    defaultVariants: {
      unstyled: false,
    },
  },
  {
    isInput: true,
  }
)

type InputFrameType = ModifyTamaguiComponentStyleProps<
  typeof InputFramePreTyped,
  {
    placeholderTextColor?: ColorStyleProp | ColorValue
  }
>

export const InputFrame = InputFramePreTyped as InputFrameType

export type InputProps = GetProps<InputFrameType>

export const Input = focusableInputHOC(InputFrame)
