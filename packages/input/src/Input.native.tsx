import React, { useEffect } from 'react'
import { registerFocusable } from '@tamagui/focusable'
import { styled, useComposedRefs } from '@tamagui/core'
import { TextInput, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'
import { InputProps } from './type'
import { defaultStyles, inputSizeVariant } from './shared'
const INPUT_NAME = 'Input'
const StyledInput = styled(
  TextInput,
  {
    name: INPUT_NAME,
    variants: {
      unstyled: {
        false: defaultStyles,
      },

      size: {
        '...size': inputSizeVariant,
      },

      disabled: {
        true: {},
      },
    } as const,

    defaultVariants: {
      unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
    },
  },
  {
    isInput: true,

    accept: {
      placeholderTextColor: 'color',
      selectionColor: 'color',
    } as const,
  }
)

// TODO: later move most of the logic to the core package
export const Input = StyledInput.styleable<InputProps>((inProps, forwardedRef) => {
  const {
    // some of destructed props are just to avoid passing them to ...rest because they are not in native.
    type,
    //@ts-ignore
    dirname,
    max,
    min,
    minLength,
    multiple,
    name,
    required,
    step,
    disabled,
    id,
    caretColor,
    onChange,
    onInput,
    enterKeyHint,
    returnKeyType,
    onKeyDown,
    inputMode,
    tag,
    ...rest
  } = inProps

  const ref = React.useRef<HTMLInputElement>(null)

  const composedRefs = useComposedRefs<any>(forwardedRef, ref)

  let secureTextEntry = false
  let cursorColor = caretColor
  let _returnKeyType = returnKeyType
  let _enterKeyHint = enterKeyHint
  if (enterKeyHint === 'go') {
    _returnKeyType = 'go'
    _enterKeyHint = undefined
  }

  let _inputMode = inputMode
  if (type === 'email') {
    _inputMode = 'email'
  } else if (type === 'tel') {
    _inputMode = 'tel'
  } else if (type === 'search') {
    _inputMode = 'search'
  } else if (type === 'url') {
    _inputMode = 'url'
  } else if (type === 'password') {
    secureTextEntry = true
    _inputMode = 'text'
  } else if (type === 'number') {
    _inputMode = 'numeric'
  } else {
    _inputMode = 'text'
  }

  let showSoftInputOnFocus = true
  if (inputMode === 'none') {
    showSoftInputOnFocus = false
  }

  const finalProps = {
    ...rest,
    inputMode: _inputMode,
    showSoftInputOnFocus,
    disabled,
    id,
    cursorColor,
    enterKeyHint: _enterKeyHint,
    returnKeyType: _returnKeyType,
    secureTextEntry,
  } as any

  if (tag === 'textarea') {
    finalProps.multiline = true
  }

  if (onKeyDown) {
    finalProps.onKeyPress = (e) => {
      const { key } = e.nativeEvent
      if (
        key === 'Backspace' ||
        (tag === 'textarea' && key === 'Enter') ||
        key.length === 1
      ) {
        onKeyDown({
          key,
          type: 'keydown',
        } as any)
      }
    }
    finalProps.onSubmitEditing = (e) => {
      onKeyDown({
        key: 'Enter',
        type: 'keydown',
      } as any)
    }
  }

  if (onChange || onInput) {
    finalProps.onChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      const { text } = e.nativeEvent
      if (onChange) {
        onChange({
          target: {
            value: text,
          },
          type: 'change',
        } as any)
      }
      if (onInput != null) {
        onInput({
          target: {
            value: text,
          },
          type: 'input',
        } as any)
      }
    }
  }

  useEffect(() => {
    if (!id) return
    if (disabled) return

    return registerFocusable(id, {
      focusAndSelect: () => {
        ref.current?.focus()
      },
      focus: () => {},
    })
  }, [id, disabled])
  return <StyledInput onChange={(e) => {}} ref={composedRefs} {...finalProps} />
})
