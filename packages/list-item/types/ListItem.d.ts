import { TextParentStyles } from '@tamagui/text';
import { FontSizeTokens, GetProps, PropsWithoutMediaStyles, SizeTokens, ThemeableProps } from '@tamagui/web';
import React, { FunctionComponent } from 'react';
type ListItemIconProps = {
    color?: string;
    size?: number;
};
type IconProp = JSX.Element | FunctionComponent<ListItemIconProps> | null;
type ListItemExtraProps = Omit<TextParentStyles, 'TextComponent' | 'noTextWrap'> & ThemeableProps & {
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
    title?: React.ReactNode;
    /**
     * subtitle
     */
    subTitle?: React.ReactNode;
    /**
     * will not wrap text around `children` only, "all" will not wrap title or subTitle
     */
    noTextWrap?: boolean | 'all';
};
export type ListItemProps = GetProps<typeof ListItemFrame> & ListItemExtraProps;
export declare const ListItemFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
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
}, {}>;
export declare const ListItemText: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: FontSizeTokens | undefined;
}, {}>;
export declare const ListItemSubtitle: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: number | `$${string}` | `$${number}` | import("@tamagui/web").UnionableString | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/web").UnionableNumber | undefined;
}, {}>;
export declare const ListItemTitle: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: FontSizeTokens | undefined;
}, {}>;
export declare const useListItem: (propsIn: ListItemProps, { Text, Subtitle, Title, }?: {
    Title?: any;
    Subtitle?: any;
    Text?: any;
}) => {
    props: PropsWithoutMediaStyles<ListItemProps>;
};
export declare const ListItem: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<TextParentStyles, "TextComponent" | "noTextWrap"> & ThemeableProps & {
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
    title?: React.ReactNode;
    /**
     * subtitle
     */
    subTitle?: React.ReactNode;
    /**
     * will not wrap text around `children` only, "all" will not wrap title or subTitle
     */
    noTextWrap?: boolean | "all" | undefined;
}, "alignItems" | "justifyContent" | "flexWrap" | "width" | "borderColor" | "maxWidth" | "overflow" | "flexDirection" | "backgroundColor" | "pointerEvents" | "display" | "x" | "y" | "perspective" | "scale" | "scaleX" | "scaleY" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "contain" | "touchAction" | "cursor" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "userSelect" | "space" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "transformOrigin" | "backfaceVisibility" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "alignContent" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "bottom" | "end" | "flex" | "flexBasis" | "rowGap" | "gap" | "columnGap" | "flexGrow" | "flexShrink" | "height" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "minHeight" | "minWidth" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "right" | "start" | "top" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY"> & import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, "noTextWrap" | keyof import("@tamagui/text").TextContextStyles | "textProps" | keyof ThemeableProps | "icon" | "iconAfter" | "scaleIcon" | "spaceFlex" | "scaleSpace" | "title" | "subTitle">, {
    unstyled?: boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
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
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, "noTextWrap" | keyof import("@tamagui/text").TextContextStyles | "textProps" | keyof ThemeableProps | "icon" | "iconAfter" | "scaleIcon" | "spaceFlex" | "scaleSpace" | "title" | "subTitle">, {
    unstyled?: boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
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
}>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, "noTextWrap" | keyof import("@tamagui/text").TextContextStyles | "textProps" | keyof ThemeableProps | "icon" | "iconAfter" | "scaleIcon" | "spaceFlex" | "scaleSpace" | "title" | "subTitle">, {
    unstyled?: boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
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
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<Omit<import("@tamagui/web").StackStyleBase, "noTextWrap" | keyof import("@tamagui/text").TextContextStyles | "textProps" | keyof ThemeableProps | "icon" | "iconAfter" | "scaleIcon" | "spaceFlex" | "scaleSpace" | "title" | "subTitle">, {
    unstyled?: boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
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
}>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<Omit<import("@tamagui/web").StackStyleBase, "noTextWrap" | keyof import("@tamagui/text").TextContextStyles | "textProps" | keyof ThemeableProps | "icon" | "iconAfter" | "scaleIcon" | "spaceFlex" | "scaleSpace" | "title" | "subTitle">, {
    unstyled?: boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
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
}>> & React.RefAttributes<import("@tamagui/web").TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<TextParentStyles, "TextComponent" | "noTextWrap"> & ThemeableProps & {
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
    title?: React.ReactNode;
    /**
     * subtitle
     */
    subTitle?: React.ReactNode;
    /**
     * will not wrap text around `children` only, "all" will not wrap title or subTitle
     */
    noTextWrap?: boolean | "all" | undefined;
}, Omit<import("@tamagui/web").StackStyleBase, "noTextWrap" | keyof import("@tamagui/text").TextContextStyles | "textProps" | keyof ThemeableProps | "icon" | "iconAfter" | "scaleIcon" | "spaceFlex" | "scaleSpace" | "title" | "subTitle">, {
    unstyled?: boolean | undefined;
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
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
}, {}> & Omit<{}, "staticConfig" | "extractable" | "styleable"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<TextParentStyles, "TextComponent" | "noTextWrap"> & ThemeableProps & {
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
        title?: React.ReactNode;
        /**
         * subtitle
         */
        subTitle?: React.ReactNode;
        /**
         * will not wrap text around `children` only, "all" will not wrap title or subTitle
         */
        noTextWrap?: boolean | "all" | undefined;
    }, Omit<import("@tamagui/web").StackStyleBase, "noTextWrap" | keyof import("@tamagui/text").TextContextStyles | "textProps" | keyof ThemeableProps | "icon" | "iconAfter" | "scaleIcon" | "spaceFlex" | "scaleSpace" | "title" | "subTitle">, {
        unstyled?: boolean | undefined;
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
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
    }, {}];
} & {
    Text: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: FontSizeTokens | undefined;
    }, {}>;
    Subtitle: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: number | `$${string}` | `$${number}` | import("@tamagui/web").UnionableString | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/web").UnionableNumber | undefined;
    }, {}>;
};
export {};
//# sourceMappingURL=ListItem.d.ts.map