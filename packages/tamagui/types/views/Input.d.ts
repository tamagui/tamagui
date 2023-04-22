/// <reference types="react" />
import { ColorStyleProp, GetProps, ModifyTamaguiComponentStyleProps } from '@tamagui/core';
import { ColorValue, TextInput } from 'react-native';
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
        readonly outlineWidth: 2;
        readonly outlineStyle: "solid";
        readonly borderColor: "$borderColorFocus";
    };
};
declare const InputFramePreTyped: import("@tamagui/core").TamaguiComponent<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
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
}, {
    prototype: TextInput;
    State: import("react-native").TextInputState;
    contextType: import("react").Context<any> | undefined;
}>;
type InputFrameType = ModifyTamaguiComponentStyleProps<typeof InputFramePreTyped, {
    placeholderTextColor?: ColorStyleProp | ColorValue;
}>;
export declare const InputFrame: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>>, "placeholderTextColor"> & {
    placeholderTextColor?: string | import("react-native").OpaqueColorValue | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | undefined;
}, import("@tamagui/core").TamaguiElement, import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps>, {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}, {
    prototype: TextInput;
    State: import("react-native").TextInputState;
    contextType: import("react").Context<any> | undefined;
}>;
export type InputProps = GetProps<InputFrameType>;
export declare const Input: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}>>, "placeholderTextColor"> & {
    placeholderTextColor?: string | import("react-native").OpaqueColorValue | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | undefined;
}, import("@tamagui/core").TamaguiElement, import("react-native").TextInputProps & Omit<import("@tamagui/core").TextProps, keyof import("react-native").TextInputProps>, {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
}, {
    prototype: TextInput;
    State: import("react-native").TextInputState;
    contextType: import("react").Context<any> | undefined;
}>;
export {};
//# sourceMappingURL=Input.d.ts.map