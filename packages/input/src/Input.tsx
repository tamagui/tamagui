import React, { useEffect } from 'react'
import { registerFocusable } from '@tamagui/focusable'
import { View, styled, useComposedRefs, useEvent, useTheme } from '@tamagui/core'
import { InputProps } from './types'
import { styledBody } from './shared'
const StyledInput = styled(View, styledBody[0], styledBody[1])

export const Input = StyledInput.styleable<InputProps>((inProps, forwardedRef) => {
  const {
    // some of destructed props are just to avoid passing them to ...rest because they are not in web.
    allowFontScaling,
    selectTextOnFocus,
    showSoftInputOnFocus,
    textContentType,
    passwordRules,
    textBreakStrategy,
    underlineColorAndroid,
    selection,
    lineBreakStrategyIOS,
    returnKeyLabel,
    disabled,
    onSubmitEditing,
    caretHidden,
    clearButtonMode,
    clearTextOnFocus,
    contextMenuHidden,
    dataDetectorTypes,
    id,
    enablesReturnKeyAutomatically,
    importantForAutofill,
    inlineImageLeft,
    inlineImagePadding,
    inputAccessoryViewID,
    keyboardAppearance,
    keyboardType,
    cursorColor,
    disableFullscreenUI,
    editable,
    maxFontSizeMultiplier,
    multiline,
    numberOfLines,
    onChangeText,
    onContentSizeChange,
    onEndEditing,
    onScroll,
    onSelectionChange,
    caretColor,
    placeholderTextColor,
    blurOnSubmit,
    enterKeyHint,
    returnKeyType,
    rejectResponderTermination,
    rows,
    scrollEnabled,
    secureTextEntry,
    selectionColor,
    inputMode,
    ...rest
  } = inProps

  const ref = React.useRef<HTMLInputElement>(null)
  const theme = useTheme()

  const composedRefs = useComposedRefs(forwardedRef, ref)

  const _onSelectionChange = useEvent(() => {
    const start = ref.current?.selectionStart ?? 0
    const end = ref.current?.selectionEnd ?? 0
    onSelectionChange?.({
      nativeEvent: {
        selection: {
          end,
          start,
        },
      },
    } as any)
  })

  useEffect(() => {
    if (onSelectionChange) {
      ref.current?.addEventListener('selectionchange', _onSelectionChange)
      return () => {
        ref.current?.removeEventListener('selectionchange', _onSelectionChange)
      }
    }
  }, [])

  useEffect(() => {
    if (selection) {
      ref.current?.setSelectionRange(selection.start || null, selection.end || null)
    }
  }, [selection?.start, selection?.end])

  const finalProps = {
    ...rest,
    inputMode,
    disabled,
    caretColor,
    id,
    enterKeyHint,
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
  return <StyledInput ref={composedRefs} {...finalProps} />
})
