import type { ColorTokens, StackProps, TextProps } from '@tamagui/web';
/**
 * Web-aligned Input props
 * Follows standard HTML input API as primary, with minimal RN compatibility
 */
type HTMLInputProps = React.InputHTMLAttributes<HTMLInputElement>;
export type InputProps = StackProps & Omit<HTMLInputProps, 'size' | 'color' | 'style' | 'children' | 'className'> & Pick<TextProps, 'color'> & {
    /**
     * Rows for textarea (when tag="textarea")
     */
    rows?: number;
    /**
     * Placeholder text color - accepts Tamagui color tokens
     */
    placeholderTextColor?: ColorTokens;
    /**
     * Text selection color - accepts Tamagui color tokens
     */
    selectionColor?: ColorTokens;
    /**
     * Callback when text changes - provides just the string value
     * @deprecated Use onChange instead for web alignment
     */
    onChangeText?: (text: string) => void;
    /**
     * Callback when Enter/Return is pressed
     */
    onSubmitEditing?: (e: {
        nativeEvent: {
            text: string;
        };
    }) => void;
    /**
     * Selection range
     */
    selection?: {
        start: number;
        end?: number;
    };
    /**
     * Callback when selection changes
     */
    onSelectionChange?: (e: {
        nativeEvent: {
            selection: {
                start: number;
                end: number;
            };
        };
    }) => void;
};
export {};
//# sourceMappingURL=types.d.ts.map