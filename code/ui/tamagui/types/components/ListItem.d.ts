import { type ComponentSize, type GetProps } from '@tamagui/core';
import { type ListItemIconProps as ListItemBehaviorIconProps } from '@tamagui/list-item';
export type ListItemSize = ComponentSize | boolean;
export declare const ListItemFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: string | boolean | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const ListItemText: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: string | number | boolean | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const ListItemTitle: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: string | number | boolean | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const ListItemSubtitle: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: string | number | boolean | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const ListItemIcon: ({ children, size, scaleIcon, }: ListItemBehaviorIconProps) => any;
declare const ListItemComponent: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").StackNonStyleProps, "maxFontSizeMultiplier" | "noTextWrap" | "size" | "textProps" | ("color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection") | keyof {
    children?: import("react").ReactNode;
    icon?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconSize?: string | number | boolean;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
}> & Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/core").WithShorthands<Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
    maxFontSizeMultiplier?: number;
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    children?: import("react").ReactNode;
    icon?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconSize?: string | number | boolean;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
} & {
    color?: import("@tamagui/core").ColorTokens | string;
    size?: string | boolean;
}, import("@tamagui/core").StackStyleBase, Omit<{
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: string | boolean | undefined;
    variant?: "outlined" | undefined;
}, "maxFontSizeMultiplier" | "noTextWrap" | "size" | "textProps" | ("color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection") | keyof {
    children?: import("react").ReactNode;
    icon?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconSize?: string | number | boolean;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
}>, import("@tamagui/core").StaticConfigPublic>;
export declare const ListItem: import("@tamagui/core").Combined<import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").StackNonStyleProps, "maxFontSizeMultiplier" | "noTextWrap" | "size" | "textProps" | ("color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection") | keyof {
    children?: import("react").ReactNode;
    icon?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconSize?: string | number | boolean;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
}> & Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/core").WithShorthands<Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
    maxFontSizeMultiplier?: number;
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    children?: import("react").ReactNode;
    icon?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconSize?: string | number | boolean;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
} & {
    color?: import("@tamagui/core").ColorTokens | string;
    size?: string | boolean;
}, import("@tamagui/core").StackStyleBase, Omit<{
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: string | boolean | undefined;
    variant?: "outlined" | undefined;
}, "maxFontSizeMultiplier" | "noTextWrap" | "size" | "textProps" | ("color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection") | keyof {
    children?: import("react").ReactNode;
    icon?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconSize?: string | number | boolean;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
}>, import("@tamagui/core").StaticConfigPublic>, {
    Apply: import("react").Provider<{
        size?: string | boolean;
        variant?: 'outlined';
        color?: import("@tamagui/core").ColorTokens | string;
    }> & import("react").ProviderExoticComponent<Partial<{
        size?: string | boolean;
        variant?: 'outlined';
        color?: import("@tamagui/core").ColorTokens | string;
    }> & {
        children?: import("react").ReactNode;
        scope?: string;
    }>;
    Frame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: string | boolean | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Icon: typeof ListItemIcon;
    Subtitle: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: string | number | boolean | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Text: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: string | number | boolean | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Title: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: string | number | boolean | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
}>;
export type ListItemProps = GetProps<typeof ListItemComponent>;
export {};
//# sourceMappingURL=ListItem.d.ts.map