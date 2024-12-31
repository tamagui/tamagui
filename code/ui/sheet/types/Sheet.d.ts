export { createSheetScope } from './SheetContext';
export * from './types';
export declare const Handle: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const Overlay: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
    open?: boolean | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
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
}, import("@tamagui/core").StaticConfigPublic>;
export declare const Frame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const Sheet: import("react").ForwardRefExoticComponent<{
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: ((open: boolean) => void) | import("react").Dispatch<import("react").SetStateAction<boolean>>;
    position?: number;
    defaultPosition?: number;
    snapPoints?: (string | number)[];
    snapPointsMode?: import("./types").SnapPointsMode;
    onPositionChange?: import("./types").PositionChangeHandler;
    children?: import("react").ReactNode;
    dismissOnOverlayPress?: boolean;
    dismissOnSnapToBottom?: boolean;
    forceRemoveScrollEnabled?: boolean;
    animationConfig?: import("@tamagui/core").AnimatedNumberStrategy;
    unmountChildrenWhenHidden?: boolean;
    native?: "ios"[] | boolean;
    animation?: import("@tamagui/core").AnimationProp;
    handleDisableScroll?: boolean;
    disableDrag?: boolean;
    modal?: boolean;
    zIndex?: number;
    portalProps?: import("@tamagui/portal").PortalProps;
    moveOnKeyboardChange?: boolean;
    containerComponent?: React.ComponentType<any>;
} & {
    __scopeSheet?: import("@tamagui/create-context").Scope<any>;
} & import("react").RefAttributes<import("react-native").View>> & {
    Controlled: import("react").FunctionComponent<Omit<import("./types").SheetProps, "open" | "onOpenChange"> & import("react").RefAttributes<import("react-native").View>> & {
        Frame: import("react").ForwardRefExoticComponent<import("./types").SheetScopedProps<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
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
        Overlay: import("react").MemoExoticComponent<(propsIn: import("./types").SheetScopedProps<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            inset?: number | import("@tamagui/core").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | null | undefined;
            fullscreen?: boolean | undefined;
            open?: boolean | undefined;
            transparent?: boolean | undefined;
            circular?: boolean | undefined;
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
    Frame: import("react").ForwardRefExoticComponent<import("./types").SheetScopedProps<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
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
    Overlay: import("react").MemoExoticComponent<(propsIn: import("./types").SheetScopedProps<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
        open?: boolean | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
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
/** @deprecated use Overlay instead  */
export declare const SheetOverlayFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
    open?: boolean | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
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
}, import("@tamagui/core").StaticConfigPublic>;
/** @deprecated use Overlay instead  */
export declare const SheetHandleFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    inset?: number | import("@tamagui/core").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
//# sourceMappingURL=Sheet.d.ts.map