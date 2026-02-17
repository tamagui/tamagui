import '@tamagui/polyfill-dev';
import type { SizeTokens, TamaguiElement } from '@tamagui/core';
import type { PopoverAnchorProps, PopoverContentProps, PopoverTriggerProps } from '@tamagui/popover';
import type { PopperProps } from '@tamagui/popper';
import * as React from 'react';
export type TooltipScopes = string;
type ScopedProps<P> = Omit<P, 'scope'> & {
    scope?: TooltipScopes;
};
export type TooltipContentProps = ScopedProps<PopoverContentProps>;
export type TooltipProps = ScopedProps<PopperProps & {
    open?: boolean;
    unstyled?: boolean;
    children?: React.ReactNode;
    onOpenChange?: (open: boolean) => void;
    focus?: {
        enabled?: boolean;
        visibleOnly?: boolean;
    };
    groupId?: string;
    restMs?: number;
    delay?: number | {
        open?: number;
        close?: number;
    };
    disableAutoCloseOnScroll?: boolean;
}>;
type Delay = number | Partial<{
    open: number;
    close: number;
}>;
export declare const TooltipGroup: ({ children, delay, preventAnimation, timeoutMs, }: {
    children?: any;
    delay: Delay;
    preventAnimation?: boolean;
    timeoutMs?: number;
}) => import("react/jsx-runtime").JSX.Element;
export declare const closeOpenTooltips: () => void;
export declare const Tooltip: React.ForwardRefExoticComponent<Omit<PopperProps & {
    open?: boolean;
    unstyled?: boolean;
    children?: React.ReactNode;
    onOpenChange?: (open: boolean) => void;
    focus?: {
        enabled?: boolean;
        visibleOnly?: boolean;
    };
    groupId?: string;
    restMs?: number;
    delay?: number | {
        open?: number;
        close?: number;
    };
    disableAutoCloseOnScroll?: boolean;
}, "scope"> & {
    scope?: TooltipScopes;
} & React.RefAttributes<unknown>> & {
    Anchor: React.ForwardRefExoticComponent<Omit<PopoverAnchorProps, "scope"> & {
        scope?: TooltipScopes;
    } & React.RefAttributes<unknown>>;
    Arrow: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof import("@tamagui/stacks").StackVariants> & import("@tamagui/stacks").StackVariants & import("@tamagui/popper").PopperArrowExtraProps & React.RefAttributes<TamaguiElement>>;
    Content: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, "theme" | "debug" | "scope" | "hitSlop" | "pointerEvents" | "display" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "render" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onStartShouldSetResponder" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "elevationAndroid" | "rel" | "download" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "style" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMoveCapture" | "onPointerCancelCapture" | "onPointerDownCapture" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "position" | "x" | "y" | "perspective" | "scale" | "scaleX" | "scaleY" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "borderCurve" | "contain" | "cursor" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "outline" | "userSelect" | "backdropFilter" | "background" | "backgroundImage" | "backgroundOrigin" | "backgroundPosition" | "backgroundRepeat" | "backgroundSize" | "boxShadow" | "border" | "overflowX" | "overflowY" | "transformOrigin" | "filter" | "backgroundClip" | "backgroundBlendMode" | "backgroundAttachment" | "clipPath" | "caretColor" | "transformStyle" | "mask" | "maskImage" | "textEmphasis" | "borderImage" | "float" | "content" | "overflowBlock" | "overflowInline" | "maskBorder" | "maskBorderMode" | "maskBorderOutset" | "maskBorderRepeat" | "maskBorderSlice" | "maskBorderSource" | "maskBorderWidth" | "maskClip" | "maskComposite" | "maskMode" | "maskOrigin" | "maskPosition" | "maskRepeat" | "maskSize" | "maskType" | "gridRow" | "gridRowEnd" | "gridRowGap" | "gridRowStart" | "gridColumn" | "gridColumnEnd" | "gridColumnGap" | "gridColumnStart" | "gridTemplateColumns" | "gridTemplateAreas" | "containerType" | "blockSize" | "inlineSize" | "minBlockSize" | "maxBlockSize" | "objectFit" | "verticalAlign" | "minInlineSize" | "maxInlineSize" | "borderInlineColor" | "borderInlineStartColor" | "borderInlineEndColor" | "borderBlockWidth" | "borderBlockStartWidth" | "borderBlockEndWidth" | "borderInlineWidth" | "borderInlineStartWidth" | "borderInlineEndWidth" | "borderBlockStyle" | "borderBlockStartStyle" | "borderBlockEndStyle" | "borderInlineStyle" | "borderInlineStartStyle" | "borderInlineEndStyle" | "marginBlock" | "marginBlockStart" | "marginBlockEnd" | "marginInline" | "marginInlineStart" | "marginInlineEnd" | "paddingBlock" | "paddingBlockStart" | "paddingBlockEnd" | "paddingInline" | "paddingInlineStart" | "paddingInlineEnd" | "inset" | "insetBlock" | "insetBlockStart" | "insetBlockEnd" | "insetInline" | "insetInlineStart" | "insetInlineEnd" | "transition" | "animateOnly" | "animatePresence" | "passThrough" | "elevation" | "backfaceVisibility" | "backgroundColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "isolation" | "mixBlendMode" | "experimental_backgroundImage" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "bottom" | "boxSizing" | "end" | "flex" | "flexBasis" | "flexDirection" | "rowGap" | "gap" | "columnGap" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "right" | "start" | "top" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "size" | "transparent" | "fullscreen" | "circular" | "elevate" | "bordered" | "chromeless" | `$${string}` | `$${number}` | `$group-${string}` | `$group-${number}` | `$group-${string}-hover` | `$group-${string}-press` | `$group-${string}-focus` | `$group-${string}-focusVisible` | `$group-${string}-focusWithin` | `$group-${number}-hover` | `$group-${number}-press` | `$group-${number}-focus` | `$group-${number}-focusVisible` | `$group-${number}-focusWithin` | `$theme-${string}` | `$theme-${number}` | "branches" | "onEscapeKeyDown" | "onPointerDownOutside" | "onFocusOutside" | "onInteractOutside" | "forceUnmount" | "onBlurCapture" | "onFocusCapture" | "hoverStyle" | "pressStyle" | "focusStyle" | "focusWithinStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "animatePosition" | "enableAnimationForPositionChange" | "lazyMount" | "trapFocus" | "disableFocusScope" | "onOpenAutoFocus" | "onCloseAutoFocus" | "enableRemoveScroll" | "freezeContentsWhenHidden"> & Omit<import("@tamagui/popover").PopoverContentTypeProps, "scope"> & {
        scope?: TooltipScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/popover").PopoverContentTypeProps, "scope"> & {
        scope?: TooltipScopes;
    }, import("@tamagui/core").StackStyleBase, {
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Trigger: React.ForwardRefExoticComponent<Omit<PopoverTriggerProps, "scope"> & {
        scope?: TooltipScopes;
    } & React.RefAttributes<unknown>>;
};
export {};
//# sourceMappingURL=Tooltip.d.ts.map