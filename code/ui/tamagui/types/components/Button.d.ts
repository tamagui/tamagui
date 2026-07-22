import { type ButtonIconProps as ButtonBehaviorIconProps, type GetProps } from '@tamagui/ui';
export declare const buttonSizes: import("@tamagui/ui").CreatedSizeTable<{
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
export declare const ButtonFrame: import("react").FunctionComponent<Omit<import("@tamagui/ui").StackNonStyleProps, "circular" | "color" | "disabled" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "size" | "textAlign" | "variant" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    circular?: boolean | undefined;
    color?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    size?: "large" | "medium" | "small" | "wide" | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    variant?: "outlined" | "quiet" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    circular?: boolean | undefined;
    color?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    size?: "large" | "medium" | "small" | "wide" | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    variant?: "outlined" | "quiet" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    circular?: boolean | undefined;
    color?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    size?: "large" | "medium" | "small" | "wide" | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>> & {
    ref?: import("react").Ref<import("@tamagui/ui").TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    circular?: boolean | undefined;
    color?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    size?: "large" | "medium" | "small" | "wide" | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    variant?: "outlined" | "quiet" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        circular?: boolean | undefined;
        color?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
        disabled?: boolean | undefined;
        ellipsis?: "unset" | boolean | undefined;
        fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "italic" | "normal" | "unset" | undefined;
        fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined;
        letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        size?: "large" | "medium" | "small" | "wide" | undefined;
        textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ButtonText: import("react").FunctionComponent<Omit<import("@tamagui/ui").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
    size?: "large" | "medium" | "small" | "wide" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
    size?: "large" | "medium" | "small" | "wide" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
    size?: "large" | "medium" | "small" | "wide" | undefined;
}>> & {
    ref?: import("react").Ref<import("@tamagui/ui").TamaguiTextElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: "large" | "medium" | "small" | "wide" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: "large" | "medium" | "small" | "wide" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ButtonIcon: ({ size, ...props }: ButtonBehaviorIconProps) => import("react/jsx-runtime").JSX.Element;
declare const ButtonComponent: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    circular?: boolean | undefined;
    color?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    size?: "large" | "medium" | "small" | "wide" | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>, "form" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget" | "icon" | "iconAfter" | "iconSize" | "name" | "noTextWrap" | "scaleIcon" | "textProps" | "type" | "value" | keyof import("@tamagui/ui").TextContextStyles> & import("@tamagui/ui").TextContextStyles & {
    textProps?: Partial<import("@tamagui/ui").SizableTextProps>;
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
    type?: 'submit' | 'reset' | 'button';
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/ui").StackNonStyleProps & import("@tamagui/ui").TextContextStyles & {
    textProps?: Partial<import("@tamagui/ui").SizableTextProps>;
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
    type?: 'submit' | 'reset' | 'button';
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}, import("@tamagui/web").StackStyleBase, {
    circular?: boolean | undefined;
    color?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    size?: "large" | "medium" | "small" | "wide" | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    variant?: "outlined" | "quiet" | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const Button: import("react").FunctionComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    circular?: boolean | undefined;
    color?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    size?: "large" | "medium" | "small" | "wide" | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>, "form" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget" | "icon" | "iconAfter" | "iconSize" | "name" | "noTextWrap" | "scaleIcon" | "textProps" | "type" | "value" | keyof import("@tamagui/ui").TextContextStyles> & import("@tamagui/ui").TextContextStyles & {
    textProps?: Partial<import("@tamagui/ui").SizableTextProps>;
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
    ref?: import("react").Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    circular?: boolean | undefined;
    color?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    size?: "large" | "medium" | "small" | "wide" | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>, "form" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget" | "icon" | "iconAfter" | "iconSize" | "name" | "noTextWrap" | "scaleIcon" | "textProps" | "type" | "value" | keyof import("@tamagui/ui").TextContextStyles> & import("@tamagui/ui").TextContextStyles & {
    textProps?: Partial<import("@tamagui/ui").SizableTextProps>;
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
    type?: 'submit' | 'reset' | 'button';
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/ui").StackNonStyleProps & import("@tamagui/ui").TextContextStyles & {
    textProps?: Partial<import("@tamagui/ui").SizableTextProps>;
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
    type?: 'submit' | 'reset' | 'button';
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}, import("@tamagui/web").StackStyleBase, {
    circular?: boolean | undefined;
    color?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    size?: "large" | "medium" | "small" | "wide" | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    variant?: "outlined" | "quiet" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        circular?: boolean | undefined;
        color?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
        disabled?: boolean | undefined;
        ellipsis?: "unset" | boolean | undefined;
        fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "italic" | "normal" | "unset" | undefined;
        fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined;
        letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        size?: "large" | "medium" | "small" | "wide" | undefined;
        textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }>, "form" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget" | "icon" | "iconAfter" | "iconSize" | "name" | "noTextWrap" | "scaleIcon" | "textProps" | "type" | "value" | keyof import("@tamagui/ui").TextContextStyles> & import("@tamagui/ui").TextContextStyles & {
        textProps?: Partial<import("@tamagui/ui").SizableTextProps>;
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
        type?: 'submit' | 'reset' | 'button';
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        name?: string;
        value?: string | readonly string[] | number;
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/ui").StackNonStyleProps & import("@tamagui/ui").TextContextStyles & {
        textProps?: Partial<import("@tamagui/ui").SizableTextProps>;
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
        type?: 'submit' | 'reset' | 'button';
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        name?: string;
        value?: string | readonly string[] | number;
    }, import("@tamagui/web").StackStyleBase, {
        circular?: boolean | undefined;
        color?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
        disabled?: boolean | undefined;
        ellipsis?: "unset" | boolean | undefined;
        fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "italic" | "normal" | "unset" | undefined;
        fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined;
        letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        size?: "large" | "medium" | "small" | "wide" | undefined;
        textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Frame: import("react").FunctionComponent<Omit<import("@tamagui/ui").StackNonStyleProps, "circular" | "color" | "disabled" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "size" | "textAlign" | "variant" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        circular?: boolean | undefined;
        color?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
        disabled?: boolean | undefined;
        ellipsis?: "unset" | boolean | undefined;
        fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "italic" | "normal" | "unset" | undefined;
        fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined;
        letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        size?: "large" | "medium" | "small" | "wide" | undefined;
        textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
        variant?: "outlined" | "quiet" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        circular?: boolean | undefined;
        color?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
        disabled?: boolean | undefined;
        ellipsis?: "unset" | boolean | undefined;
        fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "italic" | "normal" | "unset" | undefined;
        fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined;
        letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        size?: "large" | "medium" | "small" | "wide" | undefined;
        textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
        variant?: "outlined" | "quiet" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        circular?: boolean | undefined;
        color?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
        disabled?: boolean | undefined;
        ellipsis?: "unset" | boolean | undefined;
        fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "italic" | "normal" | "unset" | undefined;
        fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined;
        letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        size?: "large" | "medium" | "small" | "wide" | undefined;
        textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }>> & {
        ref?: import("react").Ref<import("@tamagui/ui").TamaguiElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        circular?: boolean | undefined;
        color?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
        disabled?: boolean | undefined;
        ellipsis?: "unset" | boolean | undefined;
        fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "italic" | "normal" | "unset" | undefined;
        fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined;
        letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        size?: "large" | "medium" | "small" | "wide" | undefined;
        textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
            circular?: boolean | undefined;
            color?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
            disabled?: boolean | undefined;
            ellipsis?: "unset" | boolean | undefined;
            fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
            fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
            fontStyle?: "italic" | "normal" | "unset" | undefined;
            fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | undefined;
            letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
            maxFontSizeMultiplier?: number | undefined;
            size?: "large" | "medium" | "small" | "wide" | undefined;
            textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
            variant?: "outlined" | "quiet" | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Icon: typeof ButtonIcon;
    Text: import("react").FunctionComponent<Omit<import("@tamagui/ui").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: "large" | "medium" | "small" | "wide" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: "large" | "medium" | "small" | "wide" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
        size?: "large" | "medium" | "small" | "wide" | undefined;
    }>> & {
        ref?: import("react").Ref<import("@tamagui/ui").TamaguiTextElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: "large" | "medium" | "small" | "wide" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
            size?: "large" | "medium" | "small" | "wide" | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
};
export type ButtonProps = GetProps<typeof ButtonComponent>;
export {};
//# sourceMappingURL=Button.d.ts.map