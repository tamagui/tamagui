import { GetProps, ReactComponentWithRef } from '@tamagui/web';
import * as React from 'react';
import { View } from 'react-native';
export declare const LabelFrame: import("@tamagui/web").TamaguiComponent<Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/web").SizeTokens | undefined;
} & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/web").SizeTokens | undefined;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/web").SizeTokens | undefined;
}>>, import("@tamagui/web").TamaguiElement, import("@tamagui/web").TextPropsBase, {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
} & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("@tamagui/web").SizeTokens | undefined;
}, {
    displayName: string | undefined;
    __baseProps: Omit<import("react-native").TextProps, "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/web").ExtendBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").TextStyle | React.CSSProperties | (React.CSSProperties & import("react-native").TextStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>;
    __variantProps: {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    };
}>;
export type LabelProps = GetProps<typeof LabelFrame> & {
    htmlFor?: string;
};
export declare const Label: ReactComponentWithRef<LabelProps, HTMLButtonElement | View>;
export declare const useLabelContext: (element?: HTMLElement | null) => string | undefined;
//# sourceMappingURL=Label.d.ts.map