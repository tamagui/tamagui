import { type GetProps } from '@tamagui/style';
export declare const ListItemFrame: import("react").FunctionComponent<Omit<import("@tamagui/style").StackNonStyleProps, "active" | "disabled" | "size" | "variant" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/style").Size | undefined;
    variant?: "outlined" | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: import("react").Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").StackNonStyleProps, import("@tamagui/style").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/style").Size | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").StackNonStyleProps, import("@tamagui/style").StackStyleBase, {
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: import("@tamagui/style").Size | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
};
declare const ListItemComponent: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").StackNonStyleProps, import("@tamagui/style").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/style").Size | undefined;
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
    iconSize?: import("@tamagui/style").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
}> & Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/style").WithShorthands<Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
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
    iconSize?: import("@tamagui/style").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
} & {
    color?: import("@tamagui/style").ColorTokens | string;
    size?: import("@tamagui/style").SizeTokens | true;
}, import("@tamagui/style").TamaguiElement, import("@tamagui/style").StackNonStyleProps & Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/style").WithShorthands<Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
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
    iconSize?: import("@tamagui/style").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
} & {
    color?: import("@tamagui/style").ColorTokens | string;
    size?: import("@tamagui/style").SizeTokens | true;
}, import("@tamagui/style").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/style").Size | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/style").StaticConfigPublic>;
export declare const ListItem: import("react").FunctionComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").StackNonStyleProps, import("@tamagui/style").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/style").Size | undefined;
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
    iconSize?: import("@tamagui/style").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
}> & Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/style").WithShorthands<Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
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
    iconSize?: import("@tamagui/style").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
} & {
    color?: import("@tamagui/style").ColorTokens | string;
    size?: import("@tamagui/style").SizeTokens | true;
} & {
    ref?: import("react").Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").StackNonStyleProps, import("@tamagui/style").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/style").Size | undefined;
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
    iconSize?: import("@tamagui/style").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
}> & Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/style").WithShorthands<Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
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
    iconSize?: import("@tamagui/style").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
} & {
    color?: import("@tamagui/style").ColorTokens | string;
    size?: import("@tamagui/style").SizeTokens | true;
}, import("@tamagui/style").TamaguiElement, import("@tamagui/style").StackNonStyleProps & Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/style").WithShorthands<Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
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
    iconSize?: import("@tamagui/style").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
} & {
    color?: import("@tamagui/style").ColorTokens | string;
    size?: import("@tamagui/style").SizeTokens | true;
}, import("@tamagui/style").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/style").Size | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").StackNonStyleProps, import("@tamagui/style").StackStyleBase, {
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: import("@tamagui/style").Size | undefined;
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
        iconSize?: import("@tamagui/style").SizeTokens | true;
        scaleIcon?: number;
        subTitle?: import("react").ReactNode;
        title?: import("react").ReactNode;
    }> & Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/style").WithShorthands<Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
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
        iconSize?: import("@tamagui/style").SizeTokens | true;
        scaleIcon?: number;
        subTitle?: import("react").ReactNode;
        title?: import("react").ReactNode;
    } & {
        color?: import("@tamagui/style").ColorTokens | string;
        size?: import("@tamagui/style").SizeTokens | true;
    }, import("@tamagui/style").TamaguiElement, import("@tamagui/style").StackNonStyleProps & Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/style").WithShorthands<Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
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
        iconSize?: import("@tamagui/style").SizeTokens | true;
        scaleIcon?: number;
        subTitle?: import("react").ReactNode;
        title?: import("react").ReactNode;
    } & {
        color?: import("@tamagui/style").ColorTokens | string;
        size?: import("@tamagui/style").SizeTokens | true;
    }, import("@tamagui/style").StackStyleBase, {
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: import("@tamagui/style").Size | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
} & {
    Apply: import("react").Provider<{
        size?: import("@tamagui/style").SizeTokens | true;
        variant?: 'outlined';
        color?: import("@tamagui/style").ColorTokens | string;
    }> & import("react").ProviderExoticComponent<Partial<{
        size?: import("@tamagui/style").SizeTokens | true;
        variant?: 'outlined';
        color?: import("@tamagui/style").ColorTokens | string;
    }> & {
        children?: import("react").ReactNode;
        scope?: string;
    }>;
    Frame: import("react").FunctionComponent<Omit<import("@tamagui/style").StackNonStyleProps, "active" | "disabled" | "size" | "variant" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: import("@tamagui/style").Size | undefined;
        variant?: "outlined" | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        ref?: import("react").Ref<import("@tamagui/style").TamaguiElement> | undefined;
    }> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").StackNonStyleProps, import("@tamagui/style").StackStyleBase, {
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: import("@tamagui/style").Size | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").StackNonStyleProps, import("@tamagui/style").StackStyleBase, {
            active?: boolean | undefined;
            disabled?: boolean | undefined;
            size?: import("@tamagui/style").Size | undefined;
            variant?: "outlined" | undefined;
        }, import("@tamagui/style").StaticConfigPublic];
    };
    Icon: ({ children, size, scaleIcon }: import("@tamagui/list-item").ListItemIconProps) => any;
    Subtitle: import("react").FunctionComponent<Omit<import("@tamagui/style").TextNonStyleProps, "size" | "variant" | keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{
        size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
        variant?: "outlined" | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>> & {
        ref?: import("react").Ref<import("@tamagui/style").TamaguiTextElement> | undefined;
    }> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").TextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
        size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").TextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
            size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
            variant?: "outlined" | undefined;
        }, import("@tamagui/style").StaticConfigPublic];
    };
    Text: import("react").FunctionComponent<Omit<import("@tamagui/style").TextNonStyleProps, "size" | "variant" | keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        variant?: "outlined" | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>> & {
        ref?: import("react").Ref<import("@tamagui/style").TamaguiTextElement> | undefined;
    }> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").TextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").TextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
            size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
            variant?: "outlined" | undefined;
        }, import("@tamagui/style").StaticConfigPublic];
    };
    Title: import("react").FunctionComponent<Omit<import("@tamagui/style").TextNonStyleProps, "size" | "variant" | keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        variant?: "outlined" | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>> & {
        ref?: import("react").Ref<import("@tamagui/style").TamaguiTextElement> | undefined;
    }> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").TextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").TextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
            size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
            variant?: "outlined" | undefined;
        }, import("@tamagui/style").StaticConfigPublic];
    };
};
export type ListItemProps = GetProps<typeof ListItemComponent>;
export {};
//# sourceMappingURL=ListItem.d.ts.map