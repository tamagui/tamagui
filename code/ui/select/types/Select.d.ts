import type { FontSizeTokens, GetProps, TamaguiElement } from '@tamagui/core';
import type { ListItemProps } from '@tamagui/list-item';
import * as React from 'react';
import type { SelectProps, SelectScopedProps } from './types';
declare const SelectValueFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/web").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export type SelectValueExtraProps = SelectScopedProps<{
    placeholder?: React.ReactNode;
}>;
export type SelectValueProps = GetProps<typeof SelectValueFrame> & SelectValueExtraProps;
export declare const SelectIcon: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const SelectGroupFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export type SelectLabelProps = SelectScopedProps<ListItemProps>;
export declare const SelectSeparator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    vertical?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const Select: ((props: SelectScopedProps<SelectProps>) => import("react/jsx-runtime").JSX.Element) & {
    Adapt: ((props: import("@tamagui/adapt").AdaptProps) => import("react/jsx-runtime").JSX.Element) & {
        Contents: {
            ({ scope, ...rest }: {
                scope?: string;
            }): React.FunctionComponentElement<any>;
            shouldForwardSpace: boolean;
        };
    };
    Content: ({ children, scope, zIndex, ...focusScopeProps }: import("./types").SelectContentProps & import("@tamagui/focus-scope").FocusScopeProps) => import("react/jsx-runtime").JSX.Element | null;
    Group: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }>> & {
        scope?: import("./types").SelectScopes;
    } & React.RefAttributes<TamaguiElement>>;
    Icon: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Item: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        size?: import("@tamagui/core").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }>, keyof import("./SelectItem").SelectItemExtraProps> & import("./SelectItem").SelectItemExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("./SelectItem").SelectItemExtraProps, import("@tamagui/core").StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        size?: import("@tamagui/core").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    ItemIndicator: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }>> & {
        scope?: import("./types").SelectScopes;
    } & React.RefAttributes<TamaguiElement>>;
    ItemText: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }>, "scope"> & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").TextStylePropsBase, {
        size?: FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Label: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | "size" | "elevation" | keyof import("@tamagui/core").StackStyleBase | "transparent" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless" | "active" | "unstyled"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        size?: import("@tamagui/core").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        size?: import("@tamagui/core").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        size?: import("@tamagui/core").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }>> & Omit<import("@tamagui/text").TextParentStyles, "TextComponent" | "noTextWrap"> & import("@tamagui/core").ThemeableProps & {
        icon?: React.JSX.Element | React.FunctionComponent<{
            color?: any;
            size?: any;
        }> | null;
        iconAfter?: React.JSX.Element | React.FunctionComponent<{
            color?: any;
            size?: any;
        }> | null;
        scaleIcon?: number;
        spaceFlex?: number | boolean;
        scaleSpace?: number;
        title?: React.ReactNode;
        subTitle?: React.ReactNode;
        noTextWrap?: boolean | "all";
    } & {
        scope?: import("./types").SelectScopes;
    } & React.RefAttributes<TamaguiElement>>;
    ScrollDownButton: React.ForwardRefExoticComponent<import("./types").SelectScrollButtonProps & React.RefAttributes<TamaguiElement>>;
    ScrollUpButton: React.ForwardRefExoticComponent<import("./types").SelectScrollButtonProps & React.RefAttributes<TamaguiElement>>;
    Trigger: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | "size" | "elevation" | keyof import("@tamagui/core").StackStyleBase | "transparent" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless" | "active" | "unstyled"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        size?: import("@tamagui/core").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        size?: import("@tamagui/core").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        size?: import("@tamagui/core").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }>> & Omit<import("@tamagui/text").TextParentStyles, "TextComponent" | "noTextWrap"> & import("@tamagui/core").ThemeableProps & {
        icon?: React.JSX.Element | React.FunctionComponent<{
            color?: any;
            size?: any;
        }> | null;
        iconAfter?: React.JSX.Element | React.FunctionComponent<{
            color?: any;
            size?: any;
        }> | null;
        scaleIcon?: number;
        spaceFlex?: number | boolean;
        scaleSpace?: number;
        title?: React.ReactNode;
        subTitle?: React.ReactNode;
        noTextWrap?: boolean | "all";
    } & {
        scope?: import("./types").SelectScopes;
    } & React.RefAttributes<TamaguiElement>>;
    Value: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }>, "scope" | "placeholder"> & {
        placeholder?: React.ReactNode;
    } & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & {
        placeholder?: React.ReactNode;
    } & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Viewport: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        size?: import("@tamagui/core").SizeTokens | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        unstyled?: boolean | undefined;
    }>, "size" | "scope" | "unstyled" | "disableScroll"> & {
        size?: import("@tamagui/core").SizeTokens;
        disableScroll?: boolean;
        unstyled?: boolean;
    } & {
        scope?: import("./types").SelectScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        size?: import("@tamagui/core").SizeTokens;
        disableScroll?: boolean;
        unstyled?: boolean;
    } & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").StackStyleBase, {
        size?: import("@tamagui/core").SizeTokens | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Sheet: React.FunctionComponent<Omit<import("@tamagui/sheet").SheetProps, "open" | "onOpenChange"> & React.RefAttributes<import("react-native").View>> & {
        Frame: import("react").ForwardRefExoticComponent<import("@tamagui/sheet").SheetScopedProps<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            inset?: number | import("@tamagui/core").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | null | undefined;
            fullscreen?: boolean | undefined;
            unstyled?: boolean | undefined;
        }>, keyof {
            disableHideBottomOverflow?: boolean;
            adjustPaddingForOffscreenContent?: boolean;
        }> & {
            disableHideBottomOverflow?: boolean;
            adjustPaddingForOffscreenContent?: boolean;
        }>>;
        Overlay: import("react").MemoExoticComponent<(propsIn: import("@tamagui/sheet").SheetScopedProps<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            open?: boolean | undefined;
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            inset?: number | import("@tamagui/core").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | null | undefined;
            fullscreen?: boolean | undefined;
            circular?: boolean | undefined;
            transparent?: boolean | undefined;
            unstyled?: boolean | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            backgrounded?: boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }>>) => null>;
        Handle: import("@tamagui/core").TamaguiComponent<any, any, any, any, {
            open?: boolean;
        }, {}> | import("@tamagui/core").TamaguiComponent<any, any, any, {}, {}, {}>;
        ScrollView: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/core").TamaguiComponentPropsBaseBase & import("react-native").ScrollViewProps, keyof import("@tamagui/core").StackStyleBase | "fullscreen" | "contentContainerStyle"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }> & {
            fullscreen?: boolean | undefined;
        } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }> & {
            fullscreen?: boolean | undefined;
        } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase, {}>> | undefined;
        }, {
            fullscreen?: boolean | undefined;
        }>> & import("react").RefAttributes<import("react-native").ScrollView>>;
    };
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => import("react/jsx-runtime").JSX.Element;
};
export {};
//# sourceMappingURL=Select.d.ts.map