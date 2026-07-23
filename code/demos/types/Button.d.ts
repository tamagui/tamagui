import { type ButtonIconProps as ButtonBehaviorIconProps, type GetProps } from 'tamagui';
export declare const buttonSizes: import("tamagui").CreatedSizeTable<{
    readonly small: {
        readonly frame: {
            readonly gap: 6;
            readonly height: 30;
            readonly paddingHorizontal: 10;
        };
        readonly text: {
            readonly fontSize: 13;
            readonly lineHeight: 18;
        };
        readonly icon: 14;
    };
    readonly medium: {
        readonly frame: {
            readonly gap: 8;
            readonly height: 36;
            readonly paddingHorizontal: 14;
        };
        readonly text: {
            readonly fontSize: 15;
            readonly lineHeight: 20;
        };
        readonly icon: 16;
    };
    readonly large: {
        readonly frame: {
            readonly gap: 10;
            readonly height: 44;
            readonly paddingHorizontal: 18;
        };
        readonly text: {
            readonly fontSize: 17;
            readonly lineHeight: 24;
        };
        readonly icon: 20;
    };
    readonly wide: {
        readonly frame: {
            readonly gap: 10;
            readonly height: 44;
            readonly minWidth: 180;
            readonly paddingHorizontal: 24;
        };
        readonly text: {
            readonly fontSize: 16;
            readonly lineHeight: 22;
        };
        readonly icon: 18;
    };
}, "medium">;
export type ButtonSize = keyof typeof buttonSizes.values;
export declare const ButtonFrame: import("react").FunctionComponent<Omit<import("tamagui").StackNonStyleProps, "color" | "size" | "letterSpacing" | "textAlign" | "fontStyle" | "disabled" | keyof import("@tamagui/web").StackStyleBase | "fontFamily" | "fontSize" | "fontWeight" | "maxFontSizeMultiplier" | "ellipsis" | "circular" | "variant"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: import("react-native").OpaqueColorValue | import("tamagui").GetThemeValueForKey<"color"> | undefined;
    size?: "small" | "medium" | "large" | "wide" | undefined;
    letterSpacing?: "unset" | import("tamagui").GetThemeValueForKey<"letterSpacing"> | undefined;
    textAlign?: "justify" | "left" | "right" | "unset" | "center" | "auto" | undefined;
    fontStyle?: "normal" | "italic" | "unset" | undefined;
    disabled?: boolean | undefined;
    fontFamily?: "unset" | import("tamagui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("tamagui").GetThemeValueForKey<"fontSize"> | undefined;
    fontWeight?: 800 | 700 | 900 | "unset" | 100 | import("tamagui").GetThemeValueForKey<"fontWeight"> | 200 | 300 | 400 | 500 | 600 | undefined;
    maxFontSizeMultiplier?: number | undefined;
    ellipsis?: boolean | "unset" | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: import("react-native").OpaqueColorValue | import("tamagui").GetThemeValueForKey<"color"> | undefined;
    size?: "small" | "medium" | "large" | "wide" | undefined;
    letterSpacing?: "unset" | import("tamagui").GetThemeValueForKey<"letterSpacing"> | undefined;
    textAlign?: "justify" | "left" | "right" | "unset" | "center" | "auto" | undefined;
    fontStyle?: "normal" | "italic" | "unset" | undefined;
    disabled?: boolean | undefined;
    fontFamily?: "unset" | import("tamagui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("tamagui").GetThemeValueForKey<"fontSize"> | undefined;
    fontWeight?: 800 | 700 | 900 | "unset" | 100 | import("tamagui").GetThemeValueForKey<"fontWeight"> | 200 | 300 | 400 | 500 | 600 | undefined;
    maxFontSizeMultiplier?: number | undefined;
    ellipsis?: boolean | "unset" | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    color?: import("react-native").OpaqueColorValue | import("tamagui").GetThemeValueForKey<"color"> | undefined;
    size?: "small" | "medium" | "large" | "wide" | undefined;
    letterSpacing?: "unset" | import("tamagui").GetThemeValueForKey<"letterSpacing"> | undefined;
    textAlign?: "justify" | "left" | "right" | "unset" | "center" | "auto" | undefined;
    fontStyle?: "normal" | "italic" | "unset" | undefined;
    disabled?: boolean | undefined;
    fontFamily?: "unset" | import("tamagui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("tamagui").GetThemeValueForKey<"fontSize"> | undefined;
    fontWeight?: 800 | 700 | 900 | "unset" | 100 | import("tamagui").GetThemeValueForKey<"fontWeight"> | 200 | 300 | 400 | 500 | 600 | undefined;
    maxFontSizeMultiplier?: number | undefined;
    ellipsis?: boolean | "unset" | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>> & {
    ref?: import("react").Ref<import("tamagui").TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("tamagui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: import("react-native").OpaqueColorValue | import("tamagui").GetThemeValueForKey<"color"> | undefined;
    size?: "small" | "medium" | "large" | "wide" | undefined;
    letterSpacing?: "unset" | import("tamagui").GetThemeValueForKey<"letterSpacing"> | undefined;
    textAlign?: "justify" | "left" | "right" | "unset" | "center" | "auto" | undefined;
    fontStyle?: "normal" | "italic" | "unset" | undefined;
    disabled?: boolean | undefined;
    fontFamily?: "unset" | import("tamagui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("tamagui").GetThemeValueForKey<"fontSize"> | undefined;
    fontWeight?: 800 | 700 | 900 | "unset" | 100 | import("tamagui").GetThemeValueForKey<"fontWeight"> | 200 | 300 | 400 | 500 | 600 | undefined;
    maxFontSizeMultiplier?: number | undefined;
    ellipsis?: boolean | "unset" | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("tamagui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        color?: import("react-native").OpaqueColorValue | import("tamagui").GetThemeValueForKey<"color"> | undefined;
        size?: "small" | "medium" | "large" | "wide" | undefined;
        letterSpacing?: "unset" | import("tamagui").GetThemeValueForKey<"letterSpacing"> | undefined;
        textAlign?: "justify" | "left" | "right" | "unset" | "center" | "auto" | undefined;
        fontStyle?: "normal" | "italic" | "unset" | undefined;
        disabled?: boolean | undefined;
        fontFamily?: "unset" | import("tamagui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("tamagui").GetThemeValueForKey<"fontSize"> | undefined;
        fontWeight?: 800 | 700 | 900 | "unset" | 100 | import("tamagui").GetThemeValueForKey<"fontWeight"> | 200 | 300 | 400 | 500 | 600 | undefined;
        maxFontSizeMultiplier?: number | undefined;
        ellipsis?: boolean | "unset" | undefined;
        circular?: boolean | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ButtonText: import("react").FunctionComponent<Omit<import("tamagui").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
    size?: "small" | "medium" | "large" | "wide" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
    size?: "small" | "medium" | "large" | "wide" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
    size?: "small" | "medium" | "large" | "wide" | undefined;
}>> & {
    ref?: import("react").Ref<import("tamagui").TamaguiTextElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiTextElement, import("tamagui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: "small" | "medium" | "large" | "wide" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("tamagui").TamaguiTextElement, import("tamagui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: "small" | "medium" | "large" | "wide" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ButtonIcon: ({ size, ...props }: ButtonBehaviorIconProps) => import("react/jsx-runtime").JSX.Element;
declare const ButtonComponent: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("tamagui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: import("react-native").OpaqueColorValue | import("tamagui").GetThemeValueForKey<"color"> | undefined;
    size?: "small" | "medium" | "large" | "wide" | undefined;
    letterSpacing?: "unset" | import("tamagui").GetThemeValueForKey<"letterSpacing"> | undefined;
    textAlign?: "justify" | "left" | "right" | "unset" | "center" | "auto" | undefined;
    fontStyle?: "normal" | "italic" | "unset" | undefined;
    disabled?: boolean | undefined;
    fontFamily?: "unset" | import("tamagui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("tamagui").GetThemeValueForKey<"fontSize"> | undefined;
    fontWeight?: 800 | 700 | 900 | "unset" | 100 | import("tamagui").GetThemeValueForKey<"fontWeight"> | 200 | 300 | 400 | 500 | 600 | undefined;
    maxFontSizeMultiplier?: number | undefined;
    ellipsis?: boolean | "unset" | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>, "value" | "type" | "name" | keyof import("tamagui").TextContextStyles | "form" | "scaleIcon" | "iconSize" | "textProps" | "icon" | "iconAfter" | "noTextWrap" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget"> & import("tamagui").TextContextStyles & {
    textProps?: Partial<import("tamagui").SizableTextProps>;
    noTextWrap?: boolean;
} & {
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
    type?: "submit" | "reset" | "button";
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("tamagui").StackNonStyleProps & import("tamagui").TextContextStyles & {
    textProps?: Partial<import("tamagui").SizableTextProps>;
    noTextWrap?: boolean;
} & {
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
    type?: "submit" | "reset" | "button";
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}, import("@tamagui/web").StackStyleBase, {
    color?: import("react-native").OpaqueColorValue | import("tamagui").GetThemeValueForKey<"color"> | undefined;
    size?: "small" | "medium" | "large" | "wide" | undefined;
    letterSpacing?: "unset" | import("tamagui").GetThemeValueForKey<"letterSpacing"> | undefined;
    textAlign?: "justify" | "left" | "right" | "unset" | "center" | "auto" | undefined;
    fontStyle?: "normal" | "italic" | "unset" | undefined;
    disabled?: boolean | undefined;
    fontFamily?: "unset" | import("tamagui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("tamagui").GetThemeValueForKey<"fontSize"> | undefined;
    fontWeight?: 800 | 700 | 900 | "unset" | 100 | import("tamagui").GetThemeValueForKey<"fontWeight"> | 200 | 300 | 400 | 500 | 600 | undefined;
    maxFontSizeMultiplier?: number | undefined;
    ellipsis?: boolean | "unset" | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const Button: import("react").FunctionComponent<Omit<import("@tamagui/web").GetFinalProps<import("tamagui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: import("react-native").OpaqueColorValue | import("tamagui").GetThemeValueForKey<"color"> | undefined;
    size?: "small" | "medium" | "large" | "wide" | undefined;
    letterSpacing?: "unset" | import("tamagui").GetThemeValueForKey<"letterSpacing"> | undefined;
    textAlign?: "justify" | "left" | "right" | "unset" | "center" | "auto" | undefined;
    fontStyle?: "normal" | "italic" | "unset" | undefined;
    disabled?: boolean | undefined;
    fontFamily?: "unset" | import("tamagui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("tamagui").GetThemeValueForKey<"fontSize"> | undefined;
    fontWeight?: 800 | 700 | 900 | "unset" | 100 | import("tamagui").GetThemeValueForKey<"fontWeight"> | 200 | 300 | 400 | 500 | 600 | undefined;
    maxFontSizeMultiplier?: number | undefined;
    ellipsis?: boolean | "unset" | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>, "value" | "type" | "name" | keyof import("tamagui").TextContextStyles | "form" | "scaleIcon" | "iconSize" | "textProps" | "icon" | "iconAfter" | "noTextWrap" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget"> & import("tamagui").TextContextStyles & {
    textProps?: Partial<import("tamagui").SizableTextProps>;
    noTextWrap?: boolean;
} & {
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
    type?: "submit" | "reset" | "button";
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
} & {
    ref?: import("react").Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("tamagui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: import("react-native").OpaqueColorValue | import("tamagui").GetThemeValueForKey<"color"> | undefined;
    size?: "small" | "medium" | "large" | "wide" | undefined;
    letterSpacing?: "unset" | import("tamagui").GetThemeValueForKey<"letterSpacing"> | undefined;
    textAlign?: "justify" | "left" | "right" | "unset" | "center" | "auto" | undefined;
    fontStyle?: "normal" | "italic" | "unset" | undefined;
    disabled?: boolean | undefined;
    fontFamily?: "unset" | import("tamagui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("tamagui").GetThemeValueForKey<"fontSize"> | undefined;
    fontWeight?: 800 | 700 | 900 | "unset" | 100 | import("tamagui").GetThemeValueForKey<"fontWeight"> | 200 | 300 | 400 | 500 | 600 | undefined;
    maxFontSizeMultiplier?: number | undefined;
    ellipsis?: boolean | "unset" | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>, "value" | "type" | "name" | keyof import("tamagui").TextContextStyles | "form" | "scaleIcon" | "iconSize" | "textProps" | "icon" | "iconAfter" | "noTextWrap" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget"> & import("tamagui").TextContextStyles & {
    textProps?: Partial<import("tamagui").SizableTextProps>;
    noTextWrap?: boolean;
} & {
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
    type?: "submit" | "reset" | "button";
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("tamagui").StackNonStyleProps & import("tamagui").TextContextStyles & {
    textProps?: Partial<import("tamagui").SizableTextProps>;
    noTextWrap?: boolean;
} & {
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
    type?: "submit" | "reset" | "button";
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}, import("@tamagui/web").StackStyleBase, {
    color?: import("react-native").OpaqueColorValue | import("tamagui").GetThemeValueForKey<"color"> | undefined;
    size?: "small" | "medium" | "large" | "wide" | undefined;
    letterSpacing?: "unset" | import("tamagui").GetThemeValueForKey<"letterSpacing"> | undefined;
    textAlign?: "justify" | "left" | "right" | "unset" | "center" | "auto" | undefined;
    fontStyle?: "normal" | "italic" | "unset" | undefined;
    disabled?: boolean | undefined;
    fontFamily?: "unset" | import("tamagui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("tamagui").GetThemeValueForKey<"fontSize"> | undefined;
    fontWeight?: 800 | 700 | 900 | "unset" | 100 | import("tamagui").GetThemeValueForKey<"fontWeight"> | 200 | 300 | 400 | 500 | 600 | undefined;
    maxFontSizeMultiplier?: number | undefined;
    ellipsis?: boolean | "unset" | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("tamagui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        color?: import("react-native").OpaqueColorValue | import("tamagui").GetThemeValueForKey<"color"> | undefined;
        size?: "small" | "medium" | "large" | "wide" | undefined;
        letterSpacing?: "unset" | import("tamagui").GetThemeValueForKey<"letterSpacing"> | undefined;
        textAlign?: "justify" | "left" | "right" | "unset" | "center" | "auto" | undefined;
        fontStyle?: "normal" | "italic" | "unset" | undefined;
        disabled?: boolean | undefined;
        fontFamily?: "unset" | import("tamagui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("tamagui").GetThemeValueForKey<"fontSize"> | undefined;
        fontWeight?: 800 | 700 | 900 | "unset" | 100 | import("tamagui").GetThemeValueForKey<"fontWeight"> | 200 | 300 | 400 | 500 | 600 | undefined;
        maxFontSizeMultiplier?: number | undefined;
        ellipsis?: boolean | "unset" | undefined;
        circular?: boolean | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }>, "value" | "type" | "name" | keyof import("tamagui").TextContextStyles | "form" | "scaleIcon" | "iconSize" | "textProps" | "icon" | "iconAfter" | "noTextWrap" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget"> & import("tamagui").TextContextStyles & {
        textProps?: Partial<import("tamagui").SizableTextProps>;
        noTextWrap?: boolean;
    } & {
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
        type?: "submit" | "reset" | "button";
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        name?: string;
        value?: string | readonly string[] | number;
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("tamagui").StackNonStyleProps & import("tamagui").TextContextStyles & {
        textProps?: Partial<import("tamagui").SizableTextProps>;
        noTextWrap?: boolean;
    } & {
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
        type?: "submit" | "reset" | "button";
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        name?: string;
        value?: string | readonly string[] | number;
    }, import("@tamagui/web").StackStyleBase, {
        color?: import("react-native").OpaqueColorValue | import("tamagui").GetThemeValueForKey<"color"> | undefined;
        size?: "small" | "medium" | "large" | "wide" | undefined;
        letterSpacing?: "unset" | import("tamagui").GetThemeValueForKey<"letterSpacing"> | undefined;
        textAlign?: "justify" | "left" | "right" | "unset" | "center" | "auto" | undefined;
        fontStyle?: "normal" | "italic" | "unset" | undefined;
        disabled?: boolean | undefined;
        fontFamily?: "unset" | import("tamagui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("tamagui").GetThemeValueForKey<"fontSize"> | undefined;
        fontWeight?: 800 | 700 | 900 | "unset" | 100 | import("tamagui").GetThemeValueForKey<"fontWeight"> | 200 | 300 | 400 | 500 | 600 | undefined;
        maxFontSizeMultiplier?: number | undefined;
        ellipsis?: boolean | "unset" | undefined;
        circular?: boolean | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Frame: import("react").FunctionComponent<Omit<import("tamagui").StackNonStyleProps, "color" | "size" | "letterSpacing" | "textAlign" | "fontStyle" | "disabled" | keyof import("@tamagui/web").StackStyleBase | "fontFamily" | "fontSize" | "fontWeight" | "maxFontSizeMultiplier" | "ellipsis" | "circular" | "variant"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        color?: import("react-native").OpaqueColorValue | import("tamagui").GetThemeValueForKey<"color"> | undefined;
        size?: "small" | "medium" | "large" | "wide" | undefined;
        letterSpacing?: "unset" | import("tamagui").GetThemeValueForKey<"letterSpacing"> | undefined;
        textAlign?: "justify" | "left" | "right" | "unset" | "center" | "auto" | undefined;
        fontStyle?: "normal" | "italic" | "unset" | undefined;
        disabled?: boolean | undefined;
        fontFamily?: "unset" | import("tamagui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("tamagui").GetThemeValueForKey<"fontSize"> | undefined;
        fontWeight?: 800 | 700 | 900 | "unset" | 100 | import("tamagui").GetThemeValueForKey<"fontWeight"> | 200 | 300 | 400 | 500 | 600 | undefined;
        maxFontSizeMultiplier?: number | undefined;
        ellipsis?: boolean | "unset" | undefined;
        circular?: boolean | undefined;
        variant?: "outlined" | "quiet" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        color?: import("react-native").OpaqueColorValue | import("tamagui").GetThemeValueForKey<"color"> | undefined;
        size?: "small" | "medium" | "large" | "wide" | undefined;
        letterSpacing?: "unset" | import("tamagui").GetThemeValueForKey<"letterSpacing"> | undefined;
        textAlign?: "justify" | "left" | "right" | "unset" | "center" | "auto" | undefined;
        fontStyle?: "normal" | "italic" | "unset" | undefined;
        disabled?: boolean | undefined;
        fontFamily?: "unset" | import("tamagui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("tamagui").GetThemeValueForKey<"fontSize"> | undefined;
        fontWeight?: 800 | 700 | 900 | "unset" | 100 | import("tamagui").GetThemeValueForKey<"fontWeight"> | 200 | 300 | 400 | 500 | 600 | undefined;
        maxFontSizeMultiplier?: number | undefined;
        ellipsis?: boolean | "unset" | undefined;
        circular?: boolean | undefined;
        variant?: "outlined" | "quiet" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        color?: import("react-native").OpaqueColorValue | import("tamagui").GetThemeValueForKey<"color"> | undefined;
        size?: "small" | "medium" | "large" | "wide" | undefined;
        letterSpacing?: "unset" | import("tamagui").GetThemeValueForKey<"letterSpacing"> | undefined;
        textAlign?: "justify" | "left" | "right" | "unset" | "center" | "auto" | undefined;
        fontStyle?: "normal" | "italic" | "unset" | undefined;
        disabled?: boolean | undefined;
        fontFamily?: "unset" | import("tamagui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("tamagui").GetThemeValueForKey<"fontSize"> | undefined;
        fontWeight?: 800 | 700 | 900 | "unset" | 100 | import("tamagui").GetThemeValueForKey<"fontWeight"> | 200 | 300 | 400 | 500 | 600 | undefined;
        maxFontSizeMultiplier?: number | undefined;
        ellipsis?: boolean | "unset" | undefined;
        circular?: boolean | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }>> & {
        ref?: import("react").Ref<import("tamagui").TamaguiElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("tamagui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        color?: import("react-native").OpaqueColorValue | import("tamagui").GetThemeValueForKey<"color"> | undefined;
        size?: "small" | "medium" | "large" | "wide" | undefined;
        letterSpacing?: "unset" | import("tamagui").GetThemeValueForKey<"letterSpacing"> | undefined;
        textAlign?: "justify" | "left" | "right" | "unset" | "center" | "auto" | undefined;
        fontStyle?: "normal" | "italic" | "unset" | undefined;
        disabled?: boolean | undefined;
        fontFamily?: "unset" | import("tamagui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("tamagui").GetThemeValueForKey<"fontSize"> | undefined;
        fontWeight?: 800 | 700 | 900 | "unset" | 100 | import("tamagui").GetThemeValueForKey<"fontWeight"> | 200 | 300 | 400 | 500 | 600 | undefined;
        maxFontSizeMultiplier?: number | undefined;
        ellipsis?: boolean | "unset" | undefined;
        circular?: boolean | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("tamagui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
            color?: import("react-native").OpaqueColorValue | import("tamagui").GetThemeValueForKey<"color"> | undefined;
            size?: "small" | "medium" | "large" | "wide" | undefined;
            letterSpacing?: "unset" | import("tamagui").GetThemeValueForKey<"letterSpacing"> | undefined;
            textAlign?: "justify" | "left" | "right" | "unset" | "center" | "auto" | undefined;
            fontStyle?: "normal" | "italic" | "unset" | undefined;
            disabled?: boolean | undefined;
            fontFamily?: "unset" | import("tamagui").GetThemeValueForKey<"fontFamily"> | undefined;
            fontSize?: "unset" | import("tamagui").GetThemeValueForKey<"fontSize"> | undefined;
            fontWeight?: 800 | 700 | 900 | "unset" | 100 | import("tamagui").GetThemeValueForKey<"fontWeight"> | 200 | 300 | 400 | 500 | 600 | undefined;
            maxFontSizeMultiplier?: number | undefined;
            ellipsis?: boolean | "unset" | undefined;
            circular?: boolean | undefined;
            variant?: "outlined" | "quiet" | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Icon: ({ size, ...props }: ButtonBehaviorIconProps) => import("react/jsx-runtime").JSX.Element;
    Text: import("react").FunctionComponent<Omit<import("tamagui").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: "small" | "medium" | "large" | "wide" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: "small" | "medium" | "large" | "wide" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
        size?: "small" | "medium" | "large" | "wide" | undefined;
    }>> & {
        ref?: import("react").Ref<import("tamagui").TamaguiTextElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiTextElement, import("tamagui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: "small" | "medium" | "large" | "wide" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("tamagui").TamaguiTextElement, import("tamagui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
            size?: "small" | "medium" | "large" | "wide" | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
};
export type ButtonProps = GetProps<typeof ButtonComponent>;
export {};
//# sourceMappingURL=Button.d.ts.map