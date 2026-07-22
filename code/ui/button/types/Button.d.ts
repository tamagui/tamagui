import type { TextContextStyles, TextParentStyles } from '@tamagui/text';
import type { GetProps } from '@tamagui/web';
import type { FunctionComponent, JSX, ReactNode } from 'react';
export declare const ButtonContext: import("@tamagui/web").StyledContext<TextContextStyles, "color" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">;
export declare const ButtonFrame: FunctionComponent<Omit<import("@tamagui/web").StackNonStyleProps, "color" | "disabled" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
}>> & {
    ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
        disabled?: boolean | undefined;
        ellipsis?: "unset" | boolean | undefined;
        fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "italic" | "normal" | "unset" | undefined;
        fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined;
        letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ButtonText: FunctionComponent<Omit<import("@tamagui/web").TextNonStyleProps, keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {}>> & {
    ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {}, import("@tamagui/web").StaticConfigPublic];
};
export type ButtonIconProps = {
    children: ReactNode;
    color?: TextContextStyles['color'];
    scaleIcon?: number;
    size?: number;
};
export declare const ButtonIcon: ({ children, color, scaleIcon, size }: ButtonIconProps) => any;
type ButtonIconInput = JSX.Element | FunctionComponent<{
    color?: any;
    size?: any;
}> | ((props: {
    color?: any;
    size?: any;
}) => ReactNode) | null;
export type ButtonBehaviorProps = TextParentStyles & {
    icon?: ButtonIconInput;
    iconAfter?: ButtonIconInput;
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
};
export type UseButtonOptions = {
    Text?: any;
    iconColor?: TextContextStyles['color'];
    iconSize?: number;
    textProps?: Record<string, unknown>;
};
export declare function useButton<Props extends ButtonBehaviorProps>(propsIn: Props, { Text, iconColor: iconColorOption, iconSize: iconSizeOption, textProps: textPropsOption, }?: UseButtonOptions): {
    isNested: boolean;
    props: Props;
};
declare const ButtonComponent: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
}>, "form" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget" | "icon" | "iconAfter" | "iconSize" | "name" | "noTextWrap" | "scaleIcon" | "textProps" | "type" | "value" | keyof TextContextStyles> & TextContextStyles & {
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    icon?: ButtonIconInput;
    iconAfter?: ButtonIconInput;
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
}, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/web").StackNonStyleProps & TextContextStyles & {
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    icon?: ButtonIconInput;
    iconAfter?: ButtonIconInput;
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
    color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const Button: FunctionComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
}>, "form" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget" | "icon" | "iconAfter" | "iconSize" | "name" | "noTextWrap" | "scaleIcon" | "textProps" | "type" | "value" | keyof TextContextStyles> & TextContextStyles & {
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    icon?: ButtonIconInput;
    iconAfter?: ButtonIconInput;
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
}> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
}>, "form" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget" | "icon" | "iconAfter" | "iconSize" | "name" | "noTextWrap" | "scaleIcon" | "textProps" | "type" | "value" | keyof TextContextStyles> & TextContextStyles & {
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    icon?: ButtonIconInput;
    iconAfter?: ButtonIconInput;
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
}, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/web").StackNonStyleProps & TextContextStyles & {
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    icon?: ButtonIconInput;
    iconAfter?: ButtonIconInput;
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
    color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    disabled?: boolean | undefined;
    ellipsis?: "unset" | boolean | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "italic" | "normal" | "unset" | undefined;
    fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
        disabled?: boolean | undefined;
        ellipsis?: "unset" | boolean | undefined;
        fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "italic" | "normal" | "unset" | undefined;
        fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined;
        letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    }>, "form" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget" | "icon" | "iconAfter" | "iconSize" | "name" | "noTextWrap" | "scaleIcon" | "textProps" | "type" | "value" | keyof TextContextStyles> & TextContextStyles & {
        textProps?: Partial<import("@tamagui/text").SizableTextProps>;
        noTextWrap?: boolean;
    } & {
        icon?: ButtonIconInput;
        iconAfter?: ButtonIconInput;
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
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/web").StackNonStyleProps & TextContextStyles & {
        textProps?: Partial<import("@tamagui/text").SizableTextProps>;
        noTextWrap?: boolean;
    } & {
        icon?: ButtonIconInput;
        iconAfter?: ButtonIconInput;
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
        color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
        disabled?: boolean | undefined;
        ellipsis?: "unset" | boolean | undefined;
        fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "italic" | "normal" | "unset" | undefined;
        fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined;
        letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Apply: import("react").Provider<TextContextStyles> & import("react").ProviderExoticComponent<Partial<TextContextStyles> & {
        children?: ReactNode;
        scope?: string;
    }>;
    Frame: FunctionComponent<Omit<import("@tamagui/web").StackNonStyleProps, "color" | "disabled" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
        disabled?: boolean | undefined;
        ellipsis?: "unset" | boolean | undefined;
        fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "italic" | "normal" | "unset" | undefined;
        fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined;
        letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
        disabled?: boolean | undefined;
        ellipsis?: "unset" | boolean | undefined;
        fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "italic" | "normal" | "unset" | undefined;
        fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined;
        letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
        disabled?: boolean | undefined;
        ellipsis?: "unset" | boolean | undefined;
        fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "italic" | "normal" | "unset" | undefined;
        fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined;
        letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    }>> & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
        disabled?: boolean | undefined;
        ellipsis?: "unset" | boolean | undefined;
        fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "italic" | "normal" | "unset" | undefined;
        fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined;
        letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
            color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
            disabled?: boolean | undefined;
            ellipsis?: "unset" | boolean | undefined;
            fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
            fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
            fontStyle?: "italic" | "normal" | "unset" | undefined;
            fontWeight?: "unset" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | undefined;
            letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
            maxFontSizeMultiplier?: number | undefined;
            textAlign?: "auto" | "center" | "justify" | "left" | "right" | "unset" | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Icon: typeof ButtonIcon;
    Text: FunctionComponent<Omit<import("@tamagui/web").TextNonStyleProps, keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {}>> & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {}, import("@tamagui/web").StaticConfigPublic];
    };
};
export type ButtonProps = GetProps<typeof ButtonComponent>;
export {};
//# sourceMappingURL=Button.d.ts.map