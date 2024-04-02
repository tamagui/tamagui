import type { InputHTMLAttributes } from 'react'
import type { TextInputProps, InputModeOptions } from 'react-native'

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'style' | 'className' | 'children' | 'value'
> &
  InputHTMLAttributes<HTMLInputElement>['style'] & {
    value?: string
  } & Omit<
    TextInputProps,
    | 'inputMode'
    | 'secureTextEntry'
    | 'onChangeText'
    | 'editable'
    | 'enterKeyHint'
    | 'keyboardType'
  > & {
    /**
     * @deprecated
     * use type="password" instead
     */
    secureTextEntry?: TextInputProps['secureTextEntry']
    /**
     * @deprecated
     * use onChange instead
     */
    onChangeText?: TextInputProps['onChange']
    /**
     * @deprecated
     * use readOnly instead
     */
    editable?: TextInputProps['editable']
    enterKeyHint?: 'done' | 'go' | 'next' | 'search' | 'send' | 'enter' | 'previous'
    /**
     * @deprecated
     * use type instead
     */
    keyboardType?: TextInputProps['keyboardType']
    /**
     * use `type` instead of inputMode for most cases, use `inputMode="none"` to disable the soft keyboard
     */
    inputMode?: InputModeOptions
  }
