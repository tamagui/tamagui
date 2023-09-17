import { Button } from '@tamagui/button'
import {
  ColorStyleProp,
  GetProps,
  Stack,
  composeEventHandlers,
  isWeb,
  setupReactNative,
  styled,
  useComposedRefs,
  useTheme,
  withStaticProperties,
} from '@tamagui/core'
import { useFocusable } from '@tamagui/focusable'
import { RefObject, createContext, useContext, useMemo, useRef, useState } from 'react'
import { TextInput } from 'react-native'

import { inputSizeVariant } from '../helpers/inputHelpers'
import {
  END_INPUT_ADORNMENT_NAME,
  START_INPUT_ADORNMENT_NAME,
  useComposedInput,
} from './useComposedInput'

setupReactNative({
  TextInput,
})

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

export const InputFrame = styled(
  Stack,
  {
    name: 'InputFrame',
    padding: 0,
    flexDirection: 'row',
    overflow: 'hidden',

    variants: {
      unstyled: {
        false: defaultStyles,
      },

      size: {
        '...size': inputSizeVariant,
      },

      isFocused: {
        true: {
          outlineColor: '$borderColorFocus',
          outlineWidth: 2,
          outlineStyle: 'solid',
          borderColor: '$borderColorFocus',
        },
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

const InputControl = styled(
  TextInput,
  {
    name: 'InputControl',
    flex: 1,
    paddingHorizontal: '$2',
  },
  {
    isInput: true,
  }
)

type InputContextValue = {
  /**
   * Direct ref to the input field, this will control the
   * actions of the input field.
   */
  ref?: RefObject<TextInput>

  /**
   * Set the focus state of the input field.
   */
  setIsFocused: (focused: boolean) => void
}

const InputRefContext = createContext<InputContextValue>({
  ref: undefined,
  setIsFocused: () => undefined,
})

/**
 * Hook to access the input context.
 */
export const useInputRefContext = () => useContext(InputRefContext)

export type InputProps = Omit<GetProps<typeof InputControl>, 'placeholderTextColor'> & {
  placeholderTextColor?: ColorStyleProp
  rows?: number
}

const BaseInputAdornment = styled(Stack, {
  name: 'BaseInputAdornment',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: '$4',
  minHeight: '$4',
  paddingHorizontal: '$2',
  backgroundColor: '$borderColor',
  pointerEvents: 'none',
})

const InputStartAdornmentMain = styled(BaseInputAdornment, {
  name: START_INPUT_ADORNMENT_NAME,
})
const InputEndAdornmentMain = styled(BaseInputAdornment, {
  name: END_INPUT_ADORNMENT_NAME,
})

const BaseInputButtonAdornment = styled(Button, {
  name: 'BaseInputAdornment',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: '$4',
  minHeight: '$4',
  paddingHorizontal: '$2',
  backgroundColor: '$borderColor',
  borderRadius: 0,
})

const InputStartAdornmentButton = styled(BaseInputButtonAdornment, {
  name: START_INPUT_ADORNMENT_NAME,
  variants: {
    isEnd: {
      true: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
      false: {
        borderRadius: 0,
      },
    },
  } as const,
})

const InputEndAdornmentButton = styled(BaseInputButtonAdornment, {
  name: END_INPUT_ADORNMENT_NAME,
  variants: {
    isEnd: {
      true: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      },
      false: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
    },
  } as const,
})

const InputStartAdornment = withStaticProperties(InputStartAdornmentMain, {
  Button: InputStartAdornmentButton,
})
const InputEndAdornment = withStaticProperties(InputEndAdornmentMain, {
  Button: InputEndAdornmentButton,
})

const InputMain = InputFrame.styleable<InputProps>((propsIn, ref) => {
  const { ref: focusRef, children, ...rest } = useInputProps(propsIn, ref)
  const [isFocused, setIsFocused] = useState(false)
  const textInputRef = useRef<TextInput>(null)
  const passedRef = useComposedRefs(textInputRef, focusRef)

  const {
    children: restChildren,
    formComponents: { startAdornments, endAdornments },
  } = useComposedInput(children)

  const inputContextValues = useMemo(
    () => ({
      ref: textInputRef,
      setIsFocused,
    }),
    []
  )

  return (
    <InputRefContext.Provider value={inputContextValues}>
      <InputFrame isFocused={isFocused} onPress={() => textInputRef.current?.focus()}>
        {startAdornments}
        <InputControl
          ref={passedRef}
          onFocus={composeEventHandlers(rest.onFocus, () => setIsFocused(true))}
          onBlur={composeEventHandlers(rest.onBlur, () => setIsFocused(false))}
          {...rest}
        />
        {endAdornments}
      </InputFrame>
    </InputRefContext.Provider>
  )
})

export const Input = withStaticProperties(InputMain, {
  Start: InputStartAdornment,
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
