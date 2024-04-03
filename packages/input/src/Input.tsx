import React, { useEffect } from 'react'
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
import { defaultStyles, inputSizeVariant } from './shared'
const INPUT_NAME = 'Input'
const StyledInput = styled(
  View,
  {
    name: INPUT_NAME,
    tag: 'input',
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
    disabled,
    caretColor,
    id,
    enterKeyHint,
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
        '--placeholderTextColor',
        theme[placeholderColor]?.variable || placeholderColor
      )
    }
  }, [placeholderColor])

  useEffect(() => {
    if (selectionColor) {
      ref.current?.style.setProperty(
        '--selectionBackground',
        theme[selectionColor]?.variable || selectionColor
      )
    }
  }, [selectionColor])
}
