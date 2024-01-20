import { InputProps } from './Input';
/**
 * Is basically Input but with rows = 4 to start
 */
export declare const TextAreaFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("react-native").TextInput, import("@tamagui/core").TamaguiComponentPropsBaseBase & import("react-native").TextInputProps, import("@tamagui/core").TextStylePropsBase & {
    placeholderTextColor?: `$${string}` | `$${number}` | undefined;
}, {
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}, typeof import("react-native").TextInput>;
export type TextAreaProps = InputProps;
export declare const TextArea: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TamaguiComponentPropsBaseBase & import("react-native").TextInputProps, import("@tamagui/core").TextStylePropsBase & {
    placeholderTextColor?: `$${string}` | `$${number}` | undefined;
} & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, "rows"> & {
    rows?: number | undefined;
}, import("react-native").TextInput, import("@tamagui/core").TamaguiComponentPropsBaseBase & import("react-native").TextInputProps & {
    rows?: number | undefined;
}, import("@tamagui/core").TextStylePropsBase & {
    placeholderTextColor?: `$${string}` | `$${number}` | undefined;
}, {
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}, typeof import("react-native").TextInput>;
//# sourceMappingURL=TextArea.d.ts.map