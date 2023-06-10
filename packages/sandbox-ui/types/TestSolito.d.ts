/// <reference types="react" />
import { LinkCoreProps } from 'solito/link';
import { AnchorProps } from 'tamagui';
export type TextLinkProps = Pick<LinkCoreProps, 'href' | 'target'> & AnchorProps;
export declare const TextLink: import("react").ForwardRefExoticComponent<Pick<LinkCoreProps, "target" | "href"> & Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("tamagui").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").TextStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("tamagui").FontSizeTokens | undefined;
} & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("tamagui").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").TextStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("tamagui").FontSizeTokens | undefined;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers | "style"> & import("@tamagui/web").ExtendBaseTextProps & import("tamagui").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").TextStyle | import("react").CSSProperties | (import("react").CSSProperties & import("react-native").TextStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: import("tamagui").FontSizeTokens | undefined;
}>> & {
    href?: string | undefined;
    target?: string | undefined;
    rel?: string | undefined;
} & import("react").RefAttributes<HTMLAnchorElement>>;
//# sourceMappingURL=TestSolito.d.ts.map