import type { GetProps, OnTransition, TamaguiElement, ViewProps } from '@tamagui/core';
import type { DismissableProps } from '@tamagui/dismissable';
import type { FocusScopeProps } from '@tamagui/focus-scope';
import type { YStackProps } from '@tamagui/stacks';
import * as React from 'react';
export type DialogScopes = string;
type ScopedProps<P> = P & {
    scope?: DialogScopes;
};
type DialogProps = ScopedProps<{
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    /**
     * When true, children never un-mount, otherwise they mount on open.
     *
     * @default false
     */
    keepChildrenMounted?: boolean;
    onOpenChange?(open: boolean): void;
    modal?: boolean;
    /**
     * Used to disable the remove scroll functionality when open
     */
    disableRemoveScroll?: boolean;
    /**
     * Called when the dialog open/close animation completes.
     */
    onAnimationComplete?: (info: {
        open: boolean;
    }) => void;
}>;
type DialogContextValue = {
    forceMount?: boolean;
    keepChildrenMounted?: boolean;
    disableRemoveScroll?: boolean;
    hasPresentParts: boolean;
    setPartPresence(id: string, present: boolean): void;
    triggerRef: React.RefObject<TamaguiElement | null>;
    contentRef: React.RefObject<TamaguiElement | null>;
    contentId: string;
    titleId: string;
    descriptionId: string;
    onOpenToggle(): void;
    open: Exclude<DialogProps['open'], void | null>;
    onOpenChange: Exclude<DialogProps['onOpenChange'], void | null>;
    modal: Exclude<DialogProps['modal'], void | null>;
    dialogScope: DialogScopes;
    adaptScope: string;
    onAnimationComplete?: DialogProps['onAnimationComplete'];
};
export declare const DialogContext: import("@tamagui/core").StyledContext<DialogContextValue, never>;
export declare const useDialogContext: (scope?: string) => DialogContextValue, DialogProvider: React.Provider<DialogContextValue> & React.ProviderExoticComponent<Partial<DialogContextValue> & {
    children?: React.ReactNode;
    scope?: string;
}>;
type DialogTriggerProps = ScopedProps<ViewProps>;
declare const DialogTrigger: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope"> & {
    scope?: DialogScopes;
}, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
    scope?: DialogScopes;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
type DialogPortalProps = ScopedProps<YStackProps & {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
}>;
export declare const DialogPortalFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | import("@tamagui/core").Size | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | import("@tamagui/core").Size | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
}>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
declare const DialogPortal: import("@tamagui/compose-refs").RefComponent<TamaguiElement, DialogPortalProps>;
export declare const DialogOverlayFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | "open" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | import("@tamagui/core").Size | undefined;
    open?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | import("@tamagui/core").Size | undefined;
    open?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
    open?: boolean | undefined;
}>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
    open?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
        open?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
export type DialogOverlayExtraProps = ScopedProps<{
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
}>;
type DialogOverlayProps = YStackProps & DialogOverlayExtraProps;
declare const DialogOverlay: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
    open?: boolean | undefined;
}>, "forceMount" | "scope"> & {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
} & {
    scope?: DialogScopes;
}, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
} & {
    scope?: DialogScopes;
}, import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").Size | undefined;
    open?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
declare const DialogContentFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate" | "elevation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
}>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
type DialogContentFrameProps = GetProps<typeof DialogContentFrame>;
type DialogContentExtraProps = ScopedProps<Omit<DialogContentTypeProps, 'context' | 'onPointerDownCapture'>>;
type DialogContentProps = DialogContentFrameProps & DialogContentExtraProps;
declare const DialogContent: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
}>, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "bordered" | "branches" | "children" | "className" | "collapsable" | "collapsableChildren" | "componentName" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableOptimization" | "disableOutsidePointerEvents" | "disabled" | "download" | "elevate" | "elevation" | "elevationAndroid" | "forceStyle" | "forceUnmount" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "isTVSelectable" | "nativeID" | "needsOffscreenAlphaCompositing" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onBlurCapture" | "onChange" | "onClick" | "onCloseAutoFocus" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onEscapeKeyDown" | "onFocus" | "onFocusCapture" | "onFocusOutside" | "onInput" | "onInteractOutside" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onOpenAutoFocus" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownOutside" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchStart" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "scope" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "trapFocus" | "tvParallaxMagnification" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "untilMeasured" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>>> & Omit<DialogContentTypeProps, "context" | "onPointerDownCapture"> & {
    scope?: DialogScopes;
}, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogContentTypeProps, "context" | "onPointerDownCapture"> & {
    scope?: DialogScopes;
}, import("@tamagui/core").StackStyleBase, {
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
    elevation?: number | import("@tamagui/core").Size | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type DialogContentTypeProps = DialogContentImplProps & {
    context: DialogContextValue;
};
type DialogContentImplExtraProps = Omit<DismissableProps, 'onDismiss'> & {
    /**
     * When `true`, focus cannot escape the `Content` via keyboard,
     * pointer, or a programmatic focus.
     * @defaultValue false
     */
    trapFocus?: FocusScopeProps['trapped'];
    /**
     * Event handler called when auto-focusing on open.
     * Can be canceled.
     */
    onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'];
    /**
     * Event handler called when auto-focusing on close.
     * Can be canceled.
     */
    onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'];
    context: DialogContextValue;
    onTransition?: OnTransition;
};
type DialogContentImplProps = DialogContentFrameProps & DialogContentImplExtraProps;
declare const DialogTitleFrame: React.FunctionComponent<Omit<import("@tamagui/core").TextNonStyleProps, "size" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
    size?: import("@tamagui/core").FontSize | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
    size?: import("@tamagui/core").FontSize | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSize | undefined;
}>> & {
    ref?: React.Ref<import("@tamagui/core").TamaguiTextElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSize | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/core").FontSize | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
type DialogTitleExtraProps = ScopedProps<{}>;
type DialogTitleProps = DialogTitleExtraProps & GetProps<typeof DialogTitleFrame>;
declare const DialogTitle: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSize | undefined;
}>, "scope"> & {
    scope?: DialogScopes;
}, import("react-native").Text | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").TextNonStyleProps & {
    scope?: DialogScopes;
}, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSize | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
declare const DialogDescriptionFrame: React.FunctionComponent<Omit<import("@tamagui/core").TextNonStyleProps, "size" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
    size?: import("@tamagui/core").FontSize | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
    size?: import("@tamagui/core").FontSize | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSize | undefined;
}>> & {
    ref?: React.Ref<import("@tamagui/core").TamaguiTextElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSize | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/core").FontSize | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
};
type DialogDescriptionExtraProps = ScopedProps<{}>;
type DialogDescriptionProps = DialogDescriptionExtraProps & GetProps<typeof DialogDescriptionFrame>;
declare const DialogDescription: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSize | undefined;
}>, "scope"> & {
    scope?: DialogScopes;
}, import("react-native").Text | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").TextNonStyleProps & {
    scope?: DialogScopes;
}, import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSize | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
declare const DialogCloseFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic];
};
export type DialogCloseExtraProps = ScopedProps<{
    displayWhenAdapted?: boolean;
}>;
type DialogCloseProps = GetProps<typeof DialogCloseFrame> & DialogCloseExtraProps;
declare const DialogClose: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "displayWhenAdapted" | "scope"> & {
    displayWhenAdapted?: boolean;
} & {
    scope?: DialogScopes;
}, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
    displayWhenAdapted?: boolean;
} & {
    scope?: DialogScopes;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
declare const DialogWarningProvider: (props: {
    contentName: string;
    titleName: string;
    docsSlug: string;
} & {
    children: React.ReactNode;
}) => React.JSX.Element;
declare const Dialog: ((props: {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    /**
     * When true, children never un-mount, otherwise they mount on open.
     *
     * @default false
     */
    keepChildrenMounted?: boolean;
    onOpenChange?(open: boolean): void;
    modal?: boolean;
    /**
     * Used to disable the remove scroll functionality when open
     */
    disableRemoveScroll?: boolean;
    /**
     * Called when the dialog open/close animation completes.
     */
    onAnimationComplete?: (info: {
        open: boolean;
    }) => void;
} & {
    scope?: DialogScopes;
} & import("@tamagui/compose-refs").RefProp<TamaguiElement>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Trigger: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope"> & {
        scope?: DialogScopes;
    }, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        scope?: DialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Portal: import("@tamagui/compose-refs").RefComponent<TamaguiElement, DialogPortalProps>;
    Overlay: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
        open?: boolean | undefined;
    }>, "forceMount" | "scope"> & {
        /**
         * Used to force mounting when more control is needed. Useful when
         * controlling animation with React animation libraries.
         */
        forceMount?: boolean;
    } & {
        scope?: DialogScopes;
    }, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        /**
         * Used to force mounting when more control is needed. Useful when
         * controlling animation with React animation libraries.
         */
        forceMount?: boolean;
    } & {
        scope?: DialogScopes;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
        open?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Content: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
    }>, "$android" | "$androidtv" | "$ios" | "$native" | "$tv" | "$tvos" | "$web" | "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "bordered" | "branches" | "children" | "className" | "collapsable" | "collapsableChildren" | "componentName" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableOptimization" | "disableOutsidePointerEvents" | "disabled" | "download" | "elevate" | "elevation" | "elevationAndroid" | "forceStyle" | "forceUnmount" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "isTVSelectable" | "nativeID" | "needsOffscreenAlphaCompositing" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onBlurCapture" | "onChange" | "onClick" | "onCloseAutoFocus" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onEscapeKeyDown" | "onFocus" | "onFocusCapture" | "onFocusOutside" | "onInput" | "onInteractOutside" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onOpenAutoFocus" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownOutside" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchStart" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "scope" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "trapFocus" | "tvParallaxMagnification" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "untilMeasured" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>>> & Omit<DialogContentTypeProps, "context" | "onPointerDownCapture"> & {
        scope?: DialogScopes;
    }, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogContentTypeProps, "context" | "onPointerDownCapture"> & {
        scope?: DialogScopes;
    }, import("@tamagui/core").StackStyleBase, {
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
        elevation?: number | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Title: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/core").FontSize | undefined;
    }>, "scope"> & {
        scope?: DialogScopes;
    }, import("react-native").Text | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").TextNonStyleProps & {
        scope?: DialogScopes;
    }, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/core").FontSize | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Description: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/core").FontSize | undefined;
    }>, "scope"> & {
        scope?: DialogScopes;
    }, import("react-native").Text | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").TextNonStyleProps & {
        scope?: DialogScopes;
    }, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/core").FontSize | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Close: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "displayWhenAdapted" | "scope"> & {
        displayWhenAdapted?: boolean;
    } & {
        scope?: DialogScopes;
    }, import("react-native").View | (HTMLElement & import("@tamagui/core").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        displayWhenAdapted?: boolean;
    } & {
        scope?: DialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => import("react/jsx-runtime").JSX.Element;
    Adapt: ((props: import("@tamagui/adapt").AdaptProps) => import("react/jsx-runtime").JSX.Element) & {
        Contents: typeof import("@tamagui/adapt").AdaptContents;
    };
};
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DialogWarningProvider, };
export type { DialogCloseProps, DialogContentProps, DialogDescriptionProps, DialogOverlayProps, DialogPortalProps, DialogProps, DialogTitleProps, DialogTriggerProps, };
//# sourceMappingURL=Dialog.d.ts.map