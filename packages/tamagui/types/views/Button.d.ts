import { GetProps, ReactComponentWithRef, ThemeableProps } from '@tamagui/core';
import { FunctionComponent } from 'react';
import { View } from 'react-native';
import { SizableTextProps } from './SizableText';
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
declare const ButtonFrame: import("@tamagui/core").TamaguiComponent<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    bordered?: boolean | undefined;
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "active" | "circular"> & {
    active?: boolean | undefined;
    circular?: boolean | undefined;
} & import("@tamagui/core").MediaProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    bordered?: boolean | undefined;
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "active" | "circular"> & {
    active?: boolean | undefined;
    circular?: boolean | undefined;
}>> & import("@tamagui/core").PseudoProps<Partial<Omit<import("react-native").ViewProps, "children" | "display"> & import("@tamagui/core").RNWViewProps & import("@tamagui/core").TamaguiComponentPropsBase & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & Omit<{
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    bordered?: boolean | undefined;
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
}, "active" | "circular"> & {
    active?: boolean | undefined;
    circular?: boolean | undefined;
}>>, any, import("@tamagui/core").StackPropsBase, {
    fullscreen?: boolean | undefined;
    elevation?: import("@tamagui/core").SizeTokens | undefined;
} & {
    hoverable?: boolean | undefined;
    pressable?: boolean | undefined;
    focusable?: boolean | undefined;
    bordered?: boolean | undefined;
    size?: import("@tamagui/core").SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    chromeless?: boolean | undefined;
} & {
    active?: boolean | undefined;
    circular?: boolean | undefined;
}>;
export declare const Button: ReactComponentWithRef<ButtonProps, HTMLButtonElement | View>;
export declare const getSpaceSize: (size: any, sizeUpOrDownBy?: number) => import("@tamagui/core").Variable;
export {};
//# sourceMappingURL=Button.d.ts.map