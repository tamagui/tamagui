import { type GetProps } from '@tamagui/ui';
export declare const ListItemFrame: import("react").FunctionComponent<Omit<import("@tamagui/ui").StackNonStyleProps, "active" | "disabled" | "size" | "variant" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: import("react").Ref<import("@tamagui/ui").TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
declare const ListItemComponent: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
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
    iconSize?: import("@tamagui/ui").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
}> & Partial<Pick<import("@tamagui/ui").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/web").WithShorthands<Partial<Pick<import("@tamagui/ui").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
    maxFontSizeMultiplier?: number;
    textProps?: Partial<import("@tamagui/ui").SizableTextProps>;
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
    iconSize?: import("@tamagui/ui").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
} & {
    color?: import("@tamagui/ui").ColorTokens | string;
    size?: import("@tamagui/ui").SizeTokens | true;
}, import("@tamagui/ui").TamaguiElement, import("@tamagui/ui").StackNonStyleProps & Partial<Pick<import("@tamagui/ui").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/web").WithShorthands<Partial<Pick<import("@tamagui/ui").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
    maxFontSizeMultiplier?: number;
    textProps?: Partial<import("@tamagui/ui").SizableTextProps>;
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
    iconSize?: import("@tamagui/ui").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
} & {
    color?: import("@tamagui/ui").ColorTokens | string;
    size?: import("@tamagui/ui").SizeTokens | true;
}, import("@tamagui/web").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const ListItem: import("react").FunctionComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
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
    iconSize?: import("@tamagui/ui").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
}> & Partial<Pick<import("@tamagui/ui").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/web").WithShorthands<Partial<Pick<import("@tamagui/ui").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
    maxFontSizeMultiplier?: number;
    textProps?: Partial<import("@tamagui/ui").SizableTextProps>;
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
    iconSize?: import("@tamagui/ui").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
} & {
    color?: import("@tamagui/ui").ColorTokens | string;
    size?: import("@tamagui/ui").SizeTokens | true;
} & {
    ref?: import("react").Ref<import("@tamagui/ui").TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
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
    iconSize?: import("@tamagui/ui").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
}> & Partial<Pick<import("@tamagui/ui").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/web").WithShorthands<Partial<Pick<import("@tamagui/ui").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
    maxFontSizeMultiplier?: number;
    textProps?: Partial<import("@tamagui/ui").SizableTextProps>;
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
    iconSize?: import("@tamagui/ui").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
} & {
    color?: import("@tamagui/ui").ColorTokens | string;
    size?: import("@tamagui/ui").SizeTokens | true;
}, import("@tamagui/ui").TamaguiElement, import("@tamagui/ui").StackNonStyleProps & Partial<Pick<import("@tamagui/ui").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/web").WithShorthands<Partial<Pick<import("@tamagui/ui").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
    maxFontSizeMultiplier?: number;
    textProps?: Partial<import("@tamagui/ui").SizableTextProps>;
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
    iconSize?: import("@tamagui/ui").SizeTokens | true;
    scaleIcon?: number;
    subTitle?: import("react").ReactNode;
    title?: import("react").ReactNode;
} & {
    color?: import("@tamagui/ui").ColorTokens | string;
    size?: import("@tamagui/ui").SizeTokens | true;
}, import("@tamagui/web").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
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
        iconSize?: import("@tamagui/ui").SizeTokens | true;
        scaleIcon?: number;
        subTitle?: import("react").ReactNode;
        title?: import("react").ReactNode;
    }> & Partial<Pick<import("@tamagui/ui").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/web").WithShorthands<Partial<Pick<import("@tamagui/ui").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
        maxFontSizeMultiplier?: number;
        textProps?: Partial<import("@tamagui/ui").SizableTextProps>;
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
        iconSize?: import("@tamagui/ui").SizeTokens | true;
        scaleIcon?: number;
        subTitle?: import("react").ReactNode;
        title?: import("react").ReactNode;
    } & {
        color?: import("@tamagui/ui").ColorTokens | string;
        size?: import("@tamagui/ui").SizeTokens | true;
    }, import("@tamagui/ui").TamaguiElement, import("@tamagui/ui").StackNonStyleProps & Partial<Pick<import("@tamagui/ui").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/web").WithShorthands<Partial<Pick<import("@tamagui/ui").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
        maxFontSizeMultiplier?: number;
        textProps?: Partial<import("@tamagui/ui").SizableTextProps>;
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
        iconSize?: import("@tamagui/ui").SizeTokens | true;
        scaleIcon?: number;
        subTitle?: import("react").ReactNode;
        title?: import("react").ReactNode;
    } & {
        color?: import("@tamagui/ui").ColorTokens | string;
        size?: import("@tamagui/ui").SizeTokens | true;
    }, import("@tamagui/web").StackStyleBase, {
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Apply: import("react").Provider<{
        size?: import("@tamagui/ui").SizeTokens | true;
        variant?: 'outlined';
        color?: import("@tamagui/ui").ColorTokens | string;
    }> & import("react").ProviderExoticComponent<Partial<{
        size?: import("@tamagui/ui").SizeTokens | true;
        variant?: 'outlined';
        color?: import("@tamagui/ui").ColorTokens | string;
    }> & {
        children?: import("react").ReactNode;
        scope?: string;
    }>;
    Frame: import("react").FunctionComponent<Omit<import("@tamagui/ui").StackNonStyleProps, "active" | "disabled" | "size" | "variant" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        ref?: import("react").Ref<import("@tamagui/ui").TamaguiElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
            active?: boolean | undefined;
            disabled?: boolean | undefined;
            size?: false | import("@tamagui/web").Size | undefined;
            variant?: "outlined" | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Icon: ({ children, size, scaleIcon }: import("@tamagui/ui").ListItemIconProps) => any;
    Subtitle: import("react").FunctionComponent<Omit<import("@tamagui/ui").TextNonStyleProps, "size" | "variant" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithFlatVariantValues<{
        size?: string | number | boolean | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | (string & {}) | undefined;
        variant?: "outlined" | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & {
        ref?: import("react").Ref<import("@tamagui/ui").TamaguiTextElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: string | number | boolean | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | (string & {}) | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
            size?: string | number | boolean | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | (string & {}) | undefined;
            variant?: "outlined" | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Text: import("react").FunctionComponent<Omit<import("@tamagui/ui").TextNonStyleProps, "size" | "variant" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithFlatVariantValues<{
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & {
        ref?: import("react").Ref<import("@tamagui/ui").TamaguiTextElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
            size?: import("@tamagui/web").FontSize | undefined;
            variant?: "outlined" | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Title: import("react").FunctionComponent<Omit<import("@tamagui/ui").TextNonStyleProps, "size" | "variant" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithFlatVariantValues<{
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    }> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & {
        ref?: import("react").Ref<import("@tamagui/ui").TamaguiTextElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
            size?: import("@tamagui/web").FontSize | undefined;
            variant?: "outlined" | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
};
export type ListItemProps = GetProps<typeof ListItemComponent>;
export {};
//# sourceMappingURL=ListItem.d.ts.map