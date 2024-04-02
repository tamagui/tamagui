import React, { forwardRef, useCallback, useEffect } from 'react'
import { registerFocusable } from '@tamagui/focusable'
import { styled, useComposedRefs } from '@tamagui/core'
import { TextInput } from 'react-native'
import type { TextInputProps } from 'react-native'
import { InputProps } from './type'
const INPUT_NAME = 'Input'
const StyledInput = styled(TextInput, {
  name: INPUT_NAME,
})

export const Input = forwardRef<HTMLInputElement, InputProps>((inProps, forwardedRef) => {
  const {
    type,
    autoCapitalize,
    autoComplete,
    autoCorrect,
    autoFocus,
    disabled,
    maxLength,
    placeholder,
    readOnly,
    id,
    value,
    caretColor,
    placeholderTextColor,
    onChange,
    blurOnSubmit,
    enterKeyHint,
    defaultValue,
    returnKeyType,
    selectionColor,
    inputMode,
    spellCheck,
    textAlign,
    ...rest
  } = inProps

  const ref = React.useRef<HTMLInputElement>(null)

  const composedRefs = useComposedRefs(forwardedRef, ref)

  let secureTextEntry = false
  let cursorColor = caretColor
  let _returnKeyType = returnKeyType
  let _enterKeyHint = enterKeyHint
  if (enterKeyHint === 'go') {
    _returnKeyType = 'go'
    _enterKeyHint = undefined
  }

  const _onChange: TextInputProps['onChange'] = useCallback(
    (e) => {
      if (onChange) {
        onChange({
          ...e,
          target: {
            value: e.nativeEvent.text,
          },
        } as any)
      }
    },
    [onChange]
  )

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
  } else {
    _inputMode = 'text'
  }

  let showSoftInputOnFocus = true
  if (inputMode === 'none') {
    showSoftInputOnFocus = false
  }

  const finalProps = {
    inputMode: _inputMode,
    showSoftInputOnFocus,
    autoCapitalize: autoCapitalize as any,
    autoComplete: autoComplete as any,
    autoCorrect: autoCorrect as any,
    autoFocus,
    disabled,
    maxLength,
    placeholder,
    readOnly,
    id,
    value,
    cursorColor,
    placeholderTextColor,
    onChange: _onChange,
    blurOnSubmit,
    defaultValue,
    enterKeyHint: _enterKeyHint,
    returnKeyType: _returnKeyType,
    selectionColor,
    secureTextEntry,
    spellCheck,
    textAlign,
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
  return <StyledInput ref={composedRefs as unknown as any} {...finalProps} />
})
