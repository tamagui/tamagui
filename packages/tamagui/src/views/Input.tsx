import {
  ColorStyleProp,
  GetProps,
  Stack,
  composeEventHandlers,
  createStyledContext,
  isWeb,
  setupReactNative,
  styled,
  useComposedRefs,
  useProps,
  useTheme,
  withStaticProperties,
} from '@tamagui/core'
import { Scope, createContextScope } from '@tamagui/create-context'
import { useFocusable } from '@tamagui/focusable'
import { RefObject, useEffect, useMemo, useRef, useState } from 'react'
import { TextInput } from 'react-native'

import { inputFrameSizeVariant, inputSizeVariant } from '../helpers/inputHelpers'

type InputContextValue = {
  textInputRef?: RefObject<TextInput>
  setIsFocused: (focused: boolean) => void
}

const INPUT_NAME = 'InputFrame'

const InputStyledContext = createStyledContext({ size: null, unstyled: false })

type ScopedProps<P> = P & { __scopeGroup?: Scope }
const [createInputContext, _] = createContextScope(INPUT_NAME)
const [InputProvider, useInputContext] = createInputContext<InputContextValue>(
  INPUT_NAME,
  {
    setIsFocused: () => null,
  }
)

export type InputProps = ScopedProps<
  Omit<GetProps<typeof InputControlMain>, 'placeholderTextColor'> & {
    placeholderTextColor?: ColorStyleProp
    rows?: number
  }
>

setupReactNative({
  TextInput,
})

const focusStyle = {
  outlineColor: '$borderColorFocus',
  outlineWidth: 2,
  outlineStyle: 'solid',
  borderColor: '$borderColorFocus',
} as const

export const defaultStyles = {
  size: '$true',
  fontFamily: '$body',
  borderWidth: 1,
  outlineWidth: 0,
  color: '$color',

  ...(isWeb
    ? {
        tabIndex: 0,
      }
    : {
        focusable: true,
      }),

  borderColor: '$borderColor',
  backgroundColor: '$background',

  // this fixes a flex bug where it overflows container
  minWidth: 0,

  hoverStyle: {
    borderColor: '$borderColorHover',
  },
} as const

export const InputFrame = styled(Stack, {
  name: INPUT_NAME,
  padding: 0,
  flexDirection: 'row',
  overflow: 'hidden',
  tabIndex: -1,
  context: InputStyledContext,

  variants: {
    unstyled: {
      false: defaultStyles,
    },

    size: {
      '...size': inputFrameSizeVariant,
    },

    isFocused: {
      true: focusStyle,
    },
  } as const,

  defaultVariants: {
    unstyled: false,
  },
})

const InputControlMain = styled(
  TextInput,
  {
    name: 'InputControl',
    context: InputStyledContext,
    focusStyle,

    variants: {
      unstyled: {
        false: defaultStyles,
      },

      decorated: {
        true: {
          focusStyle: { outlineWidth: 0 },
          borderWidth: 0,
          flex: 1,
        },
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

const BaseInputControl = InputControlMain.styleable<InputProps>((propsIn, ref) => {
  const props = useInputProps(propsIn, ref)
  return <InputControlMain {...props} />
})

const DecoratedInputControl = InputControlMain.styleable<InputProps>((propsIn, ref) => {
  const inputProps = useInputProps(propsIn, ref)
  const { ref: focusRef, children, onFocus, onBlur, ...extraInputProps } = inputProps
  const { textInputRef, setIsFocused } = useInputContext(
    'InputControl',
    propsIn.__scopeGroup
  )
  const passedRef = useComposedRefs(textInputRef, focusRef)

  return (
    <InputControlMain
      ref={passedRef}
      onFocus={composeEventHandlers(onFocus, () => setIsFocused(true))}
      onBlur={composeEventHandlers(onBlur, () => setIsFocused(false))}
      decorated
      {...extraInputProps}
    />
  )
})

const BASE_INPUT_ADORNMENT_NAME = 'BaseInputAdornment'

const BaseInputAdornment = styled(Stack, {
  name: BASE_INPUT_ADORNMENT_NAME,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
})

const InputStartAdornment = styled(BaseInputAdornment, {
  name: 'InputStartAdornment',
})

// const baseStyles = {
//   height: '100%',
//   borderTopRightRadius: 0,
//   borderBottomRightRadius: 0,
//   borderTopLeftRadius: 0,
//   borderBottomLeftRadius: 0,
// }

// const InputStartAdornment = InputStartAdornmentMain.styleable((propsIn, ref) => {
//   const { children: childrenProp, ...props } = useProps(propsIn)

//   const childrenArray = Children.toArray(childrenProp)
//   const children = childrenArray.map((child) => {
//     const props = {
//       ...(isTamaguiElement(child) ? baseStyles : { style: baseStyles }),
//     }

//     return cloneElementWithPropOrder(child, props)
//   })

//   return (
//     <InputStartAdornmentMain ref={ref} {...props}>
//       {children}
//     </InputStartAdornmentMain>
//   )
// })
const InputEndAdornment = styled(BaseInputAdornment, {
  name: 'InputEndAdornment',
})

// const InputEndAdornment = InputEndAdornmentMain.styleable((propsIn, ref) => {
//   const { children: childrenProp, ...props } = useProps(propsIn)

//   const childrenArray = Children.toArray(childrenProp)
//   const children = childrenArray.map((child) => {
//     const props = {
//       ...(isTamaguiElement(child) ? baseStyles : { style: baseStyles }),
//     }

//     return cloneElementWithPropOrder(child, props)
//   })

//   return (
//     <InputEndAdornmentMain ref={ref} {...props}>
//       {children}
//     </InputEndAdornmentMain>
//   )
// })

const InputMain = InputFrame.styleable<InputProps>((propsIn, ref) =>
  propsIn.children ? (
    <InputDecorated ref={ref} {...propsIn} />
  ) : (
    <BaseInputControl ref={ref} {...propsIn} />
  )
)

const InputDecorated = InputFrame.styleable<InputProps>((propsIn, ref) => {
  const props = useProps(propsIn)
  const [isFocused, setIsFocused] = useState(false)
  const textInputRef = useRef<TextInput>(null)

  const handleOnPress = useMemo(
    () => composeEventHandlers(props.onPress, () => textInputRef.current?.focus()),
    [props.onPress]
  )
  const { onPress: _, ...rest } = props

  useEffect(() => {
    if (propsIn.disabled) setIsFocused(false)
  }, [propsIn.disabled])

  return (
    <InputProvider
      textInputRef={textInputRef}
      setIsFocused={setIsFocused}
      scope={props.__scopeGroup}
    >
      <InputFrame isFocused={isFocused} onPress={handleOnPress} {...rest} />
    </InputProvider>
  )
})

export const Input = withStaticProperties(InputMain, {
  Start: InputStartAdornment,
  Control: DecoratedInputControl,
  End: InputEndAdornment,
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
    editable: !props.disabled,
    ...props,
    placeholderTextColor,
    onChangeText,
  }
}
