import '@tamagui/polyfill-dev';
import { type Delay } from '@tamagui/floating';
import type { TamaguiElement } from '@tamagui/core';
import type { PopoverAnchorProps, PopoverContentProps, PopoverTriggerProps } from '@tamagui/popover';
import type { PopperArrowProps, PopperProps } from '@tamagui/popper';
import * as React from 'react';
export type TooltipScopes = string;
type ScopedProps<P> = Omit<P, 'scope'> & {
    scope?: TooltipScopes;
};
export type TooltipContentProps = ScopedProps<PopoverContentProps>;
export type TooltipProps = ScopedProps<PopperProps & {
    open?: boolean;
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
    /**
     * z-index for the tooltip portal. Use this when tooltips need to appear
     * above other portaled content like dialogs.
     */
    zIndex?: number;
}>;
export declare const TooltipGroup: ({ children, delay, preventAnimation, timeoutMs, }: {
    children?: any;
    delay: Delay;
    preventAnimation?: boolean;
    timeoutMs?: number;
}) => React.JSX.Element;
export declare const closeOpenTooltips: () => void;
export declare const Tooltip: ((props: Omit<PopperProps & {
    open?: boolean;
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
    /**
     * z-index for the tooltip portal. Use this when tooltips need to appear
     * above other portaled content like dialogs.
     */
    zIndex?: number;
}, "scope"> & {
    scope?: TooltipScopes;
} & import("@tamagui/core").RefProp<unknown>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Anchor: import("@tamagui/core").RefComponent<unknown, ScopedProps<PopoverAnchorProps>>;
    Arrow: import("@tamagui/core").RefComponent<TamaguiElement, PopperArrowProps>;
    Content: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | false | import("@tamagui/core").Size | undefined;
    }>, "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "alignContent" | "alignItems" | "alignSelf" | "alwaysDisable" | "animateOnly" | "animatePosition" | "animatePresence" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "aspectRatio" | "backdropFilter" | "backfaceVisibility" | "background" | "backgroundAttachment" | "backgroundBlendMode" | "backgroundClip" | "backgroundColor" | "backgroundImage" | "backgroundOrigin" | "backgroundPosition" | "backgroundRepeat" | "backgroundSize" | "blockSize" | "border" | "borderBlock" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockEndStyle" | "borderBlockEndWidth" | "borderBlockStartColor" | "borderBlockStartStyle" | "borderBlockStartWidth" | "borderBlockStyle" | "borderBlockWidth" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderEndWidth" | "borderImage" | "borderInline" | "borderInlineColor" | "borderInlineEndColor" | "borderInlineEndStyle" | "borderInlineEndWidth" | "borderInlineStartColor" | "borderInlineStartStyle" | "borderInlineStartWidth" | "borderInlineStyle" | "borderInlineWidth" | "borderLeftColor" | "borderLeftWidth" | "borderRadius" | "borderRightColor" | "borderRightWidth" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStartWidth" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderTopWidth" | "borderWidth" | "bottom" | "boxShadow" | "boxSizing" | "branches" | "caretColor" | "children" | "className" | "clipPath" | "collapsable" | "collapsableChildren" | "color" | "columnGap" | "contain" | "container" | "containerName" | "containerType" | "cursor" | "dangerouslySetInnerHTML" | "debug" | "direction" | "disableClassName" | "disableFocusScope" | "disableNativeStyle" | "disableOptimization" | "disabled" | "display" | "enableRemoveScroll" | "end" | "experimental_backgroundImage" | "experimental_backgroundPosition" | "experimental_backgroundRepeat" | "experimental_backgroundSize" | "filter" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "float" | "forceMount" | "forceStyle" | "forceUnmount" | "freezeContentsWhenHidden" | "gap" | "gridColumn" | "gridColumnEnd" | "gridColumnGap" | "gridColumnStart" | "gridRow" | "gridRowEnd" | "gridRowGap" | "gridRowStart" | "gridTemplateAreas" | "gridTemplateColumns" | "group" | "hasTVPreferredFocus" | "height" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "inlineSize" | "inset" | "insetBlock" | "insetBlockEnd" | "insetBlockStart" | "insetInline" | "insetInlineEnd" | "insetInlineStart" | "isTVSelectable" | "isolation" | "justifyContent" | "lazyMount" | "left" | "margin" | "marginBlock" | "marginBlockEnd" | "marginBlockStart" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginInline" | "marginInlineEnd" | "marginInlineStart" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "mask" | "maskBorder" | "maskBorderMode" | "maskBorderOutset" | "maskBorderRepeat" | "maskBorderSlice" | "maskBorderSource" | "maskBorderWidth" | "maskClip" | "maskComposite" | "maskImage" | "maskMode" | "maskOrigin" | "maskPosition" | "maskRepeat" | "maskSize" | "maskType" | "matrix" | "maxBlockSize" | "maxHeight" | "maxInlineSize" | "maxWidth" | "minBlockSize" | "minHeight" | "minInlineSize" | "minWidth" | "mixBlendMode" | "name" | "nativeID" | "needsOffscreenAlphaCompositing" | "objectFit" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onBlurCapture" | "onChange" | "onClick" | "onCloseAutoFocus" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onEscapeKeyDown" | "onFocus" | "onFocusCapture" | "onFocusOutside" | "onInput" | "onInteractOutside" | "onKeyDown" | "onKeyUp" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onOpenAutoFocus" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerDownOutside" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onScroll" | "onTouchCancel" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchStart" | "onTransition" | "onWheel" | "opacity" | "outline" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "overflow" | "overflowBlock" | "overflowInline" | "overflowWrap" | "overflowX" | "overflowY" | "padding" | "paddingBlock" | "paddingBlockEnd" | "paddingBlockStart" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingInline" | "paddingInlineEnd" | "paddingInlineStart" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "passThrough" | "perspective" | "pointerEvents" | "position" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "resize" | "right" | "role" | "rotate" | "rotateX" | "rotateY" | "rotateZ" | "rotation" | "rowGap" | "scale" | "scaleX" | "scaleY" | "scope" | "screenReaderFocusable" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "shouldRasterizeIOS" | "skewX" | "skewY" | "start" | "style" | "tabIndex" | "target" | "testID" | "textEmphasis" | "textWrap" | "theme" | "themeShallow" | "top" | "transform" | "transformMatrix" | "transformOrigin" | "transformStyle" | "transition" | "translateX" | "translateY" | "trapFocus" | "tvParallaxMagnification" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "untilMeasured" | "userSelect" | "verticalAlign" | "visibility" | "width" | "wordWrap" | "x" | "y" | "zIndex"> & Omit<import("@tamagui/popover").PopoverContentTypeProps, "scope"> & {
        scope?: TooltipScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/popover").PopoverContentTypeProps, "scope"> & {
        scope?: TooltipScopes;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | false | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Trigger: import("@tamagui/core").RefComponent<unknown, ScopedProps<PopoverTriggerProps>>;
};
export {};
//# sourceMappingURL=Tooltip.d.ts.map