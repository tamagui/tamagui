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
export declare const Container: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const Background: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
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
        Container: (props: import("./types").SheetScopedProps<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            unstyled?: boolean | undefined;
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        }>, "adjustPaddingForOffscreenContent"> & {
            adjustPaddingForOffscreenContent?: boolean;
        } & {
            ref?: import("react").Ref<import("react-native").View>;
        }>) => import("react").ReactNode;
        Background: import("@tamagui/core").TamaguiComponent<Omit<any, "theme" | "debug" | "id" | "children" | "scope" | "style" | "hitSlop" | "needsOffscreenAlphaCompositing" | "onLayout" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "onBlur" | "onFocus" | "renderToHardwareTextureAndroid" | "tabIndex" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "role" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "render" | "group" | "untilMeasured" | "componentName" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "elevationAndroid" | "rel" | "download" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "elevation" | keyof import("@tamagui/core").StackStyleBase | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | "disableHideBottomOverflow" | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
            unstyled?: boolean | undefined;
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>>> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "unstyled" | "elevation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
            unstyled?: boolean | undefined;
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
            unstyled?: boolean | undefined;
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
            unstyled?: boolean | undefined;
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        }>> & {
            disableHideBottomOverflow?: boolean;
        }, "scope"> & {
            scope?: import("./types").SheetScopes;
        }, any, any, any, {}, {}>;
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
    Container: (props: import("./types").SheetScopedProps<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    }>, "adjustPaddingForOffscreenContent"> & {
        adjustPaddingForOffscreenContent?: boolean;
    } & {
        ref?: import("react").Ref<import("react-native").View>;
    }>) => import("react").ReactNode;
    Background: import("@tamagui/core").TamaguiComponent<Omit<any, "theme" | "debug" | "id" | "children" | "scope" | "style" | "hitSlop" | "needsOffscreenAlphaCompositing" | "onLayout" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "onBlur" | "onFocus" | "renderToHardwareTextureAndroid" | "tabIndex" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "role" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "render" | "group" | "untilMeasured" | "componentName" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "elevationAndroid" | "rel" | "download" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "elevation" | keyof import("@tamagui/core").StackStyleBase | "$native" | "$web" | "$ios" | "$android" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | "disableHideBottomOverflow" | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>>> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "unstyled" | "elevation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    }>> & {
        disableHideBottomOverflow?: boolean;
    }, "scope"> & {
        scope?: import("./types").SheetScopes;
    }, any, any, any, {}, {}>;
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