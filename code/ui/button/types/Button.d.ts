import type { TextContextStyles } from '@tamagui/text';
import type { GetProps, SizeTokens } from '@tamagui/web';
import type { FunctionComponent, JSX } from 'react';
type ButtonVariant = 'outlined';
type ButtonContextStyles = TextContextStyles & {
    size?: SizeTokens | true;
    variant?: ButtonVariant;
    elevation?: SizeTokens | number;
};
export declare const ButtonContext: import("@tamagui/web").StyledContext<{
    size?: SizeTokens | true;
    variant?: ButtonVariant;
    color?: ButtonContextStyles["color"];
}, "color" | "size" | "variant">;
type IconProp = JSX.Element | FunctionComponent<{
    color?: any;
    size?: any;
}> | null;
declare const ButtonComponent: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps & Partial<Pick<ButtonContextStyles, "color" | "size" | "variant" | "elevation" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    size?: number | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, keyof TextContextStyles | "form" | "name" | "value" | "type" | "textProps" | "noTextWrap" | "icon" | "iconAfter" | "scaleIcon" | "iconSize" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget"> & TextContextStyles & {
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    iconSize?: SizeTokens;
    type?: "submit" | "reset" | "button";
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View, import("@tamagui/web").StackNonStyleProps & Partial<Pick<ButtonContextStyles, "color" | "size" | "variant" | "elevation" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">> & TextContextStyles & {
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    iconSize?: SizeTokens;
    type?: "submit" | "reset" | "button";
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    size?: number | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const Button: FunctionComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps & Partial<Pick<ButtonContextStyles, "color" | "size" | "variant" | "elevation" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    size?: number | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, keyof TextContextStyles | "form" | "name" | "value" | "type" | "textProps" | "noTextWrap" | "icon" | "iconAfter" | "scaleIcon" | "iconSize" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget"> & TextContextStyles & {
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    iconSize?: SizeTokens;
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
    ref?: import("react").Ref<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View> | undefined;
}> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps & Partial<Pick<ButtonContextStyles, "color" | "size" | "variant" | "elevation" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    size?: number | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, keyof TextContextStyles | "form" | "name" | "value" | "type" | "textProps" | "noTextWrap" | "icon" | "iconAfter" | "scaleIcon" | "iconSize" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget"> & TextContextStyles & {
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    iconSize?: SizeTokens;
    type?: "submit" | "reset" | "button";
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View, import("@tamagui/web").StackNonStyleProps & Partial<Pick<ButtonContextStyles, "color" | "size" | "variant" | "elevation" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">> & TextContextStyles & {
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    iconSize?: SizeTokens;
    type?: "submit" | "reset" | "button";
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    size?: number | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps & Partial<Pick<ButtonContextStyles, "color" | "size" | "variant" | "elevation" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        size?: number | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, keyof TextContextStyles | "form" | "name" | "value" | "type" | "textProps" | "noTextWrap" | "icon" | "iconAfter" | "scaleIcon" | "iconSize" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget"> & TextContextStyles & {
        textProps?: Partial<import("@tamagui/text").SizableTextProps>;
        noTextWrap?: boolean;
    } & {
        icon?: IconProp;
        iconAfter?: IconProp;
        scaleIcon?: number;
        iconSize?: SizeTokens;
        type?: "submit" | "reset" | "button";
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        name?: string;
        value?: string | readonly string[] | number;
    }, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View, import("@tamagui/web").StackNonStyleProps & Partial<Pick<ButtonContextStyles, "color" | "size" | "variant" | "elevation" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">> & TextContextStyles & {
        textProps?: Partial<import("@tamagui/text").SizableTextProps>;
        noTextWrap?: boolean;
    } & {
        icon?: IconProp;
        iconAfter?: IconProp;
        scaleIcon?: number;
        iconSize?: SizeTokens;
        type?: "submit" | "reset" | "button";
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        name?: string;
        value?: string | readonly string[] | number;
    }, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        size?: number | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Apply: import("react").Provider<ButtonContextStyles> & import("react").ProviderExoticComponent<Partial<ButtonContextStyles> & {
        children?: import("react").ReactNode;
        scope?: string;
    }>;
    Frame: FunctionComponent<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps & Partial<Pick<ButtonContextStyles, "color" | "size" | "variant" | "elevation" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        size?: number | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }> & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & Partial<Pick<ButtonContextStyles, "color" | "size" | "variant" | "elevation" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        size?: number | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & Partial<Pick<ButtonContextStyles, "color" | "size" | "variant" | "elevation" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
            [x: string]: `$${string}` | `$${number}` | undefined;
        }), {
            size?: number | import("@tamagui/web").Size | undefined;
            variant?: "outlined" | undefined;
            elevation?: number | import("@tamagui/web").Size | undefined;
            disabled?: boolean | undefined;
            unstyled?: boolean | undefined;
            circular?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Text: FunctionComponent<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps & Partial<Pick<ButtonContextStyles, "color" | "size" | "variant" | "elevation" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").TextStylePropsBase | (import("@tamagui/web").TextStylePropsBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        size?: import("@tamagui/web").FontSize | undefined;
        unstyled?: boolean | undefined;
    }> & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & Partial<Pick<ButtonContextStyles, "color" | "size" | "variant" | "elevation" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").TextStylePropsBase | (import("@tamagui/web").TextStylePropsBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        size?: import("@tamagui/web").FontSize | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & Partial<Pick<ButtonContextStyles, "color" | "size" | "variant" | "elevation" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").TextStylePropsBase | (import("@tamagui/web").TextStylePropsBase & {
            [x: string]: `$${string}` | `$${number}` | undefined;
        }), {
            size?: import("@tamagui/web").FontSize | undefined;
            unstyled?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Icon: (props: {
        children: React.ReactNode;
        scaleIcon?: number;
        size?: SizeTokens | true;
    }) => any;
};
export type ButtonProps = GetProps<typeof ButtonComponent>;
export {};
//# sourceMappingURL=Button.d.ts.map