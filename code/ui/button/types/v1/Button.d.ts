import type { TextContextStyles, TextParentStyles } from '@tamagui/text';
import type { GetProps, SizeTokens, ThemeableProps } from '@tamagui/web';
import type { FunctionComponent, JSX } from 'react';
type ButtonVariant = 'outlined';
export declare const ButtonContext: import("@tamagui/web").StyledContext<Partial<TextContextStyles & {
    size: SizeTokens | true;
    variant?: ButtonVariant;
}>, "color" | "size" | "variant" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">;
type ButtonIconProps = {
    color?: any;
    size?: any;
};
type IconProp = JSX.Element | FunctionComponent<ButtonIconProps> | ((props: ButtonIconProps) => any) | null;
type ButtonExtraProps = TextParentStyles & ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp;
    /**
     * add icon after, passes color and size automatically if Component
     */
    iconAfter?: IconProp;
    /**
     * adjust icon relative to size
     *
     * @default 1
     */
    scaleIcon?: number;
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean;
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number;
    /**
     * remove default styles
     */
    unstyled?: boolean;
};
type ButtonProps = ButtonExtraProps & GetProps<typeof ButtonFrame>;
declare const ButtonFrame: FunctionComponent<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps & Partial<Pick<Partial<TextContextStyles & {
    size: SizeTokens | true;
    variant?: ButtonVariant;
}>, "color" | "size" | "variant" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    size?: number | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
}> & {
    ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Partial<Pick<Partial<TextContextStyles & {
    size: SizeTokens | true;
    variant?: ButtonVariant;
}>, "color" | "size" | "variant" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    size?: number | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Partial<Pick<Partial<TextContextStyles & {
        size: SizeTokens | true;
        variant?: ButtonVariant;
    }>, "color" | "size" | "variant" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        size?: number | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
declare const ButtonText: FunctionComponent<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps & Partial<Pick<Partial<TextContextStyles & {
    size: SizeTokens | true;
    variant?: ButtonVariant;
}>, "color" | "size" | "variant" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").TextStylePropsBase | (import("@tamagui/web").TextStylePropsBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    size?: import("@tamagui/web").FontSize | undefined;
    unstyled?: boolean | undefined;
}> & {
    ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & Partial<Pick<Partial<TextContextStyles & {
    size: SizeTokens | true;
    variant?: ButtonVariant;
}>, "color" | "size" | "variant" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").TextStylePropsBase | (import("@tamagui/web").TextStylePropsBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    size?: import("@tamagui/web").FontSize | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & Partial<Pick<Partial<TextContextStyles & {
        size: SizeTokens | true;
        variant?: ButtonVariant;
    }>, "color" | "size" | "variant" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").TextStylePropsBase | (import("@tamagui/web").TextStylePropsBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        size?: import("@tamagui/web").FontSize | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
declare const ButtonIcon: (props: {
    children: React.ReactNode;
    scaleIcon?: number;
}) => any;
/**
 * @summary A Button is a clickable element that can be used to trigger actions such as submitting forms, navigating to other pages, or performing other actions.
 * @see — Docs https://tamagui.dev/ui/button
 */
declare const Button: FunctionComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps & Partial<Pick<Partial<TextContextStyles & {
    size: SizeTokens | true;
    variant?: ButtonVariant;
}>, "color" | "size" | "variant" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    size?: number | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
}>, keyof TextContextStyles | "unstyled" | "textProps" | "noTextWrap" | "icon" | "iconAfter" | "scaleIcon" | keyof ThemeableProps | "spaceFlex" | "scaleSpace"> & TextContextStyles & {
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp;
    /**
     * add icon after, passes color and size automatically if Component
     */
    iconAfter?: IconProp;
    /**
     * adjust icon relative to size
     *
     * @default 1
     */
    scaleIcon?: number;
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean;
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number;
    /**
     * remove default styles
     */
    unstyled?: boolean;
} & {
    ref?: import("react").Ref<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View> | undefined;
}> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps & Partial<Pick<Partial<TextContextStyles & {
    size: SizeTokens | true;
    variant?: ButtonVariant;
}>, "color" | "size" | "variant" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    size?: number | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
}>, keyof TextContextStyles | "unstyled" | "textProps" | "noTextWrap" | "icon" | "iconAfter" | "scaleIcon" | keyof ThemeableProps | "spaceFlex" | "scaleSpace"> & TextContextStyles & {
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp;
    /**
     * add icon after, passes color and size automatically if Component
     */
    iconAfter?: IconProp;
    /**
     * adjust icon relative to size
     *
     * @default 1
     */
    scaleIcon?: number;
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean;
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number;
    /**
     * remove default styles
     */
    unstyled?: boolean;
}, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & Partial<Pick<Partial<TextContextStyles & {
    size: SizeTokens | true;
    variant?: ButtonVariant;
}>, "color" | "size" | "variant" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">> & TextContextStyles & {
    textProps?: Partial<import("@tamagui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp;
    /**
     * add icon after, passes color and size automatically if Component
     */
    iconAfter?: IconProp;
    /**
     * adjust icon relative to size
     *
     * @default 1
     */
    scaleIcon?: number;
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean;
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number;
    /**
     * remove default styles
     */
    unstyled?: boolean;
}, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
    [x: string]: `$${string}` | `$${number}` | undefined;
}), {
    size?: number | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps & Partial<Pick<Partial<TextContextStyles & {
        size: SizeTokens | true;
        variant?: ButtonVariant;
    }>, "color" | "size" | "variant" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        size?: number | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    }>, keyof TextContextStyles | "unstyled" | "textProps" | "noTextWrap" | "icon" | "iconAfter" | "scaleIcon" | keyof ThemeableProps | "spaceFlex" | "scaleSpace"> & TextContextStyles & {
        textProps?: Partial<import("@tamagui/text").SizableTextProps>;
        noTextWrap?: boolean;
    } & ThemeableProps & {
        /**
         * add icon before, passes color and size automatically if Component
         */
        icon?: IconProp;
        /**
         * add icon after, passes color and size automatically if Component
         */
        iconAfter?: IconProp;
        /**
         * adjust icon relative to size
         *
         * @default 1
         */
        scaleIcon?: number;
        /**
         * make the spacing elements flex
         */
        spaceFlex?: number | boolean;
        /**
         * adjust internal space relative to icon size
         */
        scaleSpace?: number;
        /**
         * remove default styles
         */
        unstyled?: boolean;
    }, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & Partial<Pick<Partial<TextContextStyles & {
        size: SizeTokens | true;
        variant?: ButtonVariant;
    }>, "color" | "size" | "variant" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">> & TextContextStyles & {
        textProps?: Partial<import("@tamagui/text").SizableTextProps>;
        noTextWrap?: boolean;
    } & ThemeableProps & {
        /**
         * add icon before, passes color and size automatically if Component
         */
        icon?: IconProp;
        /**
         * add icon after, passes color and size automatically if Component
         */
        iconAfter?: IconProp;
        /**
         * adjust icon relative to size
         *
         * @default 1
         */
        scaleIcon?: number;
        /**
         * make the spacing elements flex
         */
        spaceFlex?: number | boolean;
        /**
         * adjust internal space relative to icon size
         */
        scaleSpace?: number;
        /**
         * remove default styles
         */
        unstyled?: boolean;
    }, import("@tamagui/web").StackStyleBase | (import("@tamagui/web").StackStyleBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        size?: number | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Text: FunctionComponent<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps & Partial<Pick<Partial<TextContextStyles & {
        size: SizeTokens | true;
        variant?: ButtonVariant;
    }>, "color" | "size" | "variant" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").TextStylePropsBase | (import("@tamagui/web").TextStylePropsBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        size?: import("@tamagui/web").FontSize | undefined;
        unstyled?: boolean | undefined;
    }> & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & Partial<Pick<Partial<TextContextStyles & {
        size: SizeTokens | true;
        variant?: ButtonVariant;
    }>, "color" | "size" | "variant" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").TextStylePropsBase | (import("@tamagui/web").TextStylePropsBase & {
        [x: string]: `$${string}` | `$${number}` | undefined;
    }), {
        size?: import("@tamagui/web").FontSize | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & Partial<Pick<Partial<TextContextStyles & {
            size: SizeTokens | true;
            variant?: ButtonVariant;
        }>, "color" | "size" | "variant" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign">>, import("@tamagui/web").TextStylePropsBase | (import("@tamagui/web").TextStylePropsBase & {
            [x: string]: `$${string}` | `$${number}` | undefined;
        }), {
            size?: import("@tamagui/web").FontSize | undefined;
            unstyled?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Icon: (props: {
        children: React.ReactNode;
        scaleIcon?: number;
    }) => any;
};
/**
 * @deprecated Instead of useButton, see the Button docs for the newer and much improved Advanced customization pattern: https://tamagui.dev/docs/components/button
 */
declare function useButton<Props extends ButtonProps>({ textProps, ...propsIn }: Props, { Text }?: {
    Text: any;
}): {
    spaceSize: number | true | import("@tamagui/web").UnionableString | "unset" | import("@tamagui/web").Variable<any>;
    isNested: boolean;
    props: Props;
};
export { Button, ButtonFrame, ButtonIcon, ButtonText, useButton, };
export type { ButtonProps };
//# sourceMappingURL=Button.d.ts.map