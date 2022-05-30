import { GetProps, ReactComponentWithRef, ThemeableProps } from '@tamagui/core';
import { SizableTextProps } from '@tamagui/text';
import { FunctionComponent } from 'react';
import { View } from 'react-native';
declare type ButtonIconProps = {
    color?: string;
    size?: number;
};
declare type IconProp = JSX.Element | FunctionComponent<ButtonIconProps> | null;
export declare type ButtonProps = GetProps<typeof ButtonFrame> & ThemeableProps & {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    noTextWrap?: boolean;
    spaceFlex?: number | boolean;
    scaleSpace?: number;
    color?: SizableTextProps['color'];
    fontWeight?: SizableTextProps['fontWeight'];
    fontSize?: SizableTextProps['fontSize'];
    fontFamily?: SizableTextProps['fontFamily'];
    letterSpacing?: SizableTextProps['letterSpacing'];
    textAlign?: SizableTextProps['textAlign'];
    textProps?: Partial<SizableTextProps>;
};
declare const ButtonFrame: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "disabled" | "size" | "active"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "disabled" | "size" | "active"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "disabled" | "size" | "active"> & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
}>>, {
    readonly size: {
        readonly '...size': (val: import("@tamagui/core").SizeTokens, extras: import("@tamagui/core").VariantSpreadExtras<any>) => {
            minHeight: number;
            borderRadius: any;
            paddingHorizontal: number;
            paddingVertical: number;
        };
    };
    readonly active: {
        readonly true: {
            readonly hoverStyle: {
                readonly backgroundColor: "$background";
            };
        };
    };
    readonly disabled: {
        readonly true: {
            readonly opacity: 0.5;
            readonly pointerEvents: "none";
        };
    };
}, import("@tamagui/core").StackPropsBase, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    fontFamily?: unknown;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    circular?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
} & {
    readonly size?: import("@tamagui/core").SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
}>;
export declare const ButtonText: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size"> & {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size"> & {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").TextProps, "children"> & import("@tamagui/core").RNWTextProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & Omit<{}, "size"> & {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
}>>, void, import("@tamagui/core").TextPropsBase, {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
}>;
export declare const Button: ReactComponentWithRef<ButtonProps, HTMLButtonElement | View>;
export {};
//# sourceMappingURL=Button.d.ts.map