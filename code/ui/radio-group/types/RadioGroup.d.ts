import type { GetProps, StylePiece } from '@tamagui/style';
import type { RadioGroupContextValue, RadioGroupItemContextValue } from '@tamagui/radio-headless';
import React from 'react';
export declare const RadioGroupItemFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "disabled" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    disabled?: boolean | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    disabled?: boolean | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        disabled?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
};
export declare const RadioGroupIndicatorFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic];
};
export declare const RadioGroupFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "orientation" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    orientation?: "horizontal" | "vertical" | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    orientation?: "horizontal" | "vertical" | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        orientation?: "horizontal" | "vertical" | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
};
export type RadioGroupIndicatorProps = GetProps<typeof RadioGroupIndicatorFrame> & {
    forceMount?: boolean;
};
export declare const RadioGroupContext: React.Context<RadioGroupContextValue>;
export declare const RadioGroupItemContext: React.Context<RadioGroupItemContextValue>;
export type RadioGroupItemProps = GetProps<typeof RadioGroupItemFrame> & {
    value: string;
    id?: string;
    labelledBy?: string;
    disabled?: boolean;
    activeStyle?: StylePiece;
    activeTheme?: string | null;
};
export type RadioGroupProps = GetProps<typeof RadioGroupFrame> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
};
export declare const RadioGroup: React.FunctionComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    orientation?: "horizontal" | "vertical" | undefined;
}>, "accentColor" | "defaultValue" | "native" | "onValueChange" | "orientation" | "required" | "value" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "orientation" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    orientation?: "horizontal" | "vertical" | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
} & {
    ref?: React.Ref<import("@tamagui/style").TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
    orientation?: "horizontal" | "vertical" | undefined;
}>, "accentColor" | "defaultValue" | "native" | "onValueChange" | "orientation" | "required" | "value" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "orientation" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    orientation?: "horizontal" | "vertical" | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
}, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "orientation" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
    orientation?: "horizontal" | "vertical" | undefined;
}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
}, import("@tamagui/style").StackStyleBase, {
    orientation?: "horizontal" | "vertical" | undefined;
}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        orientation?: "horizontal" | "vertical" | undefined;
    }>, "accentColor" | "defaultValue" | "native" | "onValueChange" | "orientation" | "required" | "value" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "orientation" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        orientation?: "horizontal" | "vertical" | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
        required?: boolean;
        disabled?: boolean;
        name?: string;
        native?: boolean;
        accentColor?: string;
    }, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "orientation" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        orientation?: "horizontal" | "vertical" | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
        required?: boolean;
        disabled?: boolean;
        name?: string;
        native?: boolean;
        accentColor?: string;
    }, import("@tamagui/style").StackStyleBase, {
        orientation?: "horizontal" | "vertical" | undefined;
    }, import("@tamagui/style").StaticConfigPublic];
} & {
    Item: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {
        disabled?: boolean | undefined;
    }>, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "activeStyle" | "activeTheme" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "children" | "className" | "collapsable" | "collapsableChildren" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableNativeStyle" | "disableOptimization" | "disabled" | "download" | "forceStyle" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "isTVSelectable" | "labelledBy" | "name" | "nativeID" | "needsOffscreenAlphaCompositing" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchStart" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "screenReaderFocusable" | "shouldRasterizeIOS" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "tvParallaxMagnification" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "untilMeasured" | "value" | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "disabled" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        disabled?: boolean | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        value: string;
        id?: string;
        labelledBy?: string;
        disabled?: boolean;
        activeStyle?: StylePiece;
        activeTheme?: string | null;
    }, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, "disabled" | keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{
        disabled?: boolean | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        value: string;
        id?: string;
        labelledBy?: string;
        disabled?: boolean;
        activeStyle?: StylePiece;
        activeTheme?: string | null;
    }, import("@tamagui/style").StackStyleBase, {
        disabled?: boolean | undefined;
    }, import("@tamagui/style").StaticConfigPublic>;
    Indicator: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "forceMount" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        forceMount?: boolean;
    }, import("@tamagui/style").TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        forceMount?: boolean;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
};
//# sourceMappingURL=RadioGroup.d.ts.map