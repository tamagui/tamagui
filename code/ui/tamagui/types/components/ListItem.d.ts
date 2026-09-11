import { type GetProps } from '@tamagui/core';
export declare const ListItemFrame: import("react").FunctionComponent<Omit<import("@tamagui/core").StackNonStyleProps, "active" | "disabled" | "size" | "variant" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/core").Size | undefined;
    variant?: "outlined" | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
    ref?: import("react").Ref<import("@tamagui/core").TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/core").Size | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: import("@tamagui/core").Size | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
declare const ListItemComponent: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/core").Size | undefined;
    variant?: "outlined" | undefined;
}>, "maxFontSizeMultiplier" | "noTextWrap" | "size" | "textProps" | ("color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection") | keyof {
    children?: import("react").ReactNode;
    icon?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconSize?: import("@tamagui/core").SizeTokens | true;
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
    iconSize?: import("@tamagui/core").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
} & {
    color?: import("@tamagui/core").ColorTokens | string;
    size?: import("@tamagui/core").SizeTokens | true;
}, import("@tamagui/core").TamaguiElement, import("@tamagui/core").StackNonStyleProps & Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/core").WithShorthands<Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
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
    iconSize?: import("@tamagui/core").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
} & {
    color?: import("@tamagui/core").ColorTokens | string;
    size?: import("@tamagui/core").SizeTokens | true;
}, import("@tamagui/core").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/core").Size | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const ListItem: import("react").FunctionComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/core").Size | undefined;
    variant?: "outlined" | undefined;
}>, "maxFontSizeMultiplier" | "noTextWrap" | "size" | "textProps" | ("color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection") | keyof {
    children?: import("react").ReactNode;
    icon?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconSize?: import("@tamagui/core").SizeTokens | true;
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
    iconSize?: import("@tamagui/core").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
} & {
    color?: import("@tamagui/core").ColorTokens | string;
    size?: import("@tamagui/core").SizeTokens | true;
} & {
    ref?: import("react").Ref<import("@tamagui/core").TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/core").Size | undefined;
    variant?: "outlined" | undefined;
}>, "maxFontSizeMultiplier" | "noTextWrap" | "size" | "textProps" | ("color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection") | keyof {
    children?: import("react").ReactNode;
    icon?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | null;
    iconSize?: import("@tamagui/core").SizeTokens | true;
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
    iconSize?: import("@tamagui/core").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
} & {
    color?: import("@tamagui/core").ColorTokens | string;
    size?: import("@tamagui/core").SizeTokens | true;
}, import("@tamagui/core").TamaguiElement, import("@tamagui/core").StackNonStyleProps & Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/core").WithShorthands<Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
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
    iconSize?: import("@tamagui/core").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
} & {
    color?: import("@tamagui/core").ColorTokens | string;
    size?: import("@tamagui/core").SizeTokens | true;
}, import("@tamagui/core").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/core").Size | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: import("@tamagui/core").Size | undefined;
        variant?: "outlined" | undefined;
    }>, "maxFontSizeMultiplier" | "noTextWrap" | "size" | "textProps" | ("color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection") | keyof {
        children?: import("react").ReactNode;
        icon?: import("react").JSX.Element | import("react").FunctionComponent<{
            color?: any;
            size?: any;
        }> | null;
        iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
            color?: any;
            size?: any;
        }> | null;
        iconSize?: import("@tamagui/core").SizeTokens | true;
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
        iconSize?: import("@tamagui/core").SizeTokens | true;
        scaleIcon?: number;
        subTitle?: import("react").ReactNode;
        title?: import("react").ReactNode;
    } & {
        color?: import("@tamagui/core").ColorTokens | string;
        size?: import("@tamagui/core").SizeTokens | true;
    }, import("@tamagui/core").TamaguiElement, import("@tamagui/core").StackNonStyleProps & Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/core").WithShorthands<Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
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
        iconSize?: import("@tamagui/core").SizeTokens | true;
        scaleIcon?: number;
        subTitle?: import("react").ReactNode;
        title?: import("react").ReactNode;
    } & {
        color?: import("@tamagui/core").ColorTokens | string;
        size?: import("@tamagui/core").SizeTokens | true;
    }, import("@tamagui/core").StackStyleBase, {
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: import("@tamagui/core").Size | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
} & {
    Apply: import("react").Provider<{
        size?: import("@tamagui/core").SizeTokens | true;
        variant?: 'outlined';
        color?: import("@tamagui/core").ColorTokens | string;
    }> & import("react").ProviderExoticComponent<Partial<{
        size?: import("@tamagui/core").SizeTokens | true;
        variant?: 'outlined';
        color?: import("@tamagui/core").ColorTokens | string;
    }> & {
        children?: import("react").ReactNode;
        scope?: string;
    }>;
    Frame: import("react").FunctionComponent<Omit<import("@tamagui/core").StackNonStyleProps, "active" | "disabled" | "size" | "variant" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithFlatVariantValues<{
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: import("@tamagui/core").Size | undefined;
        variant?: "outlined" | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        ref?: import("react").Ref<import("@tamagui/core").TamaguiElement> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: import("@tamagui/core").Size | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {
            active?: boolean | undefined;
            disabled?: boolean | undefined;
            size?: import("@tamagui/core").Size | undefined;
            variant?: "outlined" | undefined;
        }, import("@tamagui/core").StaticConfigPublic];
    };
    Icon: ({ children, size, scaleIcon }: import("@tamagui/list-item").ListItemIconProps) => any;
    Subtitle: import("react").FunctionComponent<Omit<import("@tamagui/core").TextNonStyleProps, "size" | "variant" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithFlatVariantValues<{
        size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
        variant?: "outlined" | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & {
        ref?: import("react").Ref<import("@tamagui/core").TamaguiTextElement> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
            size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
            variant?: "outlined" | undefined;
        }, import("@tamagui/core").StaticConfigPublic];
    };
    Text: import("react").FunctionComponent<Omit<import("@tamagui/core").TextNonStyleProps, "size" | "variant" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithFlatVariantValues<{
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        variant?: "outlined" | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & {
        ref?: import("react").Ref<import("@tamagui/core").TamaguiTextElement> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
            size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
            variant?: "outlined" | undefined;
        }, import("@tamagui/core").StaticConfigPublic];
    };
    Title: import("react").FunctionComponent<Omit<import("@tamagui/core").TextNonStyleProps, "size" | "variant" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithFlatVariantValues<{
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        variant?: "outlined" | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & {
        ref?: import("react").Ref<import("@tamagui/core").TamaguiTextElement> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
            size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
            variant?: "outlined" | undefined;
        }, import("@tamagui/core").StaticConfigPublic];
    };
};
export type ListItemProps = GetProps<typeof ListItemComponent>;
export {};
//# sourceMappingURL=ListItem.d.ts.map