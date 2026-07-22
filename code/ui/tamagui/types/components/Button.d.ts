import { type ButtonIconProps as ButtonBehaviorIconProps, type GetProps, type SizeTokens } from '@tamagui/ui';
export type ButtonSize = SizeTokens;
export declare const ButtonFrame: import("react").FunctionComponent<Omit<import("@tamagui/ui").StackNonStyleProps, "color" | "size" | "fontSize" | "ellipsis" | "fontFamily" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign" | "disabled" | keyof import("@tamagui/web").StackStyleBase | "circular" | "variant"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/ui").GetThemeValueForKey<"color"> | undefined;
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    ellipsis?: boolean | "unset" | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontStyle?: "normal" | "unset" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
    disabled?: boolean | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/ui").GetThemeValueForKey<"color"> | undefined;
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    ellipsis?: boolean | "unset" | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontStyle?: "normal" | "unset" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
    disabled?: boolean | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/ui").GetThemeValueForKey<"color"> | undefined;
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    ellipsis?: boolean | "unset" | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontStyle?: "normal" | "unset" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
    disabled?: boolean | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>> & {
    ref?: import("react").Ref<import("@tamagui/ui").TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/ui").GetThemeValueForKey<"color"> | undefined;
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    ellipsis?: boolean | "unset" | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontStyle?: "normal" | "unset" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
    disabled?: boolean | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/ui").GetThemeValueForKey<"color"> | undefined;
        size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
        fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
        ellipsis?: boolean | "unset" | undefined;
        fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontStyle?: "normal" | "unset" | "italic" | undefined;
        fontWeight?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
        letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
        disabled?: boolean | undefined;
        circular?: boolean | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ButtonText: import("react").FunctionComponent<Omit<import("@tamagui/ui").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
}>> & {
    ref?: import("react").Ref<import("@tamagui/ui").TamaguiTextElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ButtonIcon: ({ size, ...props }: ButtonBehaviorIconProps) => import("react/jsx-runtime").JSX.Element;
declare const ButtonComponent: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/ui").GetThemeValueForKey<"color"> | undefined;
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    ellipsis?: boolean | "unset" | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontStyle?: "normal" | "unset" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
    disabled?: boolean | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>, "value" | "form" | "name" | "scaleIcon" | keyof import("@tamagui/ui").TextContextStyles | "textProps" | "noTextWrap" | "icon" | "iconAfter" | "iconSize" | "type" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget"> & import("@tamagui/ui").TextContextStyles & {
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
    type?: "submit" | "reset" | "button";
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
    color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/ui").GetThemeValueForKey<"color"> | undefined;
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    ellipsis?: boolean | "unset" | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontStyle?: "normal" | "unset" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
    disabled?: boolean | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const Button: import("react").FunctionComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/ui").GetThemeValueForKey<"color"> | undefined;
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    ellipsis?: boolean | "unset" | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontStyle?: "normal" | "unset" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
    disabled?: boolean | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>, "value" | "form" | "name" | "scaleIcon" | keyof import("@tamagui/ui").TextContextStyles | "textProps" | "noTextWrap" | "icon" | "iconAfter" | "iconSize" | "type" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget"> & import("@tamagui/ui").TextContextStyles & {
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
}> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/ui").GetThemeValueForKey<"color"> | undefined;
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    ellipsis?: boolean | "unset" | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontStyle?: "normal" | "unset" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
    disabled?: boolean | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
}>, "value" | "form" | "name" | "scaleIcon" | keyof import("@tamagui/ui").TextContextStyles | "textProps" | "noTextWrap" | "icon" | "iconAfter" | "iconSize" | "type" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget"> & import("@tamagui/ui").TextContextStyles & {
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
    type?: "submit" | "reset" | "button";
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
    color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/ui").GetThemeValueForKey<"color"> | undefined;
    size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
    fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
    ellipsis?: boolean | "unset" | undefined;
    fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
    fontStyle?: "normal" | "unset" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
    disabled?: boolean | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | "quiet" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/ui").GetThemeValueForKey<"color"> | undefined;
        size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
        fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
        ellipsis?: boolean | "unset" | undefined;
        fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontStyle?: "normal" | "unset" | "italic" | undefined;
        fontWeight?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
        letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
        disabled?: boolean | undefined;
        circular?: boolean | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }>, "value" | "form" | "name" | "scaleIcon" | keyof import("@tamagui/ui").TextContextStyles | "textProps" | "noTextWrap" | "icon" | "iconAfter" | "iconSize" | "type" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget"> & import("@tamagui/ui").TextContextStyles & {
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
        type?: "submit" | "reset" | "button";
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
        color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/ui").GetThemeValueForKey<"color"> | undefined;
        size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
        fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
        ellipsis?: boolean | "unset" | undefined;
        fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontStyle?: "normal" | "unset" | "italic" | undefined;
        fontWeight?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
        letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
        disabled?: boolean | undefined;
        circular?: boolean | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Frame: import("react").FunctionComponent<Omit<import("@tamagui/ui").StackNonStyleProps, "color" | "size" | "fontSize" | "ellipsis" | "fontFamily" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign" | "disabled" | keyof import("@tamagui/web").StackStyleBase | "circular" | "variant"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/ui").GetThemeValueForKey<"color"> | undefined;
        size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
        fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
        ellipsis?: boolean | "unset" | undefined;
        fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontStyle?: "normal" | "unset" | "italic" | undefined;
        fontWeight?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
        letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
        disabled?: boolean | undefined;
        circular?: boolean | undefined;
        variant?: "outlined" | "quiet" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/ui").GetThemeValueForKey<"color"> | undefined;
        size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
        fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
        ellipsis?: boolean | "unset" | undefined;
        fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontStyle?: "normal" | "unset" | "italic" | undefined;
        fontWeight?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
        letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
        disabled?: boolean | undefined;
        circular?: boolean | undefined;
        variant?: "outlined" | "quiet" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/ui").GetThemeValueForKey<"color"> | undefined;
        size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
        fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
        ellipsis?: boolean | "unset" | undefined;
        fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontStyle?: "normal" | "unset" | "italic" | undefined;
        fontWeight?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
        letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
        disabled?: boolean | undefined;
        circular?: boolean | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }>> & {
        ref?: import("react").Ref<import("@tamagui/ui").TamaguiElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/ui").GetThemeValueForKey<"color"> | undefined;
        size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
        fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
        ellipsis?: boolean | "unset" | undefined;
        fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
        fontStyle?: "normal" | "unset" | "italic" | undefined;
        fontWeight?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
        letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
        disabled?: boolean | undefined;
        circular?: boolean | undefined;
        variant?: "outlined" | "quiet" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiElement, import("@tamagui/ui").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
            color?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/ui").GetThemeValueForKey<"color"> | undefined;
            size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
            fontSize?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontSize"> | undefined;
            ellipsis?: boolean | "unset" | undefined;
            fontFamily?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontFamily"> | undefined;
            fontStyle?: "normal" | "unset" | "italic" | undefined;
            fontWeight?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
            letterSpacing?: "unset" | import("@tamagui/ui").GetThemeValueForKey<"letterSpacing"> | undefined;
            maxFontSizeMultiplier?: number | undefined;
            textAlign?: "auto" | "unset" | "left" | "right" | "center" | "justify" | undefined;
            disabled?: boolean | undefined;
            circular?: boolean | undefined;
            variant?: "outlined" | "quiet" | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Icon: ({ size, ...props }: ButtonBehaviorIconProps) => import("react/jsx-runtime").JSX.Element;
    Text: import("react").FunctionComponent<Omit<import("@tamagui/ui").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
        size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
    }>> & {
        ref?: import("react").Ref<import("@tamagui/ui").TamaguiTextElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/ui").TamaguiTextElement, import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
            size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
};
export type ButtonProps = GetProps<typeof ButtonComponent>;
export {};
//# sourceMappingURL=Button.d.ts.map