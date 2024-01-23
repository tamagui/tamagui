import { InputExtraProps, InputProps } from './Input';
/**
 * Is basically Input but with rows = 4 to start
 */
export declare const TextAreaFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("react-native").TextInput, import("@tamagui/web/types/interfaces/TamaguiComponentPropsBaseBase").TamaguiComponentPropsBaseBase & import("react-native").TextInputProps, import("@tamagui/core").TextStylePropsBase & {
    placeholderTextColor?: `$${string}` | `$${number}` | undefined;
}, {
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}, typeof import("react-native").TextInput>;
export type TextAreaProps = InputProps;
export declare const TextArea: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("react-native").TextInput, import("@tamagui/web/types/interfaces/TamaguiComponentPropsBaseBase").TamaguiComponentPropsBaseBase & import("react-native").TextInputProps & InputExtraProps, Omit<import("@tamagui/core").TextStylePropsBase & {
    placeholderTextColor?: `$${string}` | `$${number}` | undefined;
}, "rows">, {
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}, typeof import("react-native").TextInput>;
//# sourceMappingURL=TextArea.d.ts.map