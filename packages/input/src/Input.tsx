import React, { forwardRef, useEffect } from 'react'
import { registerFocusable } from '@tamagui/focusable'
import {
  ColorTokens,
  View,
  styled,
  useComposedRefs,
  useEvent,
  useTheme,
} from '@tamagui/core'
import { InputProps } from './type'
import { defaultStyles } from './shared'
const INPUT_NAME = 'Input'
const StyledInput = styled(
  View,
  {
    name: INPUT_NAME,
    tag: 'input',
    ...defaultStyles,
  },
  {
    accept: {
      placeholderTextColor: 'color',
      selectionColor: 'color',
    } as const,
  }
)

export const Input = forwardRef<HTMLInputElement, InputProps>((inProps, forwardedRef) => {
  const {
    // some of destructed props are just to avoid passing them to ...rest because they are not in web.
    type,
    allowFontScaling,
    autoCapitalize,
    selectTextOnFocus,
    showSoftInputOnFocus,
    textContentType,
    passwordRules,
    textBreakStrategy,
    underlineColorAndroid,
    selection,
    lineBreakStrategyIOS,
    autoComplete,
    autoCorrect,
    returnKeyLabel,
    autoFocus,
    disabled,
    onSubmitEditing,
    caretHidden,
    maxLength,
    clearButtonMode,
    clearTextOnFocus,
    contextMenuHidden,
    dataDetectorTypes,
    placeholder,
    readOnly,
    id,
    value,
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
    onChange,
    blurOnSubmit,
    enterKeyHint,
    defaultValue,
    returnKeyType,
    rejectResponderTermination,
    //@ts-ignore
    rows,
    scrollEnabled,
    secureTextEntry,
    selectionColor,
    inputMode,
    spellCheck,
    textAlign,
    ...rest
  } = inProps

  const ref = React.useRef<HTMLInputElement>(null)

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
    }
    return () => {
      if (onSelectionChange) {
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
    type,
    autoCapitalize,
    autoComplete,
    autoCorrect,
    autoFocus,
    disabled,
    maxLength,
    placeholder,
    caretColor,
    readOnly,
    id,
    value,
    placeholderTextColor,
    onChange,
    defaultValue,
    enterKeyHint,
    selectionColor,
    spellCheck,
    textAlign,
  } as any

  usePseudoColorApplier(ref, placeholderTextColor, selectionColor)

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

function usePseudoColorApplier(
  ref: React.RefObject<HTMLInputElement>,
  placeholderColor?: ColorTokens,
  selectionColor?: ColorTokens
) {
  const theme = useTheme()
  useEffect(() => {
    if (placeholderColor) {
      ref.current?.style.setProperty(
        '--placeholder-color',
        theme[placeholderColor]?.variable || placeholderColor
      )
    }
  }, [placeholderColor])

  useEffect(() => {
    if (selectionColor) {
      ref.current?.style.setProperty(
        '--selection-color',
        theme[selectionColor]?.variable || selectionColor
      )
    }
  }, [selectionColor])
}
