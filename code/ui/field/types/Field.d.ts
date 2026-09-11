import type { GetProps } from '@tamagui/style';
import * as React from 'react';
import { useFieldControl, useFieldState } from './FieldContext';
import type { FieldState, FieldValidationMode, FieldValidator, FieldValidityState } from './types';
export declare const FieldFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
};
export declare const FieldLabelFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>> & {
    ref?: React.Ref<import("@tamagui/style").TamaguiTextElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").RNTamaguiTextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").RNTamaguiTextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
};
export declare const FieldDescriptionFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>> & {
    ref?: React.Ref<import("@tamagui/style").TamaguiTextElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").RNTamaguiTextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").RNTamaguiTextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
};
export declare const FieldErrorFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>> & {
    ref?: React.Ref<import("@tamagui/style").TamaguiTextElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").RNTamaguiTextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").RNTamaguiTextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
};
export declare const FieldItemFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
};
type FieldExtraProps = {
    name?: string;
    disabled?: boolean;
    invalid?: boolean;
    validate?: FieldValidator;
    validationMode?: FieldValidationMode;
    validationDebounceTime?: number;
};
export type FieldProps = Omit<GetProps<typeof FieldFrame>, keyof FieldExtraProps> & FieldExtraProps;
export type FieldLabelProps = GetProps<typeof FieldLabelFrame>;
export type FieldDescriptionProps = GetProps<typeof FieldDescriptionFrame>;
export type FieldErrorProps = GetProps<typeof FieldErrorFrame> & {
    match?: boolean | keyof FieldValidityState;
};
export type FieldItemProps = GetProps<typeof FieldItemFrame> & {
    disabled?: boolean;
};
export declare const Field: React.FunctionComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}>, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "dirty" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "download" | "filled" | "focused" | "forceStyle" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "isTVSelectable" | "nativeID" | "needsOffscreenAlphaCompositing" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchStart" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "touched" | "tvParallaxMagnification" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "untilMeasured" | "valid" | keyof FieldExtraProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}>, keyof FieldExtraProps> & FieldExtraProps & {
    ref?: React.Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}>, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "dirty" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "download" | "filled" | "focused" | "forceStyle" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "isTVSelectable" | "nativeID" | "needsOffscreenAlphaCompositing" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchStart" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "touched" | "tvParallaxMagnification" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "untilMeasured" | "valid" | keyof FieldExtraProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}>, keyof FieldExtraProps> & FieldExtraProps, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}>, keyof FieldExtraProps> & FieldExtraProps, import("@tamagui/style").StackStyleBase, {
    dirty?: boolean | undefined;
    disabled?: boolean | undefined;
    filled?: boolean | undefined;
    focused?: boolean | undefined;
    invalid?: boolean | undefined;
    touched?: boolean | undefined;
    valid?: boolean | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "dirty" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "download" | "filled" | "focused" | "forceStyle" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "isTVSelectable" | "nativeID" | "needsOffscreenAlphaCompositing" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchStart" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "touched" | "tvParallaxMagnification" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "untilMeasured" | "valid" | keyof FieldExtraProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>, keyof FieldExtraProps> & FieldExtraProps, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>, keyof FieldExtraProps> & FieldExtraProps, import("@tamagui/style").StackStyleBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
} & {
    Label: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiTextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "adjustsFontSizeToFit" | "allowFontScaling" | "android_hyphenationFrequency" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "children" | "className" | "container" | "dangerouslySetInnerHTML" | "dataDetectorType" | "debug" | "dir" | "dirty" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disabled" | "dynamicTypeRamp" | "ellipsizeMode" | "filled" | "focused" | "forceStyle" | "group" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "invalid" | "lineBreakMode" | "lineBreakStrategyIOS" | "maxFontSizeMultiplier" | "minimumFontScale" | "name" | "nativeID" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onPaste" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPress" | "onPressIn" | "onPressOut" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onTextLayout" | "onWheel" | "pressRetentionOffset" | "render" | "role" | "screenReaderFocusable" | "selectionColor" | "style" | "suppressHighlighting" | "tabIndex" | "target" | "testID" | "textBreakStrategy" | "theme" | "themeShallow" | "touched" | "untilMeasured" | "valid" | keyof import("@tamagui/style").TextStylePropsBase> & Omit<import("@tamagui/style").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>>, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").RNTamaguiTextNonStyleProps & Omit<import("@tamagui/style").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>>, import("@tamagui/style").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic>;
    Description: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiTextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "adjustsFontSizeToFit" | "allowFontScaling" | "android_hyphenationFrequency" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "children" | "className" | "container" | "dangerouslySetInnerHTML" | "dataDetectorType" | "debug" | "dir" | "dirty" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disabled" | "dynamicTypeRamp" | "ellipsizeMode" | "filled" | "focused" | "forceStyle" | "group" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "invalid" | "lineBreakMode" | "lineBreakStrategyIOS" | "maxFontSizeMultiplier" | "minimumFontScale" | "name" | "nativeID" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onPaste" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPress" | "onPressIn" | "onPressOut" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onTextLayout" | "onWheel" | "pressRetentionOffset" | "render" | "role" | "screenReaderFocusable" | "selectionColor" | "style" | "suppressHighlighting" | "tabIndex" | "target" | "testID" | "textBreakStrategy" | "theme" | "themeShallow" | "touched" | "untilMeasured" | "valid" | keyof import("@tamagui/style").TextStylePropsBase> & Omit<import("@tamagui/style").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>>, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").RNTamaguiTextNonStyleProps & Omit<import("@tamagui/style").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>>, import("@tamagui/style").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic>;
    Error: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiTextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "adjustsFontSizeToFit" | "allowFontScaling" | "android_hyphenationFrequency" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "children" | "className" | "container" | "dangerouslySetInnerHTML" | "dataDetectorType" | "debug" | "dir" | "dirty" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disabled" | "dynamicTypeRamp" | "ellipsizeMode" | "filled" | "focused" | "forceStyle" | "group" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "invalid" | "lineBreakMode" | "lineBreakStrategyIOS" | "match" | "maxFontSizeMultiplier" | "minimumFontScale" | "name" | "nativeID" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onPaste" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPress" | "onPressIn" | "onPressOut" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onTextLayout" | "onWheel" | "pressRetentionOffset" | "render" | "role" | "screenReaderFocusable" | "selectionColor" | "style" | "suppressHighlighting" | "tabIndex" | "target" | "testID" | "textBreakStrategy" | "theme" | "themeShallow" | "touched" | "untilMeasured" | "valid" | keyof import("@tamagui/style").TextStylePropsBase> & Omit<import("@tamagui/style").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>> & {
        match?: boolean | keyof FieldValidityState;
    }, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").RNTamaguiTextNonStyleProps & Omit<import("@tamagui/style").RNTamaguiTextNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>> & {
        match?: boolean | keyof FieldValidityState;
    }, import("@tamagui/style").TextStylePropsBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic>;
    Item: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }>, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "dirty" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disabled" | "download" | "filled" | "focused" | "forceStyle" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "invalid" | "isTVSelectable" | "name" | "nativeID" | "needsOffscreenAlphaCompositing" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchStart" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "touched" | "tvParallaxMagnification" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "untilMeasured" | "valid" | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        disabled?: boolean;
    }, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "dirty" | "disabled" | "filled" | "focused" | "invalid" | "touched" | "valid" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        disabled?: boolean;
    }, import("@tamagui/style").StackStyleBase, {
        dirty?: boolean | undefined;
        disabled?: boolean | undefined;
        filled?: boolean | undefined;
        focused?: boolean | undefined;
        invalid?: boolean | undefined;
        touched?: boolean | undefined;
        valid?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic>;
    useFieldState: typeof useFieldState;
    useFieldControl: typeof useFieldControl;
};
export declare namespace Field {
    type Props = FieldProps;
    type State = FieldState;
    type ValidityState = FieldValidityState;
}
export {};
//# sourceMappingURL=Field.d.ts.map