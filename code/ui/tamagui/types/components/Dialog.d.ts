import { type TamaguiElement } from '@tamagui/core';
import type * as React from 'react';
export declare const dialogOverlayStyles: {
    readonly backgroundColor: 'background';
};
export declare const dialogContentStyles: {
    readonly backgroundColor: 'background';
    readonly borderWidth: 1;
    readonly borderColor: 'border-color';
    readonly padding: '4';
    readonly borderRadius: '4';
    readonly elevate: true;
};
export declare const DialogOverlay: React.FunctionComponent<Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "forceMount" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
}, "open"> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, "open">> & import("@tamagui/core").WithFlatVariantValues<Omit<{
    open?: boolean | undefined;
}, "forceMount" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, "forceMount" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "forceMount" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & {
    forceMount?: boolean;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{
    open?: boolean | undefined;
}, "forceMount" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "forceMount" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "forceMount" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic];
};
export declare const DialogContent: React.FunctionComponent<Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "bordered" | "branches" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disableOutsidePointerEvents" | "disabled" | "download" | "elevate" | "experimental_accessibilityOrder" | "forceStyle" | "forceUnmount" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "name" | "nativeBackgroundAndroid" | "nativeForegroundAndroid" | "nativeID" | "needsOffscreenAlphaCompositing" | "nextFocusDown" | "nextFocusForward" | "nextFocusLeft" | "nextFocusRight" | "nextFocusUp" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onBlurCapture" | "onChange" | "onClick" | "onClickCapture" | "onCloseAutoFocus" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onEscapeKeyDown" | "onFocus" | "onFocusCapture" | "onFocusOutside" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInteractOutside" | "onKeyDown" | "onKeyDownCapture" | "onKeyUp" | "onKeyUpCapture" | "onLayout" | "onLongPress" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onOpenAutoFocus" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownOutside" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "scope" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "trapFocus" | "untilMeasured" | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate"> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, "bordered" | "elevate">> & import("@tamagui/core").WithFlatVariantValues<{
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
    trapFocus?: import("@tamagui/focus-scope").FocusScopeProps['trapped'];
    onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps['onMountAutoFocus'];
    onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps['onUnmountAutoFocus'];
    context: {
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
        open: Exclude<import("@tamagui/dialog").DialogProps['open'], void | null>;
        onOpenChange: Exclude<import("@tamagui/dialog").DialogProps['onOpenChange'], void | null>;
        modal: Exclude<import("@tamagui/dialog").DialogProps['modal'], void | null>;
        dialogScope: import("@tamagui/dialog").DialogScopes;
        adaptScope: string;
        onAnimationComplete?: import("@tamagui/dialog").DialogProps['onAnimationComplete'];
    };
    onTransition?: import("@tamagui/core").OnTransition;
} & {
    context: {
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
        open: Exclude<import("@tamagui/dialog").DialogProps['open'], void | null>;
        onOpenChange: Exclude<import("@tamagui/dialog").DialogProps['onOpenChange'], void | null>;
        modal: Exclude<import("@tamagui/dialog").DialogProps['modal'], void | null>;
        dialogScope: import("@tamagui/dialog").DialogScopes;
        adaptScope: string;
        onAnimationComplete?: import("@tamagui/dialog").DialogProps['onAnimationComplete'];
    };
}, "context" | "onPointerDownCapture"> & {
    scope?: import("@tamagui/dialog").DialogScopes;
}, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<Omit<{
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
}, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "bordered" | "branches" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disableOutsidePointerEvents" | "disabled" | "download" | "elevate" | "experimental_accessibilityOrder" | "forceStyle" | "forceUnmount" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "name" | "nativeBackgroundAndroid" | "nativeForegroundAndroid" | "nativeID" | "needsOffscreenAlphaCompositing" | "nextFocusDown" | "nextFocusForward" | "nextFocusLeft" | "nextFocusRight" | "nextFocusUp" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onBlurCapture" | "onChange" | "onClick" | "onClickCapture" | "onCloseAutoFocus" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onEscapeKeyDown" | "onFocus" | "onFocusCapture" | "onFocusOutside" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInteractOutside" | "onKeyDown" | "onKeyDownCapture" | "onKeyUp" | "onKeyUpCapture" | "onLayout" | "onLongPress" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onOpenAutoFocus" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownOutside" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "scope" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "trapFocus" | "untilMeasured" | keyof import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "bordered" | "branches" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disableOutsidePointerEvents" | "disabled" | "download" | "elevate" | "experimental_accessibilityOrder" | "forceStyle" | "forceUnmount" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "name" | "nativeBackgroundAndroid" | "nativeForegroundAndroid" | "nativeID" | "needsOffscreenAlphaCompositing" | "nextFocusDown" | "nextFocusForward" | "nextFocusLeft" | "nextFocusRight" | "nextFocusUp" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onBlurCapture" | "onChange" | "onClick" | "onClickCapture" | "onCloseAutoFocus" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onEscapeKeyDown" | "onFocus" | "onFocusCapture" | "onFocusOutside" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInteractOutside" | "onKeyDown" | "onKeyDownCapture" | "onKeyUp" | "onKeyUpCapture" | "onLayout" | "onLongPress" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onOpenAutoFocus" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerDownOutside" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "scope" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "trapFocus" | "untilMeasured" | keyof import("@tamagui/core").StackStyleBase> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "bordered" | "branches" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disableOutsidePointerEvents" | "disabled" | "download" | "elevate" | "experimental_accessibilityOrder" | "forceStyle" | "forceUnmount" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "name" | "nativeBackgroundAndroid" | "nativeForegroundAndroid" | "nativeID" | "needsOffscreenAlphaCompositing" | "nextFocusDown" | "nextFocusForward" | "nextFocusLeft" | "nextFocusRight" | "nextFocusUp" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onBlurCapture" | "onChange" | "onClick" | "onClickCapture" | "onCloseAutoFocus" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onEscapeKeyDown" | "onFocus" | "onFocusCapture" | "onFocusOutside" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInteractOutside" | "onKeyDown" | "onKeyDownCapture" | "onKeyUp" | "onKeyUpCapture" | "onLayout" | "onLongPress" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onOpenAutoFocus" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownOutside" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "scope" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "trapFocus" | "untilMeasured" | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate"> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, "bordered" | "elevate">> & import("@tamagui/core").WithFlatVariantValues<{
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
    trapFocus?: import("@tamagui/focus-scope").FocusScopeProps['trapped'];
    onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps['onMountAutoFocus'];
    onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps['onUnmountAutoFocus'];
    context: {
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
        open: Exclude<import("@tamagui/dialog").DialogProps['open'], void | null>;
        onOpenChange: Exclude<import("@tamagui/dialog").DialogProps['onOpenChange'], void | null>;
        modal: Exclude<import("@tamagui/dialog").DialogProps['modal'], void | null>;
        dialogScope: import("@tamagui/dialog").DialogScopes;
        adaptScope: string;
        onAnimationComplete?: import("@tamagui/dialog").DialogProps['onAnimationComplete'];
    };
    onTransition?: import("@tamagui/core").OnTransition;
} & {
    context: {
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
        open: Exclude<import("@tamagui/dialog").DialogProps['open'], void | null>;
        onOpenChange: Exclude<import("@tamagui/dialog").DialogProps['onOpenChange'], void | null>;
        modal: Exclude<import("@tamagui/dialog").DialogProps['modal'], void | null>;
        dialogScope: import("@tamagui/dialog").DialogScopes;
        adaptScope: string;
        onAnimationComplete?: import("@tamagui/dialog").DialogProps['onAnimationComplete'];
    };
}, "context" | "onPointerDownCapture"> & {
    scope?: import("@tamagui/dialog").DialogScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{
    bordered?: boolean | undefined;
    elevate?: boolean | undefined;
}, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "bordered" | "branches" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disableOutsidePointerEvents" | "disabled" | "download" | "elevate" | "experimental_accessibilityOrder" | "forceStyle" | "forceUnmount" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "name" | "nativeBackgroundAndroid" | "nativeForegroundAndroid" | "nativeID" | "needsOffscreenAlphaCompositing" | "nextFocusDown" | "nextFocusForward" | "nextFocusLeft" | "nextFocusRight" | "nextFocusUp" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onBlurCapture" | "onChange" | "onClick" | "onClickCapture" | "onCloseAutoFocus" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onEscapeKeyDown" | "onFocus" | "onFocusCapture" | "onFocusOutside" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInteractOutside" | "onKeyDown" | "onKeyDownCapture" | "onKeyUp" | "onKeyUpCapture" | "onLayout" | "onLongPress" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onOpenAutoFocus" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownOutside" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "scope" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "trapFocus" | "untilMeasured" | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "bordered" | "branches" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disableOutsidePointerEvents" | "disabled" | "download" | "elevate" | "experimental_accessibilityOrder" | "forceStyle" | "forceUnmount" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "name" | "nativeBackgroundAndroid" | "nativeForegroundAndroid" | "nativeID" | "needsOffscreenAlphaCompositing" | "nextFocusDown" | "nextFocusForward" | "nextFocusLeft" | "nextFocusRight" | "nextFocusUp" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onBlurCapture" | "onChange" | "onClick" | "onClickCapture" | "onCloseAutoFocus" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onEscapeKeyDown" | "onFocus" | "onFocusCapture" | "onFocusOutside" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInteractOutside" | "onKeyDown" | "onKeyDownCapture" | "onKeyUp" | "onKeyUpCapture" | "onLayout" | "onLongPress" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onOpenAutoFocus" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownOutside" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "scope" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "trapFocus" | "untilMeasured" | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate"> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, "bordered" | "elevate">> & import("@tamagui/core").WithFlatVariantValues<{
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
        trapFocus?: import("@tamagui/focus-scope").FocusScopeProps['trapped'];
        onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps['onMountAutoFocus'];
        onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps['onUnmountAutoFocus'];
        context: {
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
            open: Exclude<import("@tamagui/dialog").DialogProps['open'], void | null>;
            onOpenChange: Exclude<import("@tamagui/dialog").DialogProps['onOpenChange'], void | null>;
            modal: Exclude<import("@tamagui/dialog").DialogProps['modal'], void | null>;
            dialogScope: import("@tamagui/dialog").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/dialog").DialogProps['onAnimationComplete'];
        };
        onTransition?: import("@tamagui/core").OnTransition;
    } & {
        context: {
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
            open: Exclude<import("@tamagui/dialog").DialogProps['open'], void | null>;
            onOpenChange: Exclude<import("@tamagui/dialog").DialogProps['onOpenChange'], void | null>;
            modal: Exclude<import("@tamagui/dialog").DialogProps['modal'], void | null>;
            dialogScope: import("@tamagui/dialog").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/dialog").DialogProps['onAnimationComplete'];
        };
    }, "context" | "onPointerDownCapture"> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "bordered" | "branches" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disableOutsidePointerEvents" | "disabled" | "download" | "elevate" | "experimental_accessibilityOrder" | "forceStyle" | "forceUnmount" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "name" | "nativeBackgroundAndroid" | "nativeForegroundAndroid" | "nativeID" | "needsOffscreenAlphaCompositing" | "nextFocusDown" | "nextFocusForward" | "nextFocusLeft" | "nextFocusRight" | "nextFocusUp" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onBlurCapture" | "onChange" | "onClick" | "onClickCapture" | "onCloseAutoFocus" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onEscapeKeyDown" | "onFocus" | "onFocusCapture" | "onFocusOutside" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInteractOutside" | "onKeyDown" | "onKeyDownCapture" | "onKeyUp" | "onKeyUpCapture" | "onLayout" | "onLongPress" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onOpenAutoFocus" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownOutside" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "scope" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "trapFocus" | "untilMeasured" | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic];
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
    scope?: import("@tamagui/dialog").DialogScopes;
} & import("@tamagui/core").RefProp<TamaguiElement>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Trigger: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope" | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
    Portal: import("@tamagui/core").RefComponent<TamaguiElement, import("@tamagui/dialog").DialogPortalProps>;
    Title: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, Omit<import("@tamagui/core").TextNonStyleProps, "scope"> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").TextStylePropsBase, Omit<{
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        unstyled?: boolean | undefined;
    }, "scope">, import("@tamagui/core").StaticConfigPublic>;
    Description: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, Omit<import("@tamagui/core").TextNonStyleProps, "scope"> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").TextStylePropsBase, Omit<{
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
    }, "scope">, import("@tamagui/core").StaticConfigPublic>;
    Close: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "displayWhenAdapted" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & {
        displayWhenAdapted?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "displayWhenAdapted" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic>;
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => React.JSX.Element;
    Adapt: ((props: import("@tamagui/adapt").AdaptProps) => React.JSX.Element) & {
        Contents: typeof import("@tamagui/adapt").AdaptContents;
    };
    Overlay: React.FunctionComponent<Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "forceMount" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, "open"> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, "open">> & import("@tamagui/core").WithFlatVariantValues<Omit<{
        open?: boolean | undefined;
    }, "forceMount" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, "forceMount" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "forceMount" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & {
        forceMount?: boolean;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        open?: boolean | undefined;
    }, "forceMount" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "forceMount" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<{}> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & {
            forceMount?: boolean;
        } & {
            scope?: import("@tamagui/dialog").DialogScopes;
        }, import("@tamagui/core").StackStyleBase, Omit<{
            open?: boolean | undefined;
        }, "forceMount" | "scope" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic];
    };
    Content: React.FunctionComponent<Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "bordered" | "branches" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disableOutsidePointerEvents" | "disabled" | "download" | "elevate" | "experimental_accessibilityOrder" | "forceStyle" | "forceUnmount" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "name" | "nativeBackgroundAndroid" | "nativeForegroundAndroid" | "nativeID" | "needsOffscreenAlphaCompositing" | "nextFocusDown" | "nextFocusForward" | "nextFocusLeft" | "nextFocusRight" | "nextFocusUp" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onBlurCapture" | "onChange" | "onClick" | "onClickCapture" | "onCloseAutoFocus" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onEscapeKeyDown" | "onFocus" | "onFocusCapture" | "onFocusOutside" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInteractOutside" | "onKeyDown" | "onKeyDownCapture" | "onKeyUp" | "onKeyUpCapture" | "onLayout" | "onLongPress" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onOpenAutoFocus" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownOutside" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "scope" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "trapFocus" | "untilMeasured" | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate"> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, "bordered" | "elevate">> & import("@tamagui/core").WithFlatVariantValues<{
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
        trapFocus?: import("@tamagui/focus-scope").FocusScopeProps['trapped'];
        onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps['onMountAutoFocus'];
        onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps['onUnmountAutoFocus'];
        context: {
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
            open: Exclude<import("@tamagui/dialog").DialogProps['open'], void | null>;
            onOpenChange: Exclude<import("@tamagui/dialog").DialogProps['onOpenChange'], void | null>;
            modal: Exclude<import("@tamagui/dialog").DialogProps['modal'], void | null>;
            dialogScope: import("@tamagui/dialog").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/dialog").DialogProps['onAnimationComplete'];
        };
        onTransition?: import("@tamagui/core").OnTransition;
    } & {
        context: {
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
            open: Exclude<import("@tamagui/dialog").DialogProps['open'], void | null>;
            onOpenChange: Exclude<import("@tamagui/dialog").DialogProps['onOpenChange'], void | null>;
            modal: Exclude<import("@tamagui/dialog").DialogProps['modal'], void | null>;
            dialogScope: import("@tamagui/dialog").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/dialog").DialogProps['onAnimationComplete'];
        };
    }, "context" | "onPointerDownCapture"> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, never> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, never>> & import("@tamagui/core").WithFlatVariantValues<Omit<{
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "bordered" | "branches" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disableOutsidePointerEvents" | "disabled" | "download" | "elevate" | "experimental_accessibilityOrder" | "forceStyle" | "forceUnmount" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "name" | "nativeBackgroundAndroid" | "nativeForegroundAndroid" | "nativeID" | "needsOffscreenAlphaCompositing" | "nextFocusDown" | "nextFocusForward" | "nextFocusLeft" | "nextFocusRight" | "nextFocusUp" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onBlurCapture" | "onChange" | "onClick" | "onClickCapture" | "onCloseAutoFocus" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onEscapeKeyDown" | "onFocus" | "onFocusCapture" | "onFocusOutside" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInteractOutside" | "onKeyDown" | "onKeyDownCapture" | "onKeyUp" | "onKeyUpCapture" | "onLayout" | "onLongPress" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onOpenAutoFocus" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownOutside" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "scope" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "trapFocus" | "untilMeasured" | keyof import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "bordered" | "branches" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disableOutsidePointerEvents" | "disabled" | "download" | "elevate" | "experimental_accessibilityOrder" | "forceStyle" | "forceUnmount" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "name" | "nativeBackgroundAndroid" | "nativeForegroundAndroid" | "nativeID" | "needsOffscreenAlphaCompositing" | "nextFocusDown" | "nextFocusForward" | "nextFocusLeft" | "nextFocusRight" | "nextFocusUp" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onBlurCapture" | "onChange" | "onClick" | "onClickCapture" | "onCloseAutoFocus" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onEscapeKeyDown" | "onFocus" | "onFocusCapture" | "onFocusOutside" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInteractOutside" | "onKeyDown" | "onKeyDownCapture" | "onKeyUp" | "onKeyUpCapture" | "onLayout" | "onLongPress" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onOpenAutoFocus" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerDownOutside" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "scope" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "trapFocus" | "untilMeasured" | keyof import("@tamagui/core").StackStyleBase> & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "bordered" | "branches" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disableOutsidePointerEvents" | "disabled" | "download" | "elevate" | "experimental_accessibilityOrder" | "forceStyle" | "forceUnmount" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "name" | "nativeBackgroundAndroid" | "nativeForegroundAndroid" | "nativeID" | "needsOffscreenAlphaCompositing" | "nextFocusDown" | "nextFocusForward" | "nextFocusLeft" | "nextFocusRight" | "nextFocusUp" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onBlurCapture" | "onChange" | "onClick" | "onClickCapture" | "onCloseAutoFocus" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onEscapeKeyDown" | "onFocus" | "onFocusCapture" | "onFocusOutside" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInteractOutside" | "onKeyDown" | "onKeyDownCapture" | "onKeyUp" | "onKeyUpCapture" | "onLayout" | "onLongPress" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onOpenAutoFocus" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownOutside" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "scope" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "trapFocus" | "untilMeasured" | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate"> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, "bordered" | "elevate">> & import("@tamagui/core").WithFlatVariantValues<{
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
        trapFocus?: import("@tamagui/focus-scope").FocusScopeProps['trapped'];
        onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps['onMountAutoFocus'];
        onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps['onUnmountAutoFocus'];
        context: {
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
            open: Exclude<import("@tamagui/dialog").DialogProps['open'], void | null>;
            onOpenChange: Exclude<import("@tamagui/dialog").DialogProps['onOpenChange'], void | null>;
            modal: Exclude<import("@tamagui/dialog").DialogProps['modal'], void | null>;
            dialogScope: import("@tamagui/dialog").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/dialog").DialogProps['onAnimationComplete'];
        };
        onTransition?: import("@tamagui/core").OnTransition;
    } & {
        context: {
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
            open: Exclude<import("@tamagui/dialog").DialogProps['open'], void | null>;
            onOpenChange: Exclude<import("@tamagui/dialog").DialogProps['onOpenChange'], void | null>;
            modal: Exclude<import("@tamagui/dialog").DialogProps['modal'], void | null>;
            dialogScope: import("@tamagui/dialog").DialogScopes;
            adaptScope: string;
            onAnimationComplete?: import("@tamagui/dialog").DialogProps['onAnimationComplete'];
        };
    }, "context" | "onPointerDownCapture"> & {
        scope?: import("@tamagui/dialog").DialogScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{
        bordered?: boolean | undefined;
        elevate?: boolean | undefined;
    }, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "bordered" | "branches" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disableOutsidePointerEvents" | "disabled" | "download" | "elevate" | "experimental_accessibilityOrder" | "forceStyle" | "forceUnmount" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "name" | "nativeBackgroundAndroid" | "nativeForegroundAndroid" | "nativeID" | "needsOffscreenAlphaCompositing" | "nextFocusDown" | "nextFocusForward" | "nextFocusLeft" | "nextFocusRight" | "nextFocusUp" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onBlurCapture" | "onChange" | "onClick" | "onClickCapture" | "onCloseAutoFocus" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onEscapeKeyDown" | "onFocus" | "onFocusCapture" | "onFocusOutside" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInteractOutside" | "onKeyDown" | "onKeyDownCapture" | "onKeyUp" | "onKeyUpCapture" | "onLayout" | "onLongPress" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onOpenAutoFocus" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownOutside" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "scope" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "trapFocus" | "untilMeasured" | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "bordered" | "branches" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disableOutsidePointerEvents" | "disabled" | "download" | "elevate" | "experimental_accessibilityOrder" | "forceStyle" | "forceUnmount" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "name" | "nativeBackgroundAndroid" | "nativeForegroundAndroid" | "nativeID" | "needsOffscreenAlphaCompositing" | "nextFocusDown" | "nextFocusForward" | "nextFocusLeft" | "nextFocusRight" | "nextFocusUp" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onBlurCapture" | "onChange" | "onClick" | "onClickCapture" | "onCloseAutoFocus" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onEscapeKeyDown" | "onFocus" | "onFocusCapture" | "onFocusOutside" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInteractOutside" | "onKeyDown" | "onKeyDownCapture" | "onKeyUp" | "onKeyUpCapture" | "onLayout" | "onLongPress" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onOpenAutoFocus" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownOutside" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "scope" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "trapFocus" | "untilMeasured" | keyof import("@tamagui/core").StackStyleBase> & Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "bordered" | "elevate"> & Omit<import("@tamagui/core").WithThemeValues<Omit<import("@tamagui/core").StackStyleBase, "bordered" | "elevate">> & import("@tamagui/core").WithFlatVariantValues<{
            bordered?: boolean | undefined;
            elevate?: boolean | undefined;
        }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>, keyof import("@tamagui/core").RNTamaguiViewNonStyleProps> & Omit<import("@tamagui/dismissable").DismissableProps, "onDismiss"> & {
            trapFocus?: import("@tamagui/focus-scope").FocusScopeProps['trapped'];
            onOpenAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps['onMountAutoFocus'];
            onCloseAutoFocus?: import("@tamagui/focus-scope").FocusScopeProps['onUnmountAutoFocus'];
            context: {
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
                open: Exclude<import("@tamagui/dialog").DialogProps['open'], void | null>;
                onOpenChange: Exclude<import("@tamagui/dialog").DialogProps['onOpenChange'], void | null>;
                modal: Exclude<import("@tamagui/dialog").DialogProps['modal'], void | null>;
                dialogScope: import("@tamagui/dialog").DialogScopes;
                adaptScope: string;
                onAnimationComplete?: import("@tamagui/dialog").DialogProps['onAnimationComplete'];
            };
            onTransition?: import("@tamagui/core").OnTransition;
        } & {
            context: {
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
                open: Exclude<import("@tamagui/dialog").DialogProps['open'], void | null>;
                onOpenChange: Exclude<import("@tamagui/dialog").DialogProps['onOpenChange'], void | null>;
                modal: Exclude<import("@tamagui/dialog").DialogProps['modal'], void | null>;
                dialogScope: import("@tamagui/dialog").DialogScopes;
                adaptScope: string;
                onAnimationComplete?: import("@tamagui/dialog").DialogProps['onAnimationComplete'];
            };
        }, "context" | "onPointerDownCapture"> & {
            scope?: import("@tamagui/dialog").DialogScopes;
        }, import("@tamagui/core").StackStyleBase, Omit<{
            bordered?: boolean | undefined;
            elevate?: boolean | undefined;
        }, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "bordered" | "branches" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disableOutsidePointerEvents" | "disabled" | "download" | "elevate" | "experimental_accessibilityOrder" | "forceStyle" | "forceUnmount" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "name" | "nativeBackgroundAndroid" | "nativeForegroundAndroid" | "nativeID" | "needsOffscreenAlphaCompositing" | "nextFocusDown" | "nextFocusForward" | "nextFocusLeft" | "nextFocusRight" | "nextFocusUp" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onBlurCapture" | "onChange" | "onClick" | "onClickCapture" | "onCloseAutoFocus" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onEscapeKeyDown" | "onFocus" | "onFocusCapture" | "onFocusOutside" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onInput" | "onInteractOutside" | "onKeyDown" | "onKeyDownCapture" | "onKeyUp" | "onKeyUpCapture" | "onLayout" | "onLongPress" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onOpenAutoFocus" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownOutside" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerOut" | "onPointerOutCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "scope" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "trapFocus" | "untilMeasured" | keyof import("@tamagui/core").StackStyleBase>, import("@tamagui/core").StaticConfigPublic];
    };
};
//# sourceMappingURL=Dialog.d.ts.map