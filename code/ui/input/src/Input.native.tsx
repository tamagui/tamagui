import React from 'react'
import { TextInput, type TextInputProps as RNTextInputProps } from 'react-native'
import { styled, useComposedRefs, useTheme, getTokenValue } from '@tamagui/core'
import { registerFocusable } from '@tamagui/focusable'
import { styledBody } from './shared'
import type { InputProps } from './types'

const StyledInput = styled(TextInput, styledBody[0], styledBody[1])

/**
 * A web-aligned input component for React Native.
 * @see — Docs https://tamagui.dev/ui/inputs#input
 */
export const Input = StyledInput.styleable<InputProps>((props, forwardedRef) => {
  const {
    // Web props we need to convert
    type,
    disabled,
    readOnly,
    id,
    rows,
    autoComplete,
    enterKeyHint,

    // Tamagui color props
    placeholderTextColor,
    selectionColor,

    // Callbacks
    onChange,
    onInput,
    onKeyDown,
    onChangeText,
    onSubmitEditing,
    onSelectionChange,
    selection,

    // Native props
    keyboardAppearance,

    // Web-only props to filter out
    // @ts-ignore
    dirname,
    min,
    max,
    minLength,
    multiple,
    name,
    pattern,
    required,
    step,
    tag,

    ...rest
  } = props

  const ref = React.useRef<any>(null)
  const theme = useTheme()
  const composedRefs = useComposedRefs<any>(forwardedRef, ref)

  // Convert web type to native props
  let secureTextEntry = false
  let keyboardType: RNTextInputProps['keyboardType'] = 'default'
  let inputMode: RNTextInputProps['inputMode'] = undefined

  switch (type) {
    case 'password':
      secureTextEntry = true
      break
    case 'email':
      keyboardType = 'email-address'
      inputMode = 'email'
      break
    case 'tel':
      keyboardType = 'phone-pad'
      inputMode = 'tel'
      break
    case 'number':
      keyboardType = 'numeric'
      inputMode = 'numeric'
      break
    case 'url':
      keyboardType = 'url'
      inputMode = 'url'
      break
    case 'search':
      inputMode = 'search'
      break
  }

  // Convert enterKeyHint to returnKeyType
  let returnKeyType: RNTextInputProps['returnKeyType'] = undefined
  switch (enterKeyHint) {
    case 'done':
      returnKeyType = 'done'
      break
    case 'go':
      returnKeyType = 'go'
      break
    case 'next':
      returnKeyType = 'next'
      break
    case 'search':
      returnKeyType = 'search'
      break
    case 'send':
      returnKeyType = 'send'
      break
  }

  // Resolve color tokens
  const resolvedPlaceholderColor = placeholderTextColor
    ? getTokenValue(
        theme[placeholderTextColor as any]?.val ?? placeholderTextColor,
        'color'
      )
    : undefined

  const resolvedSelectionColor = selectionColor
    ? getTokenValue(theme[selectionColor as any]?.val ?? selectionColor, 'color')
    : undefined

  // Register focusable
  React.useEffect(() => {
    if (!id || disabled) return
    return registerFocusable(id, {
      focusAndSelect: () => ref.current?.focus(),
      focus: () => ref.current?.focus(),
    })
  }, [id, disabled])

  // Handle web onChange/onInput -> native onChangeText
  const handleChangeText = (text: string) => {
    onChangeText?.(text)
    if (onChange) {
      onChange({ target: { value: text }, type: 'change' } as any)
    }
    if (onInput) {
      onInput({ target: { value: text }, type: 'input' } as any)
    }
  }

  // Handle onKeyDown via onKeyPress + onSubmitEditing
  const handleKeyPress = (e: any) => {
    if (onKeyDown) {
      const { key } = e.nativeEvent
      if (key === 'Backspace' || key === 'Enter' || key.length === 1) {
        onKeyDown({ key, type: 'keydown' } as any)
      }
    }
  }

  const handleSubmitEditing = (e: any) => {
    if (onKeyDown) {
      onKeyDown({ key: 'Enter', type: 'keydown' } as any)
    }
    if (onSubmitEditing) {
      onSubmitEditing(e)
    }
  }

  // Handle selection change
  const handleSelectionChange = (e: any) => {
    onSelectionChange?.(e)
  }

  const finalProps: any = {
    ...rest,
    editable: !disabled && !readOnly,
    secureTextEntry,
    keyboardType,
    keyboardAppearance,
    inputMode,
    returnKeyType,
    multiline: tag === 'textarea' || (rows && rows > 1),
    numberOfLines: rows,
    selection,
    placeholderTextColor: resolvedPlaceholderColor,
    selectionColor: resolvedSelectionColor,
    onChangeText: handleChangeText,
    onKeyPress: onKeyDown ? handleKeyPress : undefined,
    onSubmitEditing: onKeyDown || onSubmitEditing ? handleSubmitEditing : undefined,
    onSelectionChange: onSelectionChange ? handleSelectionChange : undefined,
    autoComplete: autoComplete as any,
  }

  return <StyledInput ref={composedRefs} {...finalProps} />
})
