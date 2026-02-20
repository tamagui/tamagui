import { type GetProps, View, styled, useTheme } from '@tamagui/core'
import { registerFocusable } from '@tamagui/focusable'
import { useWebRef } from '@tamagui/element'
import React from 'react'
import { styledBody } from './shared'
import type { InputExtraProps } from './types'

const StyledInput = styled(View, styledBody[0], styledBody[1])

/**
 * A web-aligned input component.
 * @see — Docs https://tamagui.dev/ui/inputs#input
 */
export const Input = StyledInput.styleable<InputExtraProps>((props, _forwardedRef) => {
  const {
    disabled,
    id,
    onChangeText,
    onSubmitEditing,
    onSelectionChange,
    selection,
    placeholderTextColor,
    selectionColor,
    rows,

    // Native-only props (ignored on web)
    keyboardAppearance,
    returnKeyType,
    submitBehavior,
    blurOnSubmit,
    caretHidden,
    contextMenuHidden,
    selectTextOnFocus,
    secureTextEntry,
    maxFontSizeMultiplier,
    allowFontScaling,
    multiline,
    keyboardType,
    autoCapitalize: autoCapitalizeProp,
    autoCorrect: autoCorrectProp,
    autoFocusNative,
    textContentType,
    onEndEditing,
    onContentSizeChange,
    onScroll,
    onKeyPress,

    // iOS-only props (ignored on web)
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

    // Android-only props (ignored on web)
    cursorColor,
    selectionHandleColor,
    underlineColorAndroid,
    importantForAutofill,
    disableFullscreenUI,
    inlineImageLeft,
    inlineImagePadding,
    returnKeyLabel,
    textBreakStrategy,
    textAlignVertical,
    verticalAlign,
    showSoftInputOnFocus,
    numberOfLines,

    ...rest
  } = props

  const { ref, composedRef } = useWebRef<HTMLInputElement>(_forwardedRef)
  const theme = useTheme()

  // convert native-style values to web equivalents
  const autoCorrect =
    autoCorrectProp === true ? 'on' : autoCorrectProp === false ? 'off' : autoCorrectProp
  const autoCapitalize =
    autoCapitalizeProp === 'sentences' || autoCapitalizeProp === 'words'
      ? 'on'
      : autoCapitalizeProp === 'none' || autoCapitalizeProp === 'characters'
        ? 'off'
        : autoCapitalizeProp

  // Handle selection changes
  React.useEffect(() => {
    if (!onSelectionChange) return

    const node = ref.current
    if (!node) return

    const handleSelectionChange = () => {
      onSelectionChange({
        nativeEvent: {
          selection: {
            start: node.selectionStart ?? 0,
            end: node.selectionEnd ?? 0,
          },
        },
      })
    }

    node.addEventListener('select', handleSelectionChange)
    return () => node.removeEventListener('select', handleSelectionChange)
  }, [onSelectionChange])

  // Sync selection prop
  React.useEffect(() => {
    if (selection && ref.current) {
      ref.current.setSelectionRange(selection.start, selection.end ?? selection.start)
    }
  }, [selection?.start, selection?.end])

  // Register focusable
  React.useEffect(() => {
    if (!id || disabled) return
    return registerFocusable(id, {
      focusAndSelect: () => ref.current?.focus(),
      focus: () => ref.current?.focus(),
    })
  }, [id, disabled])

  // Handle keyboard submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmitEditing) {
      onSubmitEditing({
        nativeEvent: { text: (e.target as HTMLInputElement).value },
      })
    }
    rest.onKeyDown?.(e)
  }

  // Handle change with onChangeText support
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeText?.(e.target.value)
    rest.onChange?.(e)
  }

  const finalProps = {
    ...rest,
    disabled,
    id,
    rows,
    autoCorrect,
    autoCapitalize,
    onKeyDown: onSubmitEditing ? handleKeyDown : rest.onKeyDown,
    onChange: onChangeText ? handleChange : rest.onChange,
    style: {
      ...(rest.style as any),
      ...(placeholderTextColor && {
        '--placeholderColor':
          theme[placeholderTextColor]?.variable || placeholderTextColor,
      }),
      ...(selectionColor && {
        '--selectionColor': theme[selectionColor]?.variable || selectionColor,
      }),
    },
  } as any

  return <StyledInput ref={composedRef} {...finalProps} />
})

export type InputProps = GetProps<typeof Input>
