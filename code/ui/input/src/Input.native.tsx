import React from 'react'
import { TextInput, type TextInputProps as RNTextInputProps } from 'react-native'
import { styled } from '@tamagui/core'
import { registerFocusable } from '@tamagui/focusable'
import { useNativeInputRef } from '@tamagui/element'
import { styledBody } from './shared'
import type { InputExtraProps } from './types'

const StyledInput = styled(TextInput, styledBody[0], styledBody[1])

/**
 * A web-aligned input component for React Native.
 * @see — Docs https://tamagui.dev/ui/inputs#input
 */
export const Input = StyledInput.styleable<InputExtraProps>((props, forwardedRef) => {
  const {
    // Web props we need to convert
    type,
    disabled,
    readOnly,
    id,
    rows,
    autoComplete,
    enterKeyHint,

    // Callbacks
    onChange,
    onInput,
    onKeyDown,
    onChangeText,
    onSubmitEditing,
    onSelectionChange,
    onEndEditing,
    onContentSizeChange,
    onScroll,
    onKeyPress: onKeyPressProp,
    selection,

    // Native-only props (pass through directly)
    keyboardAppearance,
    returnKeyType: returnKeyTypeProp,
    submitBehavior,
    blurOnSubmit,
    caretHidden,
    contextMenuHidden,
    selectTextOnFocus,
    secureTextEntry: secureTextEntryProp,
    maxFontSizeMultiplier,
    allowFontScaling,
    multiline: multilineProp,
    keyboardType: keyboardTypeProp,
    inputMode: inputModeProp,
    autoCapitalize: autoCapitalizeProp,
    autoCorrect: autoCorrectProp,
    autoFocusNative,
    textContentType,

    // iOS-only props
    clearButtonMode,
    clearTextOnFocus,
    enablesReturnKeyAutomatically,
    dataDetectorTypes,
    scrollEnabled,
    passwordRules,
    rejectResponderTermination,
    spellCheck,
    lineBreakStrategyIOS,
    lineBreakModeIOS,
    smartInsertDelete,
    inputAccessoryViewID,
    inputAccessoryViewButtonLabel,
    disableKeyboardShortcuts,

    // Android-only props
    importantForAutofill,
    disableFullscreenUI,
    inlineImageLeft,
    inlineImagePadding,
    returnKeyLabel,
    textBreakStrategy,
    textAlignVertical,
    verticalAlign,
    showSoftInputOnFocus,
    numberOfLines: numberOfLinesProp,

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
    render,

    ...rest
  } = props

  const { ref, composedRef } = useNativeInputRef(forwardedRef)

  // Convert web type to native props (if not explicitly overridden)
  let secureTextEntry = secureTextEntryProp ?? false
  let keyboardType: RNTextInputProps['keyboardType'] = keyboardTypeProp ?? 'default'
  let inputMode: RNTextInputProps['inputMode'] = inputModeProp

  // only derive from type if native props weren't explicitly set
  if (!secureTextEntryProp && !keyboardTypeProp && !inputModeProp) {
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
  }

  // Use explicit returnKeyType if provided, otherwise convert enterKeyHint
  let returnKeyType: RNTextInputProps['returnKeyType'] = returnKeyTypeProp
  if (!returnKeyType && enterKeyHint) {
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
  }

  // Determine multiline
  const multiline = multilineProp ?? (render === 'textarea' || (rows && rows > 1))
  const numberOfLines = numberOfLinesProp ?? rows

  // convert web-style autoCorrect string to native boolean
  const autoCorrect =
    autoCorrectProp === 'on' ? true : autoCorrectProp === 'off' ? false : autoCorrectProp

  // convert web-style autoCapitalize to native values
  const autoCapitalize =
    autoCapitalizeProp === 'on'
      ? 'sentences'
      : autoCapitalizeProp === 'off'
        ? 'none'
        : autoCapitalizeProp

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
    // call user's onKeyPress first
    onKeyPressProp?.(e)
    // then handle web onKeyDown compat
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
    onSubmitEditing?.(e)
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
    multiline,
    numberOfLines,
    selection,
    autoComplete: autoComplete as any,
    autoFocus: autoFocusNative,

    // callbacks
    onChangeText: handleChangeText,
    onKeyPress: onKeyPressProp || onKeyDown ? handleKeyPress : undefined,
    onSubmitEditing: onKeyDown || onSubmitEditing ? handleSubmitEditing : undefined,
    onSelectionChange: onSelectionChange ? handleSelectionChange : undefined,
    onEndEditing,
    onContentSizeChange,
    onScroll,

    // cross-platform native props
    submitBehavior,
    blurOnSubmit,
    caretHidden,
    contextMenuHidden,
    selectTextOnFocus,
    maxFontSizeMultiplier,
    allowFontScaling,
    autoCapitalize,
    autoCorrect,
    textContentType,

    // iOS-only props
    clearButtonMode,
    clearTextOnFocus,
    enablesReturnKeyAutomatically,
    dataDetectorTypes,
    scrollEnabled,
    passwordRules,
    rejectResponderTermination,
    spellCheck,
    lineBreakStrategyIOS,
    lineBreakModeIOS,
    smartInsertDelete,
    inputAccessoryViewID,
    inputAccessoryViewButtonLabel,
    disableKeyboardShortcuts,

    // Android-only props
    importantForAutofill,
    disableFullscreenUI,
    inlineImageLeft,
    inlineImagePadding,
    returnKeyLabel,
    textBreakStrategy,
    textAlignVertical,
    verticalAlign,
    showSoftInputOnFocus,
  }

  return <StyledInput ref={composedRef} {...finalProps} />
})
