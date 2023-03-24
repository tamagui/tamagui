/// <reference types="react" />
export declare const SelectControlled: import("react").ForwardRefExoticComponent<import("tamagui").SelectProps & {
    __scopeSelect?: import("tamagui").Scope<any>;
} & Omit<import("react-hook-form").ControllerProps<import("react-hook-form").FieldValues, string>, "render" | "control"> & import("react").RefAttributes<unknown>> & {
    Trigger: import("react").ForwardRefExoticComponent<Omit<import("tamagui").TextParentStyles, "TextComponent" | "noTextWrap"> & Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    } & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    }, "disabled" | "size" | "unstyled" | "active"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("tamagui").SizeTokens | undefined;
        readonly active?: boolean | undefined;
        readonly disabled?: boolean | undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    } & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    }, "disabled" | "size" | "unstyled" | "active"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("tamagui").SizeTokens | undefined;
        readonly active?: boolean | undefined;
        readonly disabled?: boolean | undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    } & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    }, "disabled" | "size" | "unstyled" | "active"> & {
        readonly unstyled?: boolean | undefined;
        readonly size?: import("tamagui").SizeTokens | undefined;
        readonly active?: boolean | undefined;
        readonly disabled?: boolean | undefined;
    }>> & import("@tamagui/web").ThemeableProps & {
        icon?: JSX.Element | import("react").FunctionComponent<{
            color?: string | undefined;
            size?: number | undefined;
        }> | null | undefined;
        iconAfter?: JSX.Element | import("react").FunctionComponent<{
            color?: string | undefined;
            size?: number | undefined;
        }> | null | undefined;
        scaleIcon?: number | undefined;
        spaceFlex?: number | boolean | undefined;
        scaleSpace?: number | undefined;
        title?: import("react").ReactNode;
        subTitle?: import("react").ReactNode;
        noTextWrap?: boolean | "all" | undefined;
    } & import("react").RefAttributes<import("tamagui").TamaguiElement>>;
    Value: import("react").ForwardRefExoticComponent<((Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size"> & {
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size"> & {
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size"> & {
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    }>> & {
        placeholder?: import("react").ReactNode;
    }) | Omit<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & {
        placeholder?: import("react").ReactNode;
    }, "ref"> | Omit<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    } | ({
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    } | ({
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    } | ({
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & {
        placeholder?: import("react").ReactNode;
    }, "ref"> | Omit<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    } | ({
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    } | ({
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    } | ({
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    } & {
        [x: string]: undefined;
    }), string | number> & {
        [x: string]: undefined;
    }>> & {
        placeholder?: import("react").ReactNode;
    }, "ref">) & import("react").RefAttributes<import("tamagui").TamaguiElement>>;
    Content: ({ children, __scopeSelect, zIndex, ...focusScopeProps }: {
        children?: import("react").ReactNode;
        zIndex?: number | undefined;
    } & {
        __scopeSelect?: import("tamagui").Scope<any>;
    } & import("@tamagui/focus-scope").FocusScopeProps) => JSX.Element | null;
    Viewport: import("react").ForwardRefExoticComponent<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    }, "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    }, "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    }, "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    }>> & {
        size?: import("tamagui").SizeTokens | undefined;
        disableScroll?: boolean | undefined;
    } & import("react").RefAttributes<import("tamagui").TamaguiElement>>;
    Group: import("react").ForwardRefExoticComponent<((Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    }>>) | Omit<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>, "ref">) & import("react").RefAttributes<import("tamagui").TamaguiElement>>;
    Item: import("react").ForwardRefExoticComponent<import("tamagui").SelectItemProps & import("react").RefAttributes<import("tamagui").TamaguiElement>>;
    ItemText: import("react").ForwardRefExoticComponent<((Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size"> & {
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size"> & {
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{}, "size"> & {
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    }>>) | Omit<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").TextProps, "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendsBaseTextProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & Omit<{
        readonly size?: import("tamagui").FontSizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>, "ref">) & import("react").RefAttributes<import("tamagui").TamaguiElement>>;
    ItemIndicator: import("react").ForwardRefExoticComponent<((Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{}, "elevation" | "fullscreen"> & {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    }>>) | Omit<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import("tamagui").SizeTokens | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>>, "ref">) & import("react").RefAttributes<import("tamagui").TamaguiElement>>;
};
//# sourceMappingURL=Select.d.ts.map