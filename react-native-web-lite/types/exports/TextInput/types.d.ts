import { ColorValue, GenericStyleProp } from '../../types';
import { TextStyle } from '../Text/types';
import { ViewProps } from '../View/types';
export declare type TextInputStyle = {
    caretColor?: ColorValue;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
} & TextStyle;
export declare type TextInputProps = {
    autoCapitalize?: 'characters' | 'none' | 'sentences' | 'words';
    autoComplete?: string | null;
    autoCompleteType?: string | null;
    autoCorrect?: boolean | null;
    autoFocus?: boolean | null;
    blurOnSubmit?: boolean | null;
    clearTextOnFocus?: boolean | null;
    defaultValue?: string | null;
    dir?: 'auto' | 'ltr' | 'rtl' | null;
    disabled?: boolean | null;
    editable?: boolean | null;
    inputAccessoryViewID?: string | null;
    keyboardType?: 'default' | 'email-address' | 'number-pad' | 'numbers-and-punctuation' | 'numeric' | 'phone-pad' | 'search' | 'url' | 'web-search';
    maxLength?: number | null;
    multiline?: boolean | null;
    numberOfLines?: number | null;
    onChange?: (e: any) => void;
    onChangeText?: (e: string) => void;
    onContentSizeChange?: (e: any) => void;
    onEndEditing?: (e: any) => void;
    onKeyPress?: (e: any) => void;
    onSelectionChange?: (e: any) => void;
    onScroll?: (e: any) => void;
    onSubmitEditing?: (e: any) => void;
    placeholder?: string | null;
    placeholderTextColor?: ColorValue | null;
    returnKeyType?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
    secureTextEntry?: boolean | null;
    selectTextOnFocus?: boolean | null;
    selection?: {
        start: number;
        end?: number;
    };
    selectionColor?: ColorValue | null;
    spellCheck?: boolean | null;
    style?: GenericStyleProp<TextInputStyle> | null;
    value?: string | null;
} & ViewProps;
//# sourceMappingURL=types.d.ts.map