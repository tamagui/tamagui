import { type ButtonIconProps as ButtonBehaviorIconProps } from '@tamagui/button';
import { type GetProps, type SizeTokens, type ThemeProps } from '@tamagui/core';
export type ButtonSize = SizeTokens;
export declare const ButtonFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {
    circular?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
    variant?: "outlined" | "quiet" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const ButtonText: import("react").FunctionComponent<Omit<import("@tamagui/core").TextNonStyleProps, "size" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithFlatVariantValues<{
    size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & {
    ref?: import("react").Ref<import("@tamagui/core").TamaguiTextElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
export declare const ButtonIcon: ({ size, ...props }: ButtonBehaviorIconProps) => import("react").JSX.Element;
declare const ButtonComponent: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {
    circular?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>, "maxFontSizeMultiplier" | "noTextWrap" | "size" | "textProps" | "theme" | ("color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection") | keyof {
    children?: import("react").ReactNode;
    disabled?: boolean;
    render?: import("@tamagui/core").TamaguiComponentPropsBaseBase['render'];
    icon?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | ((props: {
        color?: any;
        size?: any;
    }) => import("react").ReactNode) | null;
    iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | ((props: {
        color?: any;
        size?: any;
    }) => import("react").ReactNode) | null;
    iconSize?: number;
    scaleIcon?: number;
} | keyof {
    type?: 'submit' | 'reset' | 'button';
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}> & Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/core").WithShorthands<Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
    maxFontSizeMultiplier?: number;
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    children?: import("react").ReactNode;
    disabled?: boolean;
    render?: import("@tamagui/core").TamaguiComponentPropsBaseBase['render'];
    icon?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | ((props: {
        color?: any;
        size?: any;
    }) => import("react").ReactNode) | null;
    iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | ((props: {
        color?: any;
        size?: any;
    }) => import("react").ReactNode) | null;
    iconSize?: number;
    scaleIcon?: number;
} & {
    type?: 'submit' | 'reset' | 'button';
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
} & {
    size?: ButtonSize;
    theme?: ThemeProps['name'];
}, import("@tamagui/core").TamaguiElement, import("@tamagui/core").StackNonStyleProps & Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/core").WithShorthands<Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
    maxFontSizeMultiplier?: number;
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    children?: import("react").ReactNode;
    disabled?: boolean;
    render?: import("@tamagui/core").TamaguiComponentPropsBaseBase['render'];
    icon?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | ((props: {
        color?: any;
        size?: any;
    }) => import("react").ReactNode) | null;
    iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | ((props: {
        color?: any;
        size?: any;
    }) => import("react").ReactNode) | null;
    iconSize?: number;
    scaleIcon?: number;
} & {
    type?: 'submit' | 'reset' | 'button';
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
} & {
    size?: ButtonSize;
    theme?: ThemeProps['name'];
}, import("@tamagui/core").StackStyleBase, {
    circular?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
    variant?: "outlined" | "quiet" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const Button: import("react").FunctionComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {
    circular?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>, "maxFontSizeMultiplier" | "noTextWrap" | "size" | "textProps" | "theme" | ("color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection") | keyof {
    children?: import("react").ReactNode;
    disabled?: boolean;
    render?: import("@tamagui/core").TamaguiComponentPropsBaseBase['render'];
    icon?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | ((props: {
        color?: any;
        size?: any;
    }) => import("react").ReactNode) | null;
    iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | ((props: {
        color?: any;
        size?: any;
    }) => import("react").ReactNode) | null;
    iconSize?: number;
    scaleIcon?: number;
} | keyof {
    type?: 'submit' | 'reset' | 'button';
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}> & Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/core").WithShorthands<Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
    maxFontSizeMultiplier?: number;
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    children?: import("react").ReactNode;
    disabled?: boolean;
    render?: import("@tamagui/core").TamaguiComponentPropsBaseBase['render'];
    icon?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | ((props: {
        color?: any;
        size?: any;
    }) => import("react").ReactNode) | null;
    iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | ((props: {
        color?: any;
        size?: any;
    }) => import("react").ReactNode) | null;
    iconSize?: number;
    scaleIcon?: number;
} & {
    type?: 'submit' | 'reset' | 'button';
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
} & {
    size?: ButtonSize;
    theme?: ThemeProps['name'];
} & {
    ref?: import("react").Ref<import("@tamagui/core").TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {
    circular?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>, "maxFontSizeMultiplier" | "noTextWrap" | "size" | "textProps" | "theme" | ("color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection") | keyof {
    children?: import("react").ReactNode;
    disabled?: boolean;
    render?: import("@tamagui/core").TamaguiComponentPropsBaseBase['render'];
    icon?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | ((props: {
        color?: any;
        size?: any;
    }) => import("react").ReactNode) | null;
    iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | ((props: {
        color?: any;
        size?: any;
    }) => import("react").ReactNode) | null;
    iconSize?: number;
    scaleIcon?: number;
} | keyof {
    type?: 'submit' | 'reset' | 'button';
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}> & Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/core").WithShorthands<Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
    maxFontSizeMultiplier?: number;
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    children?: import("react").ReactNode;
    disabled?: boolean;
    render?: import("@tamagui/core").TamaguiComponentPropsBaseBase['render'];
    icon?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | ((props: {
        color?: any;
        size?: any;
    }) => import("react").ReactNode) | null;
    iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | ((props: {
        color?: any;
        size?: any;
    }) => import("react").ReactNode) | null;
    iconSize?: number;
    scaleIcon?: number;
} & {
    type?: 'submit' | 'reset' | 'button';
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
} & {
    size?: ButtonSize;
    theme?: ThemeProps['name'];
}, import("@tamagui/core").TamaguiElement, import("@tamagui/core").StackNonStyleProps & Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/core").WithShorthands<Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
    maxFontSizeMultiplier?: number;
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    children?: import("react").ReactNode;
    disabled?: boolean;
    render?: import("@tamagui/core").TamaguiComponentPropsBaseBase['render'];
    icon?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | ((props: {
        color?: any;
        size?: any;
    }) => import("react").ReactNode) | null;
    iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
        color?: any;
        size?: any;
    }> | ((props: {
        color?: any;
        size?: any;
    }) => import("react").ReactNode) | null;
    iconSize?: number;
    scaleIcon?: number;
} & {
    type?: 'submit' | 'reset' | 'button';
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
} & {
    size?: ButtonSize;
    theme?: ThemeProps['name'];
}, import("@tamagui/core").StackStyleBase, {
    circular?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
    variant?: "outlined" | "quiet" | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {
        circular?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }>, "maxFontSizeMultiplier" | "noTextWrap" | "size" | "textProps" | "theme" | ("color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection") | keyof {
        children?: import("react").ReactNode;
        disabled?: boolean;
        render?: import("@tamagui/core").TamaguiComponentPropsBaseBase['render'];
        icon?: import("react").JSX.Element | import("react").FunctionComponent<{
            color?: any;
            size?: any;
        }> | ((props: {
            color?: any;
            size?: any;
        }) => import("react").ReactNode) | null;
        iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
            color?: any;
            size?: any;
        }> | ((props: {
            color?: any;
            size?: any;
        }) => import("react").ReactNode) | null;
        iconSize?: number;
        scaleIcon?: number;
    } | keyof {
        type?: 'submit' | 'reset' | 'button';
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        name?: string;
        value?: string | readonly string[] | number;
    }> & Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/core").WithShorthands<Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
        maxFontSizeMultiplier?: number;
        textProps?: Partial<import("@tamagui/text").SizableTextProps>;
        noTextWrap?: boolean;
    } & {
        children?: import("react").ReactNode;
        disabled?: boolean;
        render?: import("@tamagui/core").TamaguiComponentPropsBaseBase['render'];
        icon?: import("react").JSX.Element | import("react").FunctionComponent<{
            color?: any;
            size?: any;
        }> | ((props: {
            color?: any;
            size?: any;
        }) => import("react").ReactNode) | null;
        iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
            color?: any;
            size?: any;
        }> | ((props: {
            color?: any;
            size?: any;
        }) => import("react").ReactNode) | null;
        iconSize?: number;
        scaleIcon?: number;
    } & {
        type?: 'submit' | 'reset' | 'button';
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        name?: string;
        value?: string | readonly string[] | number;
    } & {
        size?: ButtonSize;
        theme?: ThemeProps['name'];
    }, import("@tamagui/core").TamaguiElement, import("@tamagui/core").StackNonStyleProps & Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/core").WithShorthands<Partial<Pick<import("@tamagui/core").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
        maxFontSizeMultiplier?: number;
        textProps?: Partial<import("@tamagui/text").SizableTextProps>;
        noTextWrap?: boolean;
    } & {
        children?: import("react").ReactNode;
        disabled?: boolean;
        render?: import("@tamagui/core").TamaguiComponentPropsBaseBase['render'];
        icon?: import("react").JSX.Element | import("react").FunctionComponent<{
            color?: any;
            size?: any;
        }> | ((props: {
            color?: any;
            size?: any;
        }) => import("react").ReactNode) | null;
        iconAfter?: import("react").JSX.Element | import("react").FunctionComponent<{
            color?: any;
            size?: any;
        }> | ((props: {
            color?: any;
            size?: any;
        }) => import("react").ReactNode) | null;
        iconSize?: number;
        scaleIcon?: number;
    } & {
        type?: 'submit' | 'reset' | 'button';
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        name?: string;
        value?: string | readonly string[] | number;
    } & {
        size?: ButtonSize;
        theme?: ThemeProps['name'];
    }, import("@tamagui/core").StackStyleBase, {
        circular?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
} & {
    Frame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {
        circular?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Icon: typeof ButtonIcon;
    Text: import("react").FunctionComponent<Omit<import("@tamagui/core").TextNonStyleProps, "size" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithFlatVariantValues<{
        size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & {
        ref?: import("react").Ref<import("@tamagui/core").TamaguiTextElement> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
    }, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
            size?: string | number | true | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | undefined;
        }, import("@tamagui/core").StaticConfigPublic];
    };
};
export type ButtonProps = GetProps<typeof ButtonComponent>;
export {};
//# sourceMappingURL=Button.d.ts.map