import React, { type HTMLInputTypeAttribute, type HTMLAttributes } from 'react'
import { View, styled, useComposedRefs, useEvent, useTheme } from '@tamagui/core'
import { registerFocusable } from '@tamagui/focusable'
import type { InputModeOptions } from 'react-native'

import { styledBody } from './shared'
import type { InputProps } from './types'
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

  React.useEffect(() => {
    if (onSelectionChange) {
      ref.current?.addEventListener('selectionchange', _onSelectionChange)
      return () => {
        ref.current?.removeEventListener('selectionchange', _onSelectionChange)
      }
    }
  }, [])

  React.useEffect(() => {
    if (selection) {
      ref.current?.setSelectionRange(selection.start || null, selection.end || null)
    }
  }, [selection?.start, selection?.end])

  const finalProps = {
    ...rest,
    disabled,
    caretColor,
    id,
    enterKeyHint,
    ...(process.env.TAMAGUI_TARGET === 'web'
      ? {
          type: (() => {
            if (secureTextEntry) return 'password'
            switch (keyboardType) {
              case 'number-pad':
              case 'numeric':
                return 'number'
              case 'email-address':
                return 'email'
              case 'phone-pad':
                return 'tel'
              case 'url':
                return 'url'
              default:
                return 'text'
            }
          })() satisfies HTMLInputTypeAttribute,
          inputMode: (() => {
            switch (keyboardType) {
              case 'number-pad':
              case 'numeric':
                return 'numeric'
              case 'decimal-pad':
                return 'decimal'
              case 'email-address':
                return 'email'
              case 'phone-pad':
                return 'tel'
              case 'url':
                return 'url'
              default:
                return undefined
            }
          })() satisfies HTMLAttributes<HTMLInputElement>['inputMode'],
        }
      : {
          keyboardType,
          secureTextEntry,
          inputMode,
        }),
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

  React.useEffect(() => {
    if (!id) return
    if (disabled) return

    return registerFocusable(id, {
      focusAndSelect: () => {
        ref.current?.focus()
      },
      focus: () => {},
    })
  }, [id, disabled])

  return (
    <>
      {process.env.TAMAGUI_TARGET === 'web' && (
        <style>
          {`
      input::selection, textarea::selection {
        background-color: var(--selectionBackground) !important;
      }
      
      input::placeholder, textarea::placeholder {
        color: var(--placeholderColor) !important;
      }
      `}
        </style>
      )}

      <StyledInput ref={composedRefs} {...finalProps} />
    </>
  )
})
