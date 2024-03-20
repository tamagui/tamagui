import type { TextParentStyles } from '@tamagui/text';
import type { FontSizeTokens, GetProps, SizeTokens, ThemeableProps } from '@tamagui/web';
import type { FunctionComponent } from 'react';
import React from 'react';
type ListItemIconProps = {
    color?: any;
    size?: any;
};
type IconProp = JSX.Element | FunctionComponent<ListItemIconProps> | null;
export type ListItemExtraProps = Omit<TextParentStyles, 'TextComponent' | 'noTextWrap'> & ThemeableProps & {
    /**
     * @deprecated use ListItem.Icon instead
     */
    icon?: IconProp;
    /**
     * @deprecated use ListItem.Icon instead
     */
    iconAfter?: IconProp;
    /**
     * adjust icon relative to size
     */
    /**
     * default: -1
     */
    scaleIcon?: number;
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean;
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number;
    /**
     * title
     * @deprecated use ListItem.Title instead
     */
    title?: React.ReactNode;
    /**
     * subtitle
     * @deprecated use ListItem.Subtitle instead
     */
    subTitle?: React.ReactNode;
    /**
     * will not wrap text around `children` only, "all" will not wrap title or subTitle
     */
    noTextWrap?: boolean | 'all';
};
export type ListItemProps = GetProps<typeof ListItemFrame> & ListItemExtraProps;
export declare const ListItemFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: SizeTokens | undefined;
    unstyled?: boolean | undefined;
    disabled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    active?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const ListItemText: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const ListItemSubtitle: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: number | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${string}` | `$${number}` | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const ListItemTitle: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const IconFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    after?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const ListItemIcon: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    after?: boolean | undefined;
}>, "scaleIcon"> & {
    scaleIcon?: number | undefined;
}, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & {
    scaleIcon?: number | undefined;
}, import("@tamagui/web").StackStyleBase, {
    after?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const TextContent: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
export {};
//# sourceMappingURL=ListItem.d.ts.map