import type { Scope } from '@tamagui/create-context';
import { ColorProp } from '@tamagui/helpers-tamagui';
import { TextParentStyles } from '@tamagui/text';
import { CreateTamaguiProps, GetProps, SizeTokens, TamaguiElement, ThemeableProps } from '@tamagui/web';
import { FunctionComponent } from 'react';
declare const ButtonFrame: import("@tamagui/web").TamaguiComponent<Omit<unknown, "disabled" | "size" | "unstyled" | "active"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
} & import("@tamagui/web").MediaProps<Partial<Omit<unknown, "disabled" | "size" | "unstyled" | "active"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<unknown, "disabled" | "size" | "unstyled" | "active"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
}>>, TamaguiElement, unknown, {
    readonly unstyled?: boolean | undefined;
    readonly size?: SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
}, {
    displayName: string | undefined;
    Text: import("@tamagui/web").TamaguiComponent<(Omit<import("react-native/types").TextProps, "children" | "onLayout" | keyof import("react-native/types").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size"> & {
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native/types").TextProps, "children" | "onLayout" | keyof import("react-native/types").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size"> & {
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native/types").TextProps, "children" | "onLayout" | keyof import("react-native/types").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size"> & {
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>>) | (Omit<import("react-native/types").TextProps, "children" | ("onLayout" | keyof import("react-native/types").GestureResponderHandlers)> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native/types").TextProps, "children" | ("onLayout" | keyof import("react-native/types").GestureResponderHandlers)> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native/types").TextProps, "children" | ("onLayout" | keyof import("react-native/types").GestureResponderHandlers)> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>), TamaguiElement, import("@tamagui/web").TextPropsBase, {
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), {
        displayName: string | undefined;
    }>;
    Icon: (props: {
        children: import("react").ReactNode;
        size?: SizeTokens | undefined;
        color?: ColorProp;
    }) => any;
}>;
type ButtonIconProps = {
    color?: string;
    size?: number;
};
type IconProp = JSX.Element | FunctionComponent<ButtonIconProps> | null;
type ClassicButtonProps = {
    /**
     * add icon before, passes color and size automatically if Component
     *
     * NOTE: Only supported on the classic API.
     */
    icon?: IconProp;
    /**
     * add icon after, passes color and size automatically if Component
     *
     * NOTE: Only supported on the classic API.
     */
    iconAfter?: IconProp;
    /**
     * adjust icon relative to size
     *
     * NOTE: Only supported on the classic API.
     * @default 1
     */
    scaleIcon?: number;
    /**
     * make the spacing elements flex
     *
     * NOTE: Only supported on the classic API.
     */
    spaceFlex?: number | boolean;
    /**
     * adjust internal space relative to icon size
     *
     * NOTE: Only supported on the classic API.
     */
    scaleSpace?: number;
} & Omit<TextParentStyles, 'TextComponent'>;
type ButtonProps = GetProps<typeof ButtonFrame> & ThemeableProps & ClassicButtonProps & {
    /**
     * Used to override config's button API mode
     */
    forceButtonApi?: CreateTamaguiProps['buttonApi'];
};
declare const createButtonScope: import("@tamagui/create-context").CreateScope;
type ScopedProps<P> = P & {
    __scopeButton?: Scope;
};
declare const ButtonTextFrame: import("@tamagui/web").TamaguiComponent<Omit<import("react-native/types").TextProps, "children" | ("onLayout" | keyof import("react-native/types").GestureResponderHandlers)> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
    readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
} | ({
    readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), "unstyled"> & {
    readonly unstyled?: boolean | undefined;
} & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native/types").TextProps, "children" | ("onLayout" | keyof import("react-native/types").GestureResponderHandlers)> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
    readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
} | ({
    readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), "unstyled"> & {
    readonly unstyled?: boolean | undefined;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native/types").TextProps, "children" | ("onLayout" | keyof import("react-native/types").GestureResponderHandlers)> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
    readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
} | ({
    readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
}), "unstyled"> & {
    readonly unstyled?: boolean | undefined;
}>>, TamaguiElement, import("@tamagui/web").TextPropsBase, ({
    readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
} | ({
    readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
} & {
    [x: string]: undefined;
})) & {
    readonly unstyled?: boolean | undefined;
}, {
    displayName: string | undefined;
}>;
type ButtonIconComponentProps = {
    children: React.ReactNode;
} & Pick<ButtonProps, 'scaleIcon'>;
declare const Button: import("@tamagui/web").ReactComponentWithRef<Object & Omit<Omit<unknown, "disabled" | "size" | "unstyled" | "active"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
} & import("@tamagui/web").MediaProps<Partial<Omit<unknown, "disabled" | "size" | "unstyled" | "active"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<unknown, "disabled" | "size" | "unstyled" | "active"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
}>>, keyof Object>, TamaguiElement> & {
    staticConfig: import("@tamagui/web").StaticConfigParsed;
    styleable: import("@tamagui/web").Styleable<Omit<unknown, "disabled" | "size" | "unstyled" | "active"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: SizeTokens | undefined;
        readonly active?: boolean | undefined;
        readonly disabled?: boolean | undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<unknown, "disabled" | "size" | "unstyled" | "active"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: SizeTokens | undefined;
        readonly active?: boolean | undefined;
        readonly disabled?: boolean | undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<unknown, "disabled" | "size" | "unstyled" | "active"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: SizeTokens | undefined;
        readonly active?: boolean | undefined;
        readonly disabled?: boolean | undefined;
    }>>, TamaguiElement>;
} & {
    Text: import("@tamagui/web").ReactComponentWithRef<Object & Omit<Omit<import("react-native/types").TextProps, "children" | ("onLayout" | keyof import("react-native/types").GestureResponderHandlers)> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native/types").TextProps, "children" | ("onLayout" | keyof import("react-native/types").GestureResponderHandlers)> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native/types").TextProps, "children" | ("onLayout" | keyof import("react-native/types").GestureResponderHandlers)> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } | ({
        readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), "unstyled"> & {
        readonly unstyled?: boolean | undefined;
    }>>, keyof Object>, TamaguiElement> & {
        staticConfig: import("@tamagui/web").StaticConfigParsed;
        styleable: import("@tamagui/web").Styleable<Omit<import("react-native/types").TextProps, "children" | ("onLayout" | keyof import("react-native/types").GestureResponderHandlers)> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } | ({
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } & {
            [x: string]: undefined;
        }), "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native/types").TextProps, "children" | ("onLayout" | keyof import("react-native/types").GestureResponderHandlers)> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } | ({
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } & {
            [x: string]: undefined;
        }), "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native/types").TextProps, "children" | ("onLayout" | keyof import("react-native/types").GestureResponderHandlers)> & import("@tamagui/web").ExtendsBaseTextProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } | ({
            readonly size?: import("@tamagui/web").FontSizeTokens | undefined;
        } & {
            [x: string]: undefined;
        }), "unstyled"> & {
            readonly unstyled?: boolean | undefined;
        }>>, TamaguiElement>;
    };
    Icon: (props: ScopedProps<ButtonIconComponentProps>) => any;
};
/**
 * Hook only used with the classic button API.
 *
 */
