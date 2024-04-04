/// <reference types="react" />
import { ColorTokens, StackProps, TamaguiComponentPropsBase } from '@tamagui/web/types';
import type { TextInputProps, InputModeOptions } from 'react-native';
type DetailedInputProps = React.DetailedHTMLProps<React.HTMLProps<HTMLInputElement>, HTMLInputElement>;
export type InputProps = StackProps & Omit<DetailedInputProps, 'className' | 'children' | 'value' | 'size' | keyof StackProps> & DetailedInputProps['style'] & Omit<TextInputProps, 'inputMode' | 'secureTextEntry' | 'onChangeText' | 'editable' | 'enterKeyHint' | 'keyboardType' | 'placeholderTextColor' | 'selectionColor'> & {
    /**
     * @deprecated
     * use type="password" instead
     */
    secureTextEntry?: TextInputProps['secureTextEntry'];
    /**
     * @deprecated
     * use onChange instead
     */
    onChangeText?: TextInputProps['onChange'];
    /**
     * @deprecated
     * use readOnly instead
     */
    editable?: TextInputProps['editable'];
    enterKeyHint?: 'done' | 'go' | 'next' | 'search' | 'send' | 'enter' | 'previous';
    /**
     * @deprecated
     * use type instead
     */
    keyboardType?: TextInputProps['keyboardType'];
    /**
     * use `type` instead of inputMode for most cases, use `inputMode="none"` to disable the soft keyboard
     */
    inputMode?: InputModeOptions;
    placeholderTextColor?: ColorTokens;
    selectionColor?: ColorTokens;
    tag?: TamaguiComponentPropsBase['tag'];
    /**
     * @deprecated
     * use tag: 'textarea' instead
     */
    multiline?: boolean;
};
export {};
//# sourceMappingURL=type.d.ts.map