/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ColorValue, GenericStyleProp } from '../types'
import type { TextStyle } from '../Text/types'
import type { ViewProps } from '../View/types'

export type TextInputStyle = {
  caretColor?: ColorValue
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
} & TextStyle

export type TextInputProps = {
  autoCapitalize?: 'characters' | 'none' | 'sentences' | 'words'
  autoComplete?: string | null
  autoCompleteType?: string | null // Compat with React Native (Bug react-native#26003),
  autoCorrect?: boolean | null
  autoFocus?: boolean | null
  blurOnSubmit?: boolean | null
  clearTextOnFocus?: boolean | null
  defaultValue?: string | null
  rows?: number | null
  readOnly?: boolean | null
  dir?: 'auto' | 'ltr' | 'rtl' | null
  disabled?: boolean | null
  editable?: boolean | null
  enterKeyHint?: 'done' | 'enter' | 'next' | 'search' | 'send'
  // react native
  inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
  inputAccessoryViewID?: string | null
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'number-pad'
    | 'decimal-pad'
    | 'numbers-and-punctuation'
    | 'numeric'
    | 'phone-pad'
    | 'search'
    | 'url'
    | 'web-search'
  maxLength?: number | null
  multiline?: boolean | null
  numberOfLines?: number | null
  onChange?: (e: any) => void
  onChangeText?: (e: string) => void
  onContentSizeChange?: (e: any) => void
  onEndEditing?: (e: any) => void
  onKeyPress?: (e: any) => void
  onSelectionChange?: (e: any) => void
  onScroll?: (e: any) => void
  onSubmitEditing?: (e: any) => void
  placeholder?: string | null
  placeholderTextColor?: ColorValue | null
  returnKeyType?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'
  secureTextEntry?: boolean | null
  selectTextOnFocus?: boolean | null
  selection?: {
    start: number
    end?: number
  }
  selectionColor?: ColorValue | null
  spellCheck?: boolean | null
  style?: GenericStyleProp<TextInputStyle> | null
  value?: string | null
} & ViewProps