declare function useButton(propsIn: ButtonProps, { Text }?: {
    Text: any;
}): {
    spaceSize: any;
    isNested: boolean;
    props: {
        children: string | number | boolean | import("react").ReactFragment | JSX.Element | null | undefined;
        size?: SizeTokens | undefined;
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        hoverStyle?: Partial<Omit<unknown, "disabled" | "size" | "unstyled" | "active"> & {
            readonly unstyled?: boolean | undefined;
            readonly size?: SizeTokens | undefined;
            readonly active?: boolean | undefined;
            readonly disabled?: boolean | undefined;
        }> | null | undefined;
        pressStyle?: Partial<Omit<unknown, "disabled" | "size" | "unstyled" | "active"> & {
            readonly unstyled?: boolean | undefined;
            readonly size?: SizeTokens | undefined;
            readonly active?: boolean | undefined;
            readonly disabled?: boolean | undefined;
        }> | null | undefined;
        focusStyle?: Partial<Omit<unknown, "disabled" | "size" | "unstyled" | "active"> & {
            readonly unstyled?: boolean | undefined;
            readonly size?: SizeTokens | undefined;
            readonly active?: boolean | undefined;
            readonly disabled?: boolean | undefined;
        }> | {
            borderColor: string;
        } | null | undefined;
        exitStyle?: Partial<Omit<unknown, "disabled" | "size" | "unstyled" | "active"> & {
            readonly unstyled?: boolean | undefined;
            readonly size?: SizeTokens | undefined;
            readonly active?: boolean | undefined;
            readonly disabled?: boolean | undefined;
        }> | null | undefined;
        enterStyle?: Partial<Omit<unknown, "disabled" | "size" | "unstyled" | "active"> & {
            readonly unstyled?: boolean | undefined;
            readonly size?: SizeTokens | undefined;
            readonly active?: boolean | undefined;
            readonly disabled?: boolean | undefined;
        }> | null | undefined;
        themeInverse?: boolean | undefined;
        themeReset?: boolean | undefined;
        componentName?: string | undefined;
        debug?: import("@tamagui/web").DebugProp | undefined;
        /**
         * Used to override config's button API mode
         */
        forceButtonApi?: "mixed" | "composable" | "simple" | undefined;
        tag: string | undefined;
        focusable?: undefined;
    };
};
declare const buttonStaticConfig: {
    inlineProps: Set<string>;
};
export { Button, ButtonFrame, ButtonTextFrame as ButtonText, buttonStaticConfig, createButtonScope, useButton, };
export type { ButtonProps };
//# sourceMappingURL=themed.d.ts.map