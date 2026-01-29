import type {
  ColorTokens,
  ViewProps,
  TamaguiComponentPropsBase,
  TextProps,
} from '@tamagui/web'
import type { TextInputProps, InputModeOptions } from 'react-native'

type DetailedInputProps = React.DetailedHTMLProps<
  React.HTMLProps<HTMLInputElement>,
  HTMLInputElement
>

export type InputProps = ViewProps &
  Omit<
    DetailedInputProps,
    'className' | 'children' | 'value' | 'size' | keyof ViewProps
  > &
  Pick<TextProps, 'color'> &
  Omit<DetailedInputProps['style'], 'color'> &
  Omit<
    TextInputProps,
    | 'inputMode'
    | 'secureTextEntry'
    | 'onChangeText'
    | 'editable'
    | 'enterKeyHint'
    | 'keyboardType'
    | 'placeholderTextColor'
    | 'selectionColor'
    | 'numberOfLines'
  > & {
    /**
     * @deprecated - use `type="password"` instead
     */
    secureTextEntry?: TextInputProps['secureTextEntry']
    /**
     * @deprecated - use `onChange` instead
     */
    onChangeText?: TextInputProps['onChangeText']
    /**
     * @deprecated - use `readOnly` instead
     */
    editable?: TextInputProps['editable']
    enterKeyHint?: 'done' | 'go' | 'next' | 'search' | 'send' | 'enter' | 'previous'
    /**
     * @deprecated - use `type` instead
     */
    keyboardType?: TextInputProps['keyboardType']
    /**
     * use `type` instead of inputMode for most cases, use `inputMode="none"` to disable the soft keyboard
     */
    inputMode?: InputModeOptions
    placeholderTextColor?: ColorTokens
    selectionColor?: ColorTokens
    render?: TamaguiComponentPropsBase['render']
    /**
     * @deprecated - use `render='textarea'` instead
     */
    multiline?: boolean
    /**
     * @deprecated - use `rows` instead
     */
    numberOfLines?: number
  }
