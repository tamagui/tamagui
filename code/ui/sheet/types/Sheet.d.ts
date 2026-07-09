export * from './types';
export declare const Handle: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const Overlay: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const Frame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const Sheet: ((props: Omit<{
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: import("react").Dispatch<import("react").SetStateAction<boolean>> | ((open: boolean) => void);
    position?: number;
    defaultPosition?: number;
    snapPoints?: (string | number)[];
    snapPointsMode?: import("./types").SnapPointsMode;
    onPositionChange?: import("./types").PositionChangeHandler;
    children?: import("react").ReactNode;
    dismissOnOverlayPress?: boolean;
    dismissOnSnapToBottom?: boolean;
    disableRemoveScroll?: boolean;
    transitionConfig?: import("@tamagui/core").AnimatedNumberStrategy;
    preferAdaptParentOpenState?: boolean;
    unmountChildrenWhenHidden?: boolean;
    native?: "ios"[] | boolean;
    transition?: import("@tamagui/core").TransitionProp;
    handleDisableScroll?: boolean;
    disableDrag?: boolean;
    modal?: boolean;
    zIndex?: number;
    portalProps?: import("@tamagui/portal").PortalProps;
    moveOnKeyboardChange?: boolean;
    containerComponent?: React.ComponentType<any>;
    onAnimationComplete?: (info: {
        open: boolean;
    }) => void;
}, "scope"> & {
    scope?: import("./types").SheetScopes;
} & import("@tamagui/core").RefProp<import("react-native").View>) => import("react").ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Controlled: import("react").FunctionComponent<Omit<import("./types").SheetProps, "open" | "onOpenChange"> & {
        ref?: import("react").Ref<import("react-native").View>;
    }> & {
        Frame: (props: import("./types").SheetScopedProps<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            unstyled?: boolean | undefined;
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        }>, keyof {
            disableHideBottomOverflow?: boolean;
            adjustPaddingForOffscreenContent?: boolean;
        }> & {
            disableHideBottomOverflow?: boolean;
            adjustPaddingForOffscreenContent?: boolean;
        } & {
            ref?: import("react").Ref<import("react-native").View>;
        }>) => import("react").ReactNode;
        Overlay: import("@tamagui/core").TamaguiComponent<Omit<any, "scope"> & Omit<{}, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, any, any, any, {}, {}>;
        Handle: import("@tamagui/core").TamaguiComponent<any, any, any, any, {}, {}>;
        ScrollView: import("@tamagui/core").RefComponent<import("react-native").ScrollView, import("@tamagui/core").GetFinalProps<import("@tamagui/core").TamaguiComponentPropsBaseBase & import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<typeof import("react-native").ScrollView, {
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }, {}>>;
    };
    Frame: (props: import("./types").SheetScopedProps<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    }>, keyof {
        disableHideBottomOverflow?: boolean;
        adjustPaddingForOffscreenContent?: boolean;
    }> & {
        disableHideBottomOverflow?: boolean;
        adjustPaddingForOffscreenContent?: boolean;
    } & {
        ref?: import("react").Ref<import("react-native").View>;
    }>) => import("react").ReactNode;
    Overlay: import("@tamagui/core").TamaguiComponent<Omit<any, "scope"> & Omit<{}, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, any, any, any, {}, {}>;
    Handle: import("@tamagui/core").TamaguiComponent<any, any, any, any, {}, {}>;
    ScrollView: import("@tamagui/core").RefComponent<import("react-native").ScrollView, import("@tamagui/core").GetFinalProps<import("@tamagui/core").TamaguiComponentPropsBaseBase & import("react-native").ScrollViewProps, import("@tamagui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@tamagui/core").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {}>>;
};
//# sourceMappingURL=Sheet.d.ts.map