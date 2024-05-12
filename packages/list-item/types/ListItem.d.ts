import type { TextParentStyles } from '@tamagui/text';
import type { FontSizeTokens, GetProps, PropsWithoutMediaStyles, SizeTokens, ThemeableProps } from '@tamagui/web';
import type { FunctionComponent, ReactNode } from 'react';
type ListItemIconProps = {
    color?: any;
    size?: any;
};
type IconProp = JSX.Element | FunctionComponent<ListItemIconProps> | null;
export type ListItemExtraProps = Omit<TextParentStyles, 'TextComponent' | 'noTextWrap'> & ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp;
    /**
     * add icon after, passes color and size automatically if Component
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
     */
    title?: ReactNode;
    /**
     * subtitle
     */
    subTitle?: ReactNode;
    /**
     * will not wrap text around `children` only, "all" will not wrap title or subTitle
     */
    noTextWrap?: boolean | 'all';
};
export type ListItemProps = GetProps<typeof ListItemFrame> & ListItemExtraProps;
export declare const ListItemFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    unstyled?: boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
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
    unstyled?: boolean | undefined;
    size?: FontSizeTokens | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const ListItemSubtitle: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: number | `$${string}` | `$${number}` | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const ListItemTitle: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: FontSizeTokens | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const useListItem: (propsIn: ListItemProps, { Text, Subtitle, Title, }?: {
    Title?: any;
    Subtitle?: any;
    Text?: any;
}) => {
    props: PropsWithoutMediaStyles<ListItemProps>;
};
export declare const ListItem: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    unstyled?: boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
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
}>, "noTextWrap" | keyof import("@tamagui/text").TextContextStyles | "textProps" | keyof ThemeableProps | "icon" | "iconAfter" | "scaleIcon" | "spaceFlex" | "scaleSpace" | "title" | "subTitle"> & Omit<TextParentStyles, "TextComponent" | "noTextWrap"> & ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp | undefined;
    /**
     * add icon after, passes color and size automatically if Component
     */
    iconAfter?: IconProp | undefined;
    /**
     * adjust icon relative to size
     */
    /**
     * default: -1
     */
    scaleIcon?: number | undefined;
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean | undefined;
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number | undefined;
    /**
     * title
     */
    title?: ReactNode;
    /**
     * subtitle
     */
    subTitle?: ReactNode;
    /**
     * will not wrap text around `children` only, "all" will not wrap title or subTitle
     */
    noTextWrap?: boolean | "all" | undefined;
} & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    unstyled?: boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
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
}>, "noTextWrap" | keyof import("@tamagui/text").TextContextStyles | "textProps" | keyof ThemeableProps | "icon" | "iconAfter" | "scaleIcon" | "spaceFlex" | "scaleSpace" | "title" | "subTitle"> & Omit<TextParentStyles, "TextComponent" | "noTextWrap"> & ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp | undefined;
    /**
     * add icon after, passes color and size automatically if Component
     */
    iconAfter?: IconProp | undefined;
    /**
     * adjust icon relative to size
     */
    /**
     * default: -1
     */
    scaleIcon?: number | undefined;
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean | undefined;
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number | undefined;
    /**
     * title
     */
    title?: ReactNode;
    /**
     * subtitle
     */
    subTitle?: ReactNode;
    /**
     * will not wrap text around `children` only, "all" will not wrap title or subTitle
     */
    noTextWrap?: boolean | "all" | undefined;
}, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<TextParentStyles, "TextComponent" | "noTextWrap"> & ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp | undefined;
    /**
     * add icon after, passes color and size automatically if Component
     */
    iconAfter?: IconProp | undefined;
    /**
     * adjust icon relative to size
     */
    /**
     * default: -1
     */
    scaleIcon?: number | undefined;
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean | undefined;
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number | undefined;
    /**
     * title
     */
    title?: ReactNode;
    /**
     * subtitle
     */
    subTitle?: ReactNode;
    /**
     * will not wrap text around `children` only, "all" will not wrap title or subTitle
     */
    noTextWrap?: boolean | "all" | undefined;
}, import("@tamagui/web").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    unstyled?: boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
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
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig" | "extractable" | "styleable"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        circular?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
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
    }>, "noTextWrap" | keyof import("@tamagui/text").TextContextStyles | "textProps" | keyof ThemeableProps | "icon" | "iconAfter" | "scaleIcon" | "spaceFlex" | "scaleSpace" | "title" | "subTitle"> & Omit<TextParentStyles, "TextComponent" | "noTextWrap"> & ThemeableProps & {
        /**
         * add icon before, passes color and size automatically if Component
         */
        icon?: IconProp | undefined;
        /**
         * add icon after, passes color and size automatically if Component
         */
        iconAfter?: IconProp | undefined;
        /**
         * adjust icon relative to size
         */
        /**
         * default: -1
         */
        scaleIcon?: number | undefined;
        /**
         * make the spacing elements flex
         */
        spaceFlex?: number | boolean | undefined;
        /**
         * adjust internal space relative to icon size
         */
        scaleSpace?: number | undefined;
        /**
         * title
         */
        title?: ReactNode;
        /**
         * subtitle
         */
        subTitle?: ReactNode;
        /**
         * will not wrap text around `children` only, "all" will not wrap title or subTitle
         */
        noTextWrap?: boolean | "all" | undefined;
    }, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<TextParentStyles, "TextComponent" | "noTextWrap"> & ThemeableProps & {
        /**
         * add icon before, passes color and size automatically if Component
         */
        icon?: IconProp | undefined;
        /**
         * add icon after, passes color and size automatically if Component
         */
        iconAfter?: IconProp | undefined;
        /**
         * adjust icon relative to size
         */
        /**
         * default: -1
         */
        scaleIcon?: number | undefined;
        /**
         * make the spacing elements flex
         */
        spaceFlex?: number | boolean | undefined;
        /**
         * adjust internal space relative to icon size
         */
        scaleSpace?: number | undefined;
        /**
         * title
         */
        title?: ReactNode;
        /**
         * subtitle
         */
        subTitle?: ReactNode;
        /**
         * will not wrap text around `children` only, "all" will not wrap title or subTitle
         */
        noTextWrap?: boolean | "all" | undefined;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        circular?: boolean | undefined;
        unstyled?: boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
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
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Text: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: FontSizeTokens | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Subtitle: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: number | `$${string}` | `$${number}` | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=ListItem.d.ts.map