import { GetProps } from '@tamagui/core';
export declare const inputStyle: {
    borderRadius: string;
    borderWidth: number;
    color: string;
    borderColor: string;
    backgroundColor: string;
    paddingVertical: string;
    paddingHorizontal: string;
    hoverStyle: {
        borderColor: string;
    };
    focusStyle: {
        borderColor: string;
        shadowColor: string;
        shadowOffset: {
            width: number;
            height: number;
        };
        shadowOpacity: number;
        shadowRadius: number;
    };
    variants: {
        size: {
            '...size': import("@tamagui/core").SizeVariantSpreadFunction<any>;
        };
    };
};
export declare const Input: import("@tamagui/core").TamaguiComponent<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<Object, "size"> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<Object, "size"> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<Object, "size"> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
}>>, any, import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps>, Object & {
    size?: import("@tamagui/core").SizeTokens | undefined;
}>;
export declare type InputProps = GetProps<typeof Input>;
//# sourceMappingURL=Input.d.ts.map