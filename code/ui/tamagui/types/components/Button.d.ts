import { type ButtonIconProps as ButtonBehaviorIconProps } from '@tamagui/button';
import { type GetProps, type SizeTokens, type ThemeProps } from '@tamagui/style';
export type ButtonSize = SizeTokens;
export declare const ButtonFrame: import("@tamagui/style").TamaguiComponent<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").StackNonStyleProps, import("@tamagui/style").StackStyleBase, {
    circular?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
    variant?: "outlined" | "quiet" | undefined;
}, import("@tamagui/style").StaticConfigPublic>;
export declare const ButtonText: import("react").FunctionComponent<Omit<import("@tamagui/style").TextNonStyleProps, "size" | keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{
    size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>> & {
    ref?: import("react").Ref<import("@tamagui/style").TamaguiTextElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").TextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
    size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").TextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
        size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
};
export declare const ButtonIcon: ({ size, ...props }: ButtonBehaviorIconProps) => import("react").JSX.Element;
declare const ButtonComponent: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").StackNonStyleProps, import("@tamagui/style").StackStyleBase, {
    circular?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>, "maxFontSizeMultiplier" | "noTextWrap" | "size" | "textProps" | "theme" | ("color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection") | keyof {
    children?: import("react").ReactNode;
    disabled?: boolean;
    render?: import("@tamagui/style").TamaguiComponentPropsBaseBase['render'];
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
}> & Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/style").WithShorthands<Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
    maxFontSizeMultiplier?: number;
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    children?: import("react").ReactNode;
    disabled?: boolean;
    render?: import("@tamagui/style").TamaguiComponentPropsBaseBase['render'];
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
}, import("@tamagui/style").TamaguiElement, import("@tamagui/style").StackNonStyleProps & Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/style").WithShorthands<Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
    maxFontSizeMultiplier?: number;
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    children?: import("react").ReactNode;
    disabled?: boolean;
    render?: import("@tamagui/style").TamaguiComponentPropsBaseBase['render'];
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
}, import("@tamagui/style").StackStyleBase, {
    circular?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
    variant?: "outlined" | "quiet" | undefined;
}, import("@tamagui/style").StaticConfigPublic>;
export declare const Button: import("react").FunctionComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").StackNonStyleProps, import("@tamagui/style").StackStyleBase, {
    circular?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>, "maxFontSizeMultiplier" | "noTextWrap" | "size" | "textProps" | "theme" | ("color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection") | keyof {
    children?: import("react").ReactNode;
    disabled?: boolean;
    render?: import("@tamagui/style").TamaguiComponentPropsBaseBase['render'];
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
}> & Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/style").WithShorthands<Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
    maxFontSizeMultiplier?: number;
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    children?: import("react").ReactNode;
    disabled?: boolean;
    render?: import("@tamagui/style").TamaguiComponentPropsBaseBase['render'];
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
    ref?: import("react").Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").StackNonStyleProps, import("@tamagui/style").StackStyleBase, {
    circular?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>, "maxFontSizeMultiplier" | "noTextWrap" | "size" | "textProps" | "theme" | ("color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection") | keyof {
    children?: import("react").ReactNode;
    disabled?: boolean;
    render?: import("@tamagui/style").TamaguiComponentPropsBaseBase['render'];
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
}> & Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/style").WithShorthands<Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
    maxFontSizeMultiplier?: number;
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    children?: import("react").ReactNode;
    disabled?: boolean;
    render?: import("@tamagui/style").TamaguiComponentPropsBaseBase['render'];
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
}, import("@tamagui/style").TamaguiElement, import("@tamagui/style").StackNonStyleProps & Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/style").WithShorthands<Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
    maxFontSizeMultiplier?: number;
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    children?: import("react").ReactNode;
    disabled?: boolean;
    render?: import("@tamagui/style").TamaguiComponentPropsBaseBase['render'];
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
}, import("@tamagui/style").StackStyleBase, {
    circular?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
    variant?: "outlined" | "quiet" | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").StackNonStyleProps, import("@tamagui/style").StackStyleBase, {
        circular?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }>, "maxFontSizeMultiplier" | "noTextWrap" | "size" | "textProps" | "theme" | ("color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection") | keyof {
        children?: import("react").ReactNode;
        disabled?: boolean;
        render?: import("@tamagui/style").TamaguiComponentPropsBaseBase['render'];
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
    }> & Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/style").WithShorthands<Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
        maxFontSizeMultiplier?: number;
        textProps?: Partial<import("@tamagui/text").SizableTextProps>;
        noTextWrap?: boolean;
    } & {
        children?: import("react").ReactNode;
        disabled?: boolean;
        render?: import("@tamagui/style").TamaguiComponentPropsBaseBase['render'];
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
    }, import("@tamagui/style").TamaguiElement, import("@tamagui/style").StackNonStyleProps & Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">> & Pick<import("@tamagui/style").WithShorthands<Partial<Pick<import("@tamagui/style").TextStyle, "color" | "ellipsis" | "font" | "fontFamily" | "fontSize" | "fontStyle" | "fontVariant" | "fontWeight" | "letterSpacing" | "lineHeight" | "numberOfLines" | "textAlign" | "textDecoration" | "textDecorationColor" | "textDecorationDistance" | "textDecorationLine" | "textDecorationStyle" | "textOverflow" | "textShadow" | "textShadowColor" | "textShadowOffset" | "textShadowRadius" | "textTransform" | "userSelect" | "verticalAlign" | "whiteSpace" | "wordWrap" | "writingDirection">>>, never> & {
        maxFontSizeMultiplier?: number;
        textProps?: Partial<import("@tamagui/text").SizableTextProps>;
        noTextWrap?: boolean;
    } & {
        children?: import("react").ReactNode;
        disabled?: boolean;
        render?: import("@tamagui/style").TamaguiComponentPropsBaseBase['render'];
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
    }, import("@tamagui/style").StackStyleBase, {
        circular?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
} & {
    Frame: import("@tamagui/style").TamaguiComponent<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").StackNonStyleProps, import("@tamagui/style").StackStyleBase, {
        circular?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }, import("@tamagui/style").StaticConfigPublic>;
    Icon: typeof ButtonIcon;
    Text: import("react").FunctionComponent<Omit<import("@tamagui/style").TextNonStyleProps, "size" | keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{
        size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>> & {
        ref?: import("react").Ref<import("@tamagui/style").TamaguiTextElement> | undefined;
    }> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").TextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
        size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
    }, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").TextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
            size?: string | number | true | import("@tamagui/style").UnionableNumber | import("@tamagui/style").UnionableString | undefined;
        }, import("@tamagui/style").StaticConfigPublic];
    };
};
export type ButtonProps = GetProps<typeof ButtonComponent>;
export {};
//# sourceMappingURL=Button.d.ts.map