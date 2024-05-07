import React from 'react';
import type { SizeTokens } from 'tamagui';
export declare const Showcase: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    inset?: number | SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
}>, "children" | "isInput" | "title" | "fileName" | "short"> & {
    children: React.ReactNode;
    title: string;
    fileName: string;
    short?: boolean | undefined;
    isInput?: boolean | undefined;
}, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & {
    children: React.ReactNode;
    title: string;
    fileName: string;
    short?: boolean | undefined;
    isInput?: boolean | undefined;
}, import("@tamagui/web").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    inset?: number | SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const PhoneScaleProvider: React.ProviderExoticComponent<Partial<{
    scale: number;
    invertScale: number;
}> & {
    children?: React.ReactNode;
    scope?: string | undefined;
}>, usePhoneScale: (scope?: string | undefined) => {
    scale: number;
    invertScale: number;
};
export declare const ShowcaseChildWrapper: import("tamagui").TamaguiComponent<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TamaguiComponentPropsBaseBase & import("react-native").ScrollViewProps, import("@tamagui/web").StackStyleBase & {
    readonly contentContainerStyle?: Partial<import("@tamagui/web").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/web").StackStyleBase, {}>> | undefined;
}, {
    fullscreen?: boolean | undefined;
}>, import("react-native").ScrollView, import("@tamagui/web").TamaguiComponentPropsBaseBase & import("react-native").ScrollViewProps & void, import("@tamagui/web").StackStyleBase & {
    readonly contentContainerStyle?: Partial<import("@tamagui/web").GetFinalProps<import("react-native").ScrollViewProps, import("@tamagui/web").StackStyleBase, {}>> | undefined;
}, {
    fullscreen?: boolean | undefined;
}, {
    accept: {
        readonly contentContainerStyle: "style";
    };
}>;
declare const ResizableBox: import("tamagui").TamaguiComponent<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    inset?: number | SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
}>, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, import("@tamagui/web").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    inset?: number | SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare function Hint({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export default ResizableBox;
/** ---------- SIZE CONTROLLER ----------- */
export declare const RawSizeProvider: React.ProviderExoticComponent<Partial<{
    sizes: SizeTokens[];
    setSizes: (sizes: SizeTokens[]) => void;
    size: SizeTokens;
    setSize: (size: SizeTokens) => void;
    showController: boolean;
    setShowController: (val: boolean) => void;
}> & {
    children?: React.ReactNode;
    scope?: string | undefined;
}>, useSize: (scope?: string | undefined) => {
    sizes: SizeTokens[];
    setSizes: (sizes: SizeTokens[]) => void;
    size: SizeTokens;
    setSize: (size: SizeTokens) => void;
    showController: boolean;
    setShowController: (val: boolean) => void;
};
export declare const WithSize: ({ children }: {
    children: any;
}) => React.FunctionComponentElement<{
    size: "unset" | "inherit" | "$0" | "$3" | "$5" | "$9" | "$15" | "$1" | "$10" | "$16" | "$2" | "$14" | "$11" | "$12" | "$4" | "$6" | "$7" | "$8" | "$13" | "$true" | "$0.25" | "$0.5" | "$0.75" | "$1.5" | "$2.5" | "$3.5" | "$4.5" | "$17" | "$18" | "$19" | "$20" | "auto" | (`${string}%` & {}) | import("@tamagui/web").UnionableNumber | `var(${string})` | `${number}vw` | `${number}dvw` | `${number}lvw` | `${number}svw` | `${number}vh` | `${number}dvh` | `${number}lvh` | `${number}svh` | `calc(${string})` | `min(${string})` | `max(${string})` | "max-content" | "min-content";
}>;
export declare const SizeController: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    size?: any;
    elevation?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, "theme" | "debug" | "userSelect" | "cursor" | "pointerEvents" | "alignContent" | "alignItems" | "alignSelf" | "bottom" | "backgroundColor" | "borderBottomColor" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomWidth" | "borderLeftColor" | "borderLeftWidth" | "borderColor" | "borderRadius" | "borderStyle" | "borderRightWidth" | "borderRightColor" | "borderTopColor" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopWidth" | "borderWidth" | "display" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "maxHeight" | "maxWidth" | "marginBottom" | "minHeight" | "minWidth" | "marginLeft" | "marginRight" | "marginTop" | "marginHorizontal" | "marginVertical" | "opacity" | "overflow" | "padding" | "paddingBottom" | "paddingLeft" | "position" | "paddingRight" | "paddingTop" | "paddingHorizontal" | "paddingVertical" | "right" | "shadowColor" | "shadowRadius" | "shadowOffset" | "shadowOpacity" | "top" | "width" | "zIndex" | "size" | "style" | "transform" | "space" | "outlineColor" | "children" | "className" | "elevation" | "x" | "y" | "perspective" | "scale" | "scaleX" | "scaleY" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "contain" | "touchAction" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "scrollbarWidth" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "animatePresence" | "transformOrigin" | "backfaceVisibility" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomEndRadius" | "borderBottomStartRadius" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderTopEndRadius" | "borderTopStartRadius" | "aspectRatio" | "borderEndWidth" | "borderStartWidth" | "end" | "rowGap" | "gap" | "columnGap" | "marginEnd" | "marginStart" | "paddingEnd" | "paddingStart" | "start" | "direction" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "inset" | "fullscreen" | "unstyled" | "hitSlop" | "onStartShouldSetResponder" | "dataSet" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "href" | "hrefAttrs" | "elevationAndroid" | "rel" | "download" | "focusable" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "id" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "role" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "themeShallow" | "themeInverse" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "hoverStyle" | "pressStyle" | "focusStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "transparent" | "hoverTheme" | "pressTheme" | "backgrounded" | "circular" | "focusTheme" | "elevate" | "bordered" | "radiused" | "padded" | "chromeless" | `$${string}` | `$${number}` | "orientation" | "disablePassBorderRadius" | `$theme-${string}` | `$theme-${number}` | "axis" | "scrollable" | "showScrollIndicator" | "forceUseItem" | "__scopeGroup"> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "inset" | "fullscreen" | "unstyled" | "transparent" | "hoverTheme" | "pressTheme" | "backgrounded" | "circular" | "focusTheme" | "elevate" | "bordered" | "radiused" | "padded" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    unstyled?: boolean | undefined;
    size?: any;
    elevation?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    unstyled?: boolean | undefined;
    size?: any;
    elevation?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    size?: any;
    elevation?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & {
    axis?: "horizontal" | "vertical" | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    scrollable?: boolean | undefined;
    showScrollIndicator?: boolean | undefined;
    disabled?: boolean | undefined;
    disablePassBorderRadius?: (boolean | "bottom" | "top" | "end" | "start") | undefined;
    forceUseItem?: boolean | undefined;
} & {
    __scopeGroup?: import("tamagui").Scope;
}, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "inset" | "fullscreen" | "unstyled" | "transparent" | "hoverTheme" | "pressTheme" | "backgrounded" | "circular" | "focusTheme" | "elevate" | "bordered" | "radiused" | "padded" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    unstyled?: boolean | undefined;
    size?: any;
    elevation?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    unstyled?: boolean | undefined;
    size?: any;
    elevation?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    size?: any;
    elevation?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & {
    axis?: "horizontal" | "vertical" | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    scrollable?: boolean | undefined;
    showScrollIndicator?: boolean | undefined;
    disabled?: boolean | undefined;
    disablePassBorderRadius?: (boolean | "bottom" | "top" | "end" | "start") | undefined;
    forceUseItem?: boolean | undefined;
} & {
    __scopeGroup?: import("tamagui").Scope;
} & void, import("@tamagui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    size?: any;
    elevation?: number | SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    inset?: number | SizeTokens | {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
//# sourceMappingURL=_Showcase.d.ts.map