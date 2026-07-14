import type { TextContextStyles, TextParentStyles } from '@tamagui/text';
import type { GetProps, SizeTokens, ThemeableProps } from '@tamagui/web';
import type { FunctionComponent, JSX } from 'react';
type ButtonVariant = 'outlined';
export declare const ButtonContext: import("@tamagui/web").StyledContext<Partial<TextContextStyles & {
    size: SizeTokens | true;
    variant?: ButtonVariant;
}>, "color" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign" | "size" | "variant">;
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
};
type ButtonProps = ButtonExtraProps & GetProps<typeof ButtonFrame>;
declare const ButtonFrame: FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "color" | "ellipsis" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "maxFontSizeMultiplier" | "textAlign" | "size" | "elevation" | "disabled" | "transparent" | keyof import("@tamagui/web").StackStyleBase | "circular" | "variant" | "elevate" | "bordered" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    ellipsis?: boolean | "unset" | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "unset" | "normal" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "left" | "right" | "unset" | "auto" | "center" | "justify" | undefined;
    size?: number | false | import("@tamagui/web").Size | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    ellipsis?: boolean | "unset" | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "unset" | "normal" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "left" | "right" | "unset" | "auto" | "center" | "justify" | undefined;
    size?: number | false | import("@tamagui/web").Size | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    ellipsis?: boolean | "unset" | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "unset" | "normal" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "left" | "right" | "unset" | "auto" | "center" | "justify" | undefined;
    size?: number | false | import("@tamagui/web").Size | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & {
    ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    ellipsis?: boolean | "unset" | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "unset" | "normal" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "left" | "right" | "unset" | "auto" | "center" | "justify" | undefined;
    size?: number | false | import("@tamagui/web").Size | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
        ellipsis?: boolean | "unset" | undefined;
        fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "unset" | "normal" | "italic" | undefined;
        fontWeight?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
        letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        textAlign?: "left" | "right" | "unset" | "auto" | "center" | "justify" | undefined;
        size?: number | false | import("@tamagui/web").Size | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        variant?: "outlined" | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
declare const ButtonText: FunctionComponent<Omit<import("@tamagui/web").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase | "variant"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
    size?: import("@tamagui/web").FontSize | undefined;
    variant?: "outlined" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
    size?: import("@tamagui/web").FontSize | undefined;
    variant?: "outlined" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
    size?: import("@tamagui/web").FontSize | undefined;
    variant?: "outlined" | undefined;
}>> & {
    ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: import("@tamagui/web").FontSize | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
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
declare const Button: FunctionComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    ellipsis?: boolean | "unset" | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "unset" | "normal" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "left" | "right" | "unset" | "auto" | "center" | "justify" | undefined;
    size?: number | false | import("@tamagui/web").Size | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, keyof TextContextStyles | "scaleIcon" | "textProps" | "icon" | "iconAfter" | "noTextWrap" | keyof ThemeableProps | "spaceFlex" | "scaleSpace"> & TextContextStyles & {
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
} & {
    ref?: import("react").Ref<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View> | undefined;
}> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    ellipsis?: boolean | "unset" | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "unset" | "normal" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "left" | "right" | "unset" | "auto" | "center" | "justify" | undefined;
    size?: number | false | import("@tamagui/web").Size | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, keyof TextContextStyles | "scaleIcon" | "textProps" | "icon" | "iconAfter" | "noTextWrap" | keyof ThemeableProps | "spaceFlex" | "scaleSpace"> & TextContextStyles & {
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
}, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & TextContextStyles & {
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
}, import("@tamagui/web").StackStyleBase, {
    color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
    ellipsis?: boolean | "unset" | undefined;
    fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
    fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
    fontStyle?: "unset" | "normal" | "italic" | undefined;
    fontWeight?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
    maxFontSizeMultiplier?: number | undefined;
    textAlign?: "left" | "right" | "unset" | "auto" | "center" | "justify" | undefined;
    size?: number | false | import("@tamagui/web").Size | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
    disabled?: boolean | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    variant?: "outlined" | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
        ellipsis?: boolean | "unset" | undefined;
        fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "unset" | "normal" | "italic" | undefined;
        fontWeight?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
        letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        textAlign?: "left" | "right" | "unset" | "auto" | "center" | "justify" | undefined;
        size?: number | false | import("@tamagui/web").Size | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        variant?: "outlined" | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, keyof TextContextStyles | "scaleIcon" | "textProps" | "icon" | "iconAfter" | "noTextWrap" | keyof ThemeableProps | "spaceFlex" | "scaleSpace"> & TextContextStyles & {
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
    }, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & TextContextStyles & {
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
    }, import("@tamagui/web").StackStyleBase, {
        color?: "unset" | import("@tamagui/web").GetThemeValueForKey<"color"> | import("react-native").OpaqueColorValue | undefined;
        ellipsis?: boolean | "unset" | undefined;
        fontFamily?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontFamily"> | undefined;
        fontSize?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontSize"> | undefined;
        fontStyle?: "unset" | "normal" | "italic" | undefined;
        fontWeight?: "unset" | import("@tamagui/web").GetThemeValueForKey<"fontWeight"> | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
        letterSpacing?: "unset" | import("@tamagui/web").GetThemeValueForKey<"letterSpacing"> | undefined;
        maxFontSizeMultiplier?: number | undefined;
        textAlign?: "left" | "right" | "unset" | "auto" | "center" | "justify" | undefined;
        size?: number | false | import("@tamagui/web").Size | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
        disabled?: boolean | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        variant?: "outlined" | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Text: FunctionComponent<Omit<import("@tamagui/web").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase | "variant"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    }>> & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
            size?: import("@tamagui/web").FontSize | undefined;
            variant?: "outlined" | undefined;
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
    spaceSize: number | true | import("@tamagui/web").UnionableString | import("@tamagui/web").Variable<any> | "unset";
    isNested: boolean;
    props: Props;
};
export { Button, ButtonFrame, ButtonIcon, ButtonText, useButton, };
export type { ButtonProps };
//# sourceMappingURL=Button.d.ts.map