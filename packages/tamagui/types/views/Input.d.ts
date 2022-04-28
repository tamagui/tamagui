import { GetProps } from '@tamagui/core';
export declare const inputStyle: {
    readonly borderWidth: 1;
    readonly color: "$color";
    readonly borderColor: "$borderColor";
    readonly backgroundColor: "$background";
    readonly paddingVertical: "$2";
    readonly paddingHorizontal: "$2";
    readonly hoverStyle: {
        readonly borderColor: "$borderColorHover";
    };
    readonly focusStyle: {
        readonly borderColor: "$borderColorFocus";
        readonly shadowColor: "$borderColorFocus";
        readonly shadowOffset: {
            readonly width: 0;
            readonly height: 0;
        };
        readonly shadowOpacity: 1;
        readonly shadowRadius: 10;
    };
    readonly variants: {
        readonly size: {
            readonly '...size': import("@tamagui/core").SizeVariantSpreadFunction<any>;
        };
    };
    readonly defaultVariants: {
        readonly size: "$4";
    };
};
export declare const Input: import("@tamagui/core").TamaguiComponent<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>>, any, import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps>, {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>;
export declare type InputProps = GetProps<typeof Input>;
//# sourceMappingURL=Input.d.ts.map