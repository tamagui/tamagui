import { GetProps } from '@tamagui/core';
export declare const defaultStyles: {
    readonly size: "$true";
    readonly fontFamily: "$body";
    readonly borderWidth: 1;
    readonly outlineWidth: 0;
    readonly color: "$color";
    readonly focusable: true;
    readonly borderColor: "$borderColor";
    readonly backgroundColor: "$background";
    readonly placeholderTextColor: "$placeholderColor";
    readonly minWidth: 0;
    readonly hoverStyle: {
        readonly borderColor: "$borderColorHover";
    };
    readonly focusStyle: {
        readonly outlineColor: "$borderColorFocus";
        readonly outlineWidth: "2";
        readonly outlineStyle: "solid";
        readonly borderColor: "$borderColorFocus";
    };
};
export declare const InputFrame: import("@tamagui/core").TamaguiComponent<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>>, import("@tamagui/core").TamaguiElement, import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps>, {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>;
export type InputProps = GetProps<typeof InputFrame>;
export declare const Input: import("@tamagui/core").TamaguiComponent<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>>, import("@tamagui/core").TamaguiElement, import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps>, {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>;
//# sourceMappingURL=Input.d.ts.map