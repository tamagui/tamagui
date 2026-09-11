import type { CheckedState, CheckboxExtraProps as HeadlessCheckboxExtraProps } from '@tamagui/checkbox-headless';
import type { GetProps, NativeValue, SizeTokens, StylePiece } from '@tamagui/style';
import React from 'react';
export declare const CheckboxIndicatorFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "active" | "size" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    active?: boolean | undefined;
    size?: import("@tamagui/style").Size | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    active?: boolean | undefined;
    size?: import("@tamagui/style").Size | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        active?: boolean | undefined;
        size?: import("@tamagui/style").Size | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
};
export declare const CheckboxFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "active" | "disabled" | "size" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/style").Size | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/style").Size | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: import("@tamagui/style").Size | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
};
type CheckboxExpectingVariantProps = {
    size?: SizeTokens | true;
};
type CheckboxExtraProps = HeadlessCheckboxExtraProps & {
    native?: NativeValue<'web'>;
};
type CheckboxFrameActiveStyleProps = {
    activeStyle?: StylePiece;
    activeTheme?: string | null;
};
type CheckboxIndicatorActiveStyleProps = {
    activeStyle?: StylePiece;
};
export type CheckboxProps = GetProps<typeof CheckboxFrame> & CheckboxExtraProps & CheckboxExpectingVariantProps & CheckboxFrameActiveStyleProps;
type CheckboxIndicatorExtraProps = {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
};
export type CheckboxIndicatorProps = GetProps<typeof CheckboxIndicatorFrame> & CheckboxIndicatorExtraProps & CheckboxIndicatorActiveStyleProps;
export declare const CheckboxContext: React.Context<{
    checked: CheckedState;
    disabled?: boolean;
}>;
export declare const Checkbox: React.FunctionComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/style").Size | undefined;
}>, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "active" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "download" | "forceStyle" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "importantForAccessibility" | "isTVSelectable" | "native" | "nativeID" | "needsOffscreenAlphaCompositing" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchStart" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "screenReaderFocusable" | "shouldRasterizeIOS" | "size" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "tvParallaxMagnification" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "untilMeasured" | keyof HeadlessCheckboxExtraProps | keyof CheckboxFrameActiveStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "active" | "disabled" | "size" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/style").Size | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & HeadlessCheckboxExtraProps & {
    native?: NativeValue<'web'>;
} & CheckboxExpectingVariantProps & CheckboxFrameActiveStyleProps & {
    ref?: React.Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/style").Size | undefined;
}>, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "active" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "download" | "forceStyle" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "importantForAccessibility" | "isTVSelectable" | "native" | "nativeID" | "needsOffscreenAlphaCompositing" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchStart" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "screenReaderFocusable" | "shouldRasterizeIOS" | "size" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "tvParallaxMagnification" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "untilMeasured" | keyof HeadlessCheckboxExtraProps | keyof CheckboxFrameActiveStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "active" | "disabled" | "size" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/style").Size | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & HeadlessCheckboxExtraProps & {
    native?: NativeValue<'web'>;
} & CheckboxExpectingVariantProps & CheckboxFrameActiveStyleProps, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "active" | "disabled" | "size" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/style").Size | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & HeadlessCheckboxExtraProps & {
    native?: NativeValue<'web'>;
} & CheckboxExpectingVariantProps & CheckboxFrameActiveStyleProps, import("@tamagui/style").StackStyleBase, {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    size?: import("@tamagui/style").Size | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: import("@tamagui/style").Size | undefined;
    }>, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "active" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "download" | "forceStyle" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "importantForAccessibility" | "isTVSelectable" | "native" | "nativeID" | "needsOffscreenAlphaCompositing" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchStart" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "screenReaderFocusable" | "shouldRasterizeIOS" | "size" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "tvParallaxMagnification" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "untilMeasured" | keyof HeadlessCheckboxExtraProps | keyof CheckboxFrameActiveStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "active" | "disabled" | "size" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: import("@tamagui/style").Size | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & HeadlessCheckboxExtraProps & {
        native?: NativeValue<'web'>;
    } & CheckboxExpectingVariantProps & CheckboxFrameActiveStyleProps, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "active" | "disabled" | "size" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: import("@tamagui/style").Size | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & HeadlessCheckboxExtraProps & {
        native?: NativeValue<'web'>;
    } & CheckboxExpectingVariantProps & CheckboxFrameActiveStyleProps, import("@tamagui/style").StackStyleBase, {
        active?: boolean | undefined;
        disabled?: boolean | undefined;
        size?: import("@tamagui/style").Size | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
} & {
    Indicator: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        active?: boolean | undefined;
        size?: import("@tamagui/style").Size | undefined;
    }>, "active" | "activeStyle" | "forceMount" | "size" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "active" | "size" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        active?: boolean | undefined;
        size?: import("@tamagui/style").Size | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & CheckboxIndicatorExtraProps & CheckboxIndicatorActiveStyleProps, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "active" | "size" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        active?: boolean | undefined;
        size?: import("@tamagui/style").Size | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & CheckboxIndicatorExtraProps & CheckboxIndicatorActiveStyleProps, import("@tamagui/style").StackStyleBase, {
        active?: boolean | undefined;
        size?: import("@tamagui/style").Size | undefined;
    }, import("@tamagui/style").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=Checkbox.d.ts.map