import {
  ColorStyleProp,
  GetProps,
  setupReactNative,
  styled,
  useTheme,
} from '@tamagui/core'
import { useFocusable } from '@tamagui/focusable'
import { TextInput } from 'react-native'

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

export const InputFrame = styled(
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

export type InputProps = Omit<GetProps<typeof InputFrame>, 'placeholderTextColor'> & {
  placeholderTextColor?: ColorStyleProp
  rows?: number
}

export const Input = InputFrame.styleable<InputProps>((propsIn, ref) => {
  const props = useInputProps(propsIn, ref)
  return <InputFrame {...props} />
})

export function useInputProps(props: InputProps, ref: any) {
  const theme = useTheme()
  const { onChangeText, ref: combinedRef } = useFocusable({
    props,
    ref,
    isInput: true,
  })

  const placeholderColorProp = props.placeholderTextColor
  const placeholderTextColor =
    theme[placeholderColorProp as any]?.get() ??
    placeholderColorProp ??
    theme.placeholderColor?.get()

  return {
    ref: combinedRef,
    ...props,
    placeholderTextColor,
    onChangeText,
  }
}
