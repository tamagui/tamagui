export declare const DialogOverlay: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/ui").DialogScopes;
}, "elevation" | keyof import("@tamagui/web").StackStyleBase | "open"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    open?: boolean | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    open?: boolean | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    open?: boolean | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
}>> & {
    ref?: import("react").Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/ui").DialogScopes;
}, import("@tamagui/web").StackStyleBase, {
    open?: boolean | undefined;
    elevation?: number | import("@tamagui/web").Size | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const DialogContent: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "transparent" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | import("@tamagui/web").Size | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | import("@tamagui/web").Size | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("@tamagui/web").Size | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
    trapFocus?: import("@tamagui/focus-scope").FocusScopeProps["trapped"];
    onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onMountAutoFocus"];
    onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onUnmountAutoFocus"];
    context: {
        forceMount?: boolean;
        keepChildrenMounted?: boolean;
        disableRemoveScroll?: boolean;
        hasPresentParts: boolean;
        setPartPresence(id: string, present: boolean): void;
        triggerRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
        contentRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
        contentId: string;
        titleId: string;
        descriptionId: string;
        onOpenToggle(): void;
        open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
        onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
        modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
        dialogScope: import("@tamagui/ui").DialogScopes;
        adaptScope: string;
        onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
    };
    onTransition?: import("@tamagui/web").OnTransition;
} & {
    context: {
        forceMount?: boolean;
        keepChildrenMounted?: boolean;
        disableRemoveScroll?: boolean;
        hasPresentParts: boolean;
        setPartPresence(id: string, present: boolean): void;
        triggerRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
        contentRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
        contentId: string;
        titleId: string;
        descriptionId: string;
        onOpenToggle(): void;
        open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
        onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
        modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
        dialogScope: import("@tamagui/ui").DialogScopes;
        adaptScope: string;
        onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
    };
}, "onPointerDownCapture" | "context"> & {
    scope?: import("@tamagui/ui").DialogScopes;
}, "elevation" | keyof import("@tamagui/web").StackStyleBase | "transparent" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | import("@tamagui/web").Size | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | import("@tamagui/web").Size | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("@tamagui/web").Size | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & {
    ref?: import("react").Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "transparent" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | import("@tamagui/web").Size | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | import("@tamagui/web").Size | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("@tamagui/web").Size | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
    trapFocus?: import("@tamagui/focus-scope").FocusScopeProps["trapped"];
    onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onMountAutoFocus"];
    onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onUnmountAutoFocus"];
    context: {
        forceMount?: boolean;
        keepChildrenMounted?: boolean;
        disableRemoveScroll?: boolean;
        hasPresentParts: boolean;
        setPartPresence(id: string, present: boolean): void;
        triggerRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
        contentRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
        contentId: string;
        titleId: string;
        descriptionId: string;
        onOpenToggle(): void;
        open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
        onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
        modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
        dialogScope: import("@tamagui/ui").DialogScopes;
        adaptScope: string;
        onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
    };
    onTransition?: import("@tamagui/web").OnTransition;
} & {
    context: {
        forceMount?: boolean;
        keepChildrenMounted?: boolean;
        disableRemoveScroll?: boolean;
        hasPresentParts: boolean;
        setPartPresence(id: string, present: boolean): void;
        triggerRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
        contentRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
        contentId: string;
        titleId: string;
        descriptionId: string;
        onOpenToggle(): void;
        open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
        onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
        modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
        dialogScope: import("@tamagui/ui").DialogScopes;
        adaptScope: string;
        onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
    };
}, "onPointerDownCapture" | "context"> & {
    scope?: import("@tamagui/ui").DialogScopes;
}, import("@tamagui/web").StackStyleBase, {
    elevation?: number | import("@tamagui/web").Size | undefined;
    transparent?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "transparent" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
        trapFocus?: import("@tamagui/focus-scope").FocusScopeProps["trapped"];
        onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onMountAutoFocus"];
        onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onUnmountAutoFocus"];
        context: {
            forceMount?: boolean;
            keepChildrenMounted?: boolean;
            disableRemoveScroll?: boolean;
            hasPresentParts: boolean;
            setPartPresence(id: string, present: boolean): void;
            triggerRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentId: string;
            titleId: string;
            descriptionId: string;
            onOpenToggle(): void;
            open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
        };
        onTransition?: import("@tamagui/web").OnTransition;
    } & {
        context: {
            forceMount?: boolean;
            keepChildrenMounted?: boolean;
            disableRemoveScroll?: boolean;
            hasPresentParts: boolean;
            setPartPresence(id: string, present: boolean): void;
            triggerRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentId: string;
            titleId: string;
            descriptionId: string;
            onOpenToggle(): void;
            open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
        };
    }, "onPointerDownCapture" | "context"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const Dialog: ((props: {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    keepChildrenMounted?: boolean;
    onOpenChange?(open: boolean): void;
    modal?: boolean;
    disableRemoveScroll?: boolean;
    onAnimationComplete?: (info: {
        open: boolean;
    }) => void;
} & {
    scope?: import("@tamagui/ui").DialogScopes;
} & import("@tamagui/ui").RefProp<import("@tamagui/ui").TamaguiElement>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Trigger: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, "scope"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
    Portal: import("@tamagui/ui").RefComponent<import("@tamagui/ui").TamaguiElement, import("@tamagui/ui").DialogPortalProps>;
    Overlay: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    }>, "scope" | "forceMount"> & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Content: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "theme" | "debug" | "style" | "children" | "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/web").GroupMediaKeys | "elevation" | keyof import("@tamagui/web").StackStyleBase | "render" | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "id" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onStartShouldSetResponder" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "elevationAndroid" | "rel" | "download" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMoveCapture" | "onPointerCancelCapture" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "transparent" | "scope" | "circular" | "elevate" | "bordered" | "chromeless" | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> | "disableOutsidePointerEvents" | "branches" | "onEscapeKeyDown" | "onPointerDownOutside" | "onFocusOutside" | "onInteractOutside" | "forceUnmount" | "onBlurCapture" | "onFocusCapture" | "trapFocus" | "onOpenAutoFocus" | "onCloseAutoFocus"> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "transparent" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
        trapFocus?: import("@tamagui/focus-scope").FocusScopeProps["trapped"];
        onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onMountAutoFocus"];
        onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onUnmountAutoFocus"];
        context: {
            forceMount?: boolean;
            keepChildrenMounted?: boolean;
            disableRemoveScroll?: boolean;
            hasPresentParts: boolean;
            setPartPresence(id: string, present: boolean): void;
            triggerRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentId: string;
            titleId: string;
            descriptionId: string;
            onOpenToggle(): void;
            open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
        };
        onTransition?: import("@tamagui/web").OnTransition;
    } & {
        context: {
            forceMount?: boolean;
            keepChildrenMounted?: boolean;
            disableRemoveScroll?: boolean;
            hasPresentParts: boolean;
            setPartPresence(id: string, present: boolean): void;
            triggerRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentId: string;
            titleId: string;
            descriptionId: string;
            onOpenToggle(): void;
            open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
        };
    }, "context" | "onPointerDownCapture"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "transparent" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
        trapFocus?: import("@tamagui/focus-scope").FocusScopeProps["trapped"];
        onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onMountAutoFocus"];
        onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onUnmountAutoFocus"];
        context: {
            forceMount?: boolean;
            keepChildrenMounted?: boolean;
            disableRemoveScroll?: boolean;
            hasPresentParts: boolean;
            setPartPresence(id: string, present: boolean): void;
            triggerRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentId: string;
            titleId: string;
            descriptionId: string;
            onOpenToggle(): void;
            open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
        };
        onTransition?: import("@tamagui/web").OnTransition;
    } & {
        context: {
            forceMount?: boolean;
            keepChildrenMounted?: boolean;
            disableRemoveScroll?: boolean;
            hasPresentParts: boolean;
            setPartPresence(id: string, present: boolean): void;
            triggerRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentId: string;
            titleId: string;
            descriptionId: string;
            onOpenToggle(): void;
            open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
        };
    }, "context" | "onPointerDownCapture"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Title: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
    }>, "scope"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").Text, import("@tamagui/ui").TextNonStyleProps & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Description: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/ui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
    }>, "scope"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").Text, import("@tamagui/ui").TextNonStyleProps & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Close: import("@tamagui/ui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}>, "scope" | "displayWhenAdapted"> & {
        displayWhenAdapted?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        displayWhenAdapted?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => import("react/jsx-runtime").JSX.Element;
    Adapt: ((props: import("@tamagui/ui").AdaptProps) => import("react/jsx-runtime").JSX.Element) & {
        Contents: {
            ({ scope, ...rest }: {
                scope?: string;
            }): React.FunctionComponentElement<any>;
            shouldForwardSpace: boolean;
        };
    };
} & {
    Overlay: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, "elevation" | keyof import("@tamagui/web").StackStyleBase | "open"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    }>> & {
        ref?: import("react").Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/web").Size | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
            forceMount?: boolean;
        } & {
            scope?: import("@tamagui/ui").DialogScopes;
        }, import("@tamagui/web").StackStyleBase, {
            open?: boolean | undefined;
            elevation?: number | import("@tamagui/web").Size | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Content: import("react").FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "transparent" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
        trapFocus?: import("@tamagui/focus-scope").FocusScopeProps["trapped"];
        onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onMountAutoFocus"];
        onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onUnmountAutoFocus"];
        context: {
            forceMount?: boolean;
            keepChildrenMounted?: boolean;
            disableRemoveScroll?: boolean;
            hasPresentParts: boolean;
            setPartPresence(id: string, present: boolean): void;
            triggerRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentId: string;
            titleId: string;
            descriptionId: string;
            onOpenToggle(): void;
            open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
        };
        onTransition?: import("@tamagui/web").OnTransition;
    } & {
        context: {
            forceMount?: boolean;
            keepChildrenMounted?: boolean;
            disableRemoveScroll?: boolean;
            hasPresentParts: boolean;
            setPartPresence(id: string, present: boolean): void;
            triggerRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentId: string;
            titleId: string;
            descriptionId: string;
            onOpenToggle(): void;
            open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
        };
    }, "onPointerDownCapture" | "context"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, "elevation" | keyof import("@tamagui/web").StackStyleBase | "transparent" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & {
        ref?: import("react").Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "transparent" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
        trapFocus?: import("@tamagui/focus-scope").FocusScopeProps["trapped"];
        onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onMountAutoFocus"];
        onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onUnmountAutoFocus"];
        context: {
            forceMount?: boolean;
            keepChildrenMounted?: boolean;
            disableRemoveScroll?: boolean;
            hasPresentParts: boolean;
            setPartPresence(id: string, present: boolean): void;
            triggerRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentId: string;
            titleId: string;
            descriptionId: string;
            onOpenToggle(): void;
            open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
        };
        onTransition?: import("@tamagui/web").OnTransition;
    } & {
        context: {
            forceMount?: boolean;
            keepChildrenMounted?: boolean;
            disableRemoveScroll?: boolean;
            hasPresentParts: boolean;
            setPartPresence(id: string, present: boolean): void;
            triggerRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
            contentId: string;
            titleId: string;
            descriptionId: string;
            onOpenToggle(): void;
            open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
            onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
            modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
            dialogScope: import("@tamagui/ui").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
        };
    }, "onPointerDownCapture" | "context"> & {
        scope?: import("@tamagui/ui").DialogScopes;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").Size | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "transparent" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
            elevation?: number | import("@tamagui/web").Size | undefined;
            transparent?: boolean | undefined;
            circular?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
            elevation?: number | import("@tamagui/web").Size | undefined;
            transparent?: boolean | undefined;
            circular?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("@tamagui/web").Size | undefined;
            transparent?: boolean | undefined;
            circular?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }>> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
            trapFocus?: import("@tamagui/focus-scope").FocusScopeProps["trapped"];
            onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onMountAutoFocus"];
            onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps["onUnmountAutoFocus"];
            context: {
                forceMount?: boolean;
                keepChildrenMounted?: boolean;
                disableRemoveScroll?: boolean;
                hasPresentParts: boolean;
                setPartPresence(id: string, present: boolean): void;
                triggerRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
                contentRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
                contentId: string;
                titleId: string;
                descriptionId: string;
                onOpenToggle(): void;
                open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
                onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
                modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
                dialogScope: import("@tamagui/ui").DialogScopes;
                adaptScope: string;
                onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
            };
            onTransition?: import("@tamagui/web").OnTransition;
        } & {
            context: {
                forceMount?: boolean;
                keepChildrenMounted?: boolean;
                disableRemoveScroll?: boolean;
                hasPresentParts: boolean;
                setPartPresence(id: string, present: boolean): void;
                triggerRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
                contentRef: React.RefObject<import("@tamagui/ui").TamaguiElement | null>;
                contentId: string;
                titleId: string;
                descriptionId: string;
                onOpenToggle(): void;
                open: Exclude<import("@tamagui/ui").DialogProps["open"], void | null>;
                onOpenChange: Exclude<import("@tamagui/ui").DialogProps["onOpenChange"], void | null>;
                modal: Exclude<import("@tamagui/ui").DialogProps["modal"], void | null>;
                dialogScope: import("@tamagui/ui").DialogScopes;
                adaptScope: string;
                onAnimationComplete?: import("@tamagui/ui").DialogProps["onAnimationComplete"];
            };
        }, "onPointerDownCapture" | "context"> & {
            scope?: import("@tamagui/ui").DialogScopes;
        }, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("@tamagui/web").Size | undefined;
            transparent?: boolean | undefined;
            circular?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
};
//# sourceMappingURL=Dialog.d.ts.map