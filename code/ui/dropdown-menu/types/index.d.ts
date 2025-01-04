import '@tamagui/polyfill-dev';
export declare const DropdownMenu: ({
    (props: import("./createNonNativeDropdownMenu").DropdownMenuProps & {
        __scopeDropdownMenu?: string;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
} | {
    (props: import("./createNonNativeDropdownMenu").DropdownMenuProps & {
        __scopeDropdownMenu?: string;
    } & import("@tamagui/menu/types/createNativeMenu/createNativeMenuTypes").MenuProps & {
        native?: boolean;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}) & {
    readonly Trigger: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof import("./createNonNativeDropdownMenu").DropdownMenuTriggerProps | "__scopeDropdownMenu"> & import("./createNonNativeDropdownMenu").DropdownMenuTriggerProps & {
        __scopeDropdownMenu?: string;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("./createNonNativeDropdownMenu").DropdownMenuTriggerProps & {
        __scopeDropdownMenu?: string;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic> | {
        (props: Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("tamagui").SizeTokens | undefined;
            inset?: number | import("tamagui").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | null | undefined;
            fullscreen?: boolean | undefined;
        }>, keyof import("./createNonNativeDropdownMenu").DropdownMenuTriggerProps | "__scopeDropdownMenu"> & import("./createNonNativeDropdownMenu").DropdownMenuTriggerProps & {
            __scopeDropdownMenu?: string;
        } & import("react").RefAttributes<import("tamagui").TamaguiElement> & import("@tamagui/menu/types/createNativeMenu/createNativeMenuTypes").MenuTriggerProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly Portal: {
        (props: import("./createNonNativeDropdownMenu").DropdownMenuPortalProps & {
            __scopeDropdownMenu?: string;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    } | {
        (props: import("./createNonNativeDropdownMenu").DropdownMenuPortalProps & {
            __scopeDropdownMenu?: string;
        } & {
            children?: import("react").ReactNode | undefined;
        } & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly Content: import("react").ForwardRefExoticComponent<import("./createNonNativeDropdownMenu").DropdownMenuContentProps & {
        __scopeDropdownMenu?: string;
    } & import("react").RefAttributes<HTMLElement | import("react-native").View>> | {
        (props: import("./createNonNativeDropdownMenu").DropdownMenuContentProps & {
            __scopeDropdownMenu?: string;
        } & import("react").RefAttributes<HTMLElement | import("react-native").View> & import("@tamagui/menu/types/createNativeMenu/createNativeMenuTypes").MenuContentProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly Group: import("tamagui").TamaguiComponent | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly Label: import("tamagui").TamaguiComponent | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly Item: import("tamagui").TamaguiComponent<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "__scopeMenu" | keyof import("@tamagui/menu").MenuItemProps> & import("@tamagui/menu").MenuItemProps & {
        __scopeMenu?: string;
    }, "__scopeDropdownMenu" | keyof import("./createNonNativeDropdownMenu").DropdownMenuItemProps> & import("./createNonNativeDropdownMenu").DropdownMenuItemProps & {
        __scopeDropdownMenu?: string;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/menu").MenuItemProps & {
        __scopeMenu?: string;
    } & import("./createNonNativeDropdownMenu").DropdownMenuItemProps & {
        __scopeDropdownMenu?: string;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> | {
        (props: Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("tamagui").SizeTokens | undefined;
            transparent?: boolean | undefined;
            fullscreen?: boolean | undefined;
            circular?: boolean | undefined;
            inset?: number | import("tamagui").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            backgrounded?: boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }>, "__scopeMenu" | keyof import("@tamagui/menu").MenuItemProps> & import("@tamagui/menu").MenuItemProps & {
            __scopeMenu?: string;
        }, "__scopeDropdownMenu" | keyof import("./createNonNativeDropdownMenu").DropdownMenuItemProps> & import("./createNonNativeDropdownMenu").DropdownMenuItemProps & {
            __scopeDropdownMenu?: string;
        } & import("react").RefAttributes<import("tamagui").TamaguiElement> & {
            children: React.ReactNode;
            textValue?: string;
        } & {
            disabled?: boolean;
            hidden?: boolean;
            destructive?: boolean;
            key: string;
        } & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly CheckboxItem: import("tamagui").TamaguiComponent<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "__scopeMenu" | keyof import("@tamagui/menu").MenuCheckboxItemProps> & import("@tamagui/menu").MenuCheckboxItemProps & {
        __scopeMenu?: string;
    }, "__scopeDropdownMenu" | keyof import("./createNonNativeDropdownMenu").DropdownMenuCheckboxItemProps> & import("./createNonNativeDropdownMenu").DropdownMenuCheckboxItemProps & {
        __scopeDropdownMenu?: string;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/menu").MenuCheckboxItemProps & {
        __scopeMenu?: string;
    } & import("./createNonNativeDropdownMenu").DropdownMenuCheckboxItemProps & {
        __scopeDropdownMenu?: string;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> | {
        (props: Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("tamagui").SizeTokens | undefined;
            transparent?: boolean | undefined;
            fullscreen?: boolean | undefined;
            circular?: boolean | undefined;
            inset?: number | import("tamagui").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            backgrounded?: boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }>, "__scopeMenu" | keyof import("@tamagui/menu").MenuCheckboxItemProps> & import("@tamagui/menu").MenuCheckboxItemProps & {
            __scopeMenu?: string;
        }, "__scopeDropdownMenu" | keyof import("./createNonNativeDropdownMenu").DropdownMenuCheckboxItemProps> & import("./createNonNativeDropdownMenu").DropdownMenuCheckboxItemProps & {
            __scopeDropdownMenu?: string;
        } & import("react").RefAttributes<import("tamagui").TamaguiElement> & Omit<import("@tamagui/menu/types/createNativeMenu/createNativeMenuTypes").MenuItemProps, "onSelect"> & {
            value: "mixed" | "on" | "off" | boolean;
            onValueChange?: (state: "mixed" | "on" | "off", prevState: "mixed" | "on" | "off") => void;
            key: string;
        } & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly RadioGroup: import("react").ForwardRefExoticComponent<Omit<import("./createNonNativeDropdownMenu").DropdownMenuRadioGroupProps & {
        __scopeDropdownMenu?: string;
    }, "ref"> & import("react").RefAttributes<any>> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly RadioItem: import("tamagui").TamaguiComponent<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "__scopeMenu" | keyof import("@tamagui/menu").MenuRadioItemProps> & import("@tamagui/menu").MenuRadioItemProps & {
        __scopeMenu?: string;
    }, "__scopeDropdownMenu" | keyof import("./createNonNativeDropdownMenu").DropdownMenuRadioItemProps> & import("./createNonNativeDropdownMenu").DropdownMenuRadioItemProps & {
        __scopeDropdownMenu?: string;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/menu").MenuRadioItemProps & {
        __scopeMenu?: string;
    } & import("./createNonNativeDropdownMenu").DropdownMenuRadioItemProps & {
        __scopeDropdownMenu?: string;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly ItemIndicator: import("tamagui").TamaguiComponent<Omit<Omit<any, "__scopeMenu" | keyof import("@tamagui/menu").MenuItemIndicatorProps> & import("@tamagui/menu").MenuItemIndicatorProps & {
        __scopeMenu?: string;
    }, keyof import("./createNonNativeDropdownMenu").DropdownMenuItemIndicatorProps> & import("./createNonNativeDropdownMenu").DropdownMenuItemIndicatorProps & {
        __scopeDropdownMenu?: string;
    }, any, import("@tamagui/menu").MenuItemIndicatorProps & {
        __scopeMenu?: string;
    } & import("./createNonNativeDropdownMenu").DropdownMenuItemIndicatorProps & {
        __scopeDropdownMenu?: string;
    }, {}, {}, {}> | {
        (props: Omit<Omit<any, "__scopeMenu" | keyof import("@tamagui/menu").MenuItemIndicatorProps> & import("@tamagui/menu").MenuItemIndicatorProps & {
            __scopeMenu?: string;
        }, keyof import("./createNonNativeDropdownMenu").DropdownMenuItemIndicatorProps> & import("./createNonNativeDropdownMenu").DropdownMenuItemIndicatorProps & {
            __scopeDropdownMenu?: string;
        } & import("react").RefAttributes<any> & import("@tamagui/menu/types/createNativeMenu/createNativeMenuTypes").MenuItemIndicatorProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly Separator: import("tamagui").TamaguiComponent | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly Arrow: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/menu").MenuArrowProps & {
        __scopeMenu?: string;
    } & import("react").RefAttributes<import("tamagui").TamaguiElement>, "ref"> & {
        __scopeDropdownMenu?: string;
    } & import("react").RefAttributes<import("tamagui").TamaguiElement>> | {
        (props: Omit<import("@tamagui/menu").MenuArrowProps & {
            __scopeMenu?: string;
        } & import("react").RefAttributes<import("tamagui").TamaguiElement>, "ref"> & {
            __scopeDropdownMenu?: string;
        } & import("react").RefAttributes<import("tamagui").TamaguiElement> & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly Sub: {
        (props: import("./createNonNativeDropdownMenu").DropdownMenuSubProps & {
            __scopeDropdownMenu?: string;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    } | {
        (props: import("./createNonNativeDropdownMenu").DropdownMenuSubProps & {
            __scopeDropdownMenu?: string;
        } & import("@tamagui/menu/types/createNativeMenu/createNativeMenuTypes").MenuSubProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly SubTrigger: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }>, "__scopeDropdownMenu" | keyof import("./createNonNativeDropdownMenu").DropdownMenuSubTriggerProps> & import("./createNonNativeDropdownMenu").DropdownMenuSubTriggerProps & {
        __scopeDropdownMenu?: string;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("./createNonNativeDropdownMenu").DropdownMenuSubTriggerProps & {
        __scopeDropdownMenu?: string;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic> | {
        (props: Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("tamagui").SizeTokens | undefined;
            inset?: number | import("tamagui").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | null | undefined;
            fullscreen?: boolean | undefined;
        }>, "__scopeDropdownMenu" | keyof import("./createNonNativeDropdownMenu").DropdownMenuSubTriggerProps> & import("./createNonNativeDropdownMenu").DropdownMenuSubTriggerProps & {
            __scopeDropdownMenu?: string;
        } & import("react").RefAttributes<import("tamagui").TamaguiElement> & {
            children: React.ReactNode;
            textValue?: string;
        } & {
            disabled?: boolean;
            hidden?: boolean;
            destructive?: boolean;
            key: string;
        } & {
            key: string;
        } & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly SubContent: import("react").ForwardRefExoticComponent<import("./createNonNativeDropdownMenu").DropdownMenuSubContentProps & {
        __scopeDropdownMenu?: string;
    } & import("react").RefAttributes<HTMLElement | import("react-native").View>> | {
        (props: import("./createNonNativeDropdownMenu").DropdownMenuSubContentProps & {
            __scopeDropdownMenu?: string;
        } & import("react").RefAttributes<HTMLElement | import("react-native").View> & import("@tamagui/menu/types/createNativeMenu/createNativeMenuTypes").MenuSubContentProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly ItemTitle: import("tamagui").TamaguiComponent<any, any, {} & void, {}, {}, {}> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly ItemSubtitle: import("tamagui").TamaguiComponent<any, any, {} & void, {}, {}, {}> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly ItemIcon: import("tamagui").TamaguiComponent<any, any, {} & void, {}, {}, {}> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    readonly ItemImage: import("react").ForwardRefExoticComponent<import("react-native").ImageProps & import("react").RefAttributes<import("react-native").Image>> | {
        (props: import("react-native").ImageProps & import("react").RefAttributes<import("react-native").Image> & import("@tamagui/menu/types/createNativeMenu/createNativeMenuTypes").MenuItemCommonProps & {
            source: import("react-native").ImageProps["source"];
            ios?: {
                style?: ImageOptions;
                lazy?: boolean;
            };
        } & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
};
//# sourceMappingURL=index.d.ts.map