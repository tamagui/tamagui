import { type Stack } from '@tamagui/core';
import React from 'react';
import type { View } from 'react-native';
type TamaguiElement = HTMLElement | View;
export declare function useAccordion<T extends 'single' | 'multiple'>(type: T, params: T extends 'single' ? AccordionImplSingleProps : AccordionImplMultipleProps, contextScope?: string): {
    AccordionImplProvider: React.Provider<AccordionImplContextValue | null>;
    accordionImplProviderValue: {
        disabled: boolean | undefined;
        direction: "ltr" | "rtl";
        orientation: "horizontal" | "vertical";
    };
    Collection: {
        readonly Provider: React.FC<{
            children?: React.ReactNode;
            __scopeCollection: string;
        }>;
        readonly Slot: React.ForwardRefExoticComponent<import("@tamagui/collection/types/Collection").CollectionProps & {
            __scopeCollection?: string | undefined;
        } & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
        readonly ItemSlot: React.ForwardRefExoticComponent<{
            children: React.ReactNode;
        } & {
            __scopeCollection?: string | undefined;
        } & React.RefAttributes<TamaguiElement>>;
    };
    collectionProviderProps: {
        __scopeCollection: string;
    };
    collectionSlotProps: {
        __scopeCollection: string;
    };
    CollapsibleProvider: React.Provider<any>;
    frameProps: {
        /**
         *  The callback that fires when the state of the accordion changes. for use with `useAccordion`
         * @param selected - The values of the accordion items whose contents are expanded.
         */
        control?(selected: string[]): void;
        theme?: string | null | undefined;
        debug?: import("@tamagui/core").DebugProp | undefined;
        hitSlop?: number | import("@tamagui/core").Insets | undefined;
        pointerEvents?: "unset" | "box-none" | "none" | "box-only" | "auto" | undefined;
        display?: "flex" | "unset" | "none" | "inherit" | "inline" | "block" | "contents" | "inline-flex" | undefined;
        children?: any;
        onStartShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        dataSet?: Record<string, string | number | null | undefined> | undefined;
        onScrollShouldSetResponder?: unknown;
        onScrollShouldSetResponderCapture?: unknown;
        onSelectionChangeShouldSetResponder?: unknown;
        onSelectionChangeShouldSetResponderCapture?: unknown;
        onLayout?: ((event: import("react-native").LayoutChangeEvent) => void) | undefined;
        href?: string | undefined;
        hrefAttrs?: {
            target?: "top" | "_blank" | "_self" | "_top" | "blank" | "self" | undefined;
            rel?: string | undefined;
            download?: boolean | undefined;
        } | undefined;
        elevationAndroid?: string | number | undefined;
        rel?: any;
        download?: any;
        focusable?: boolean | undefined;
        onMoveShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onResponderEnd?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderGrant?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderReject?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderMove?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderRelease?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderStart?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderTerminationRequest?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onResponderTerminate?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onStartShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onMoveShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        id?: string | undefined;
        removeClippedSubviews?: boolean | undefined;
        testID?: string | undefined;
        nativeID?: string | undefined;
        collapsable?: boolean | undefined;
        needsOffscreenAlphaCompositing?: boolean | undefined;
        renderToHardwareTextureAndroid?: boolean | undefined;
        shouldRasterizeIOS?: boolean | undefined;
        isTVSelectable?: boolean | undefined;
        hasTVPreferredFocus?: boolean | undefined;
        tvParallaxProperties?: import("react-native").TVParallaxProperties | undefined;
        tvParallaxShiftDistanceX?: number | undefined;
        tvParallaxShiftDistanceY?: number | undefined;
        tvParallaxTiltAngle?: number | undefined;
        tvParallaxMagnification?: number | undefined;
        onTouchStart?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onTouchMove?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onTouchEnd?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onTouchCancel?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onTouchEndCapture?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onPointerEnter?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerEnterCapture?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerLeave?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerLeaveCapture?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerMove?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerMoveCapture?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerCancel?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerCancelCapture?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerDown?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerDownCapture?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerUp?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerUpCapture?: ((event: import("react-native").PointerEvent) => void) | undefined;
        accessible?: boolean | undefined;
        accessibilityActions?: readonly Readonly<{
            name: string;
            label?: string | undefined;
        }>[] | undefined;
        accessibilityLabel?: string | undefined;
        'aria-label'?: string | undefined;
        accessibilityRole?: import("react-native").AccessibilityRole | undefined;
        accessibilityState?: import("react-native").AccessibilityState | undefined;
        'aria-busy'?: boolean | undefined;
        'aria-checked'?: boolean | "mixed" | undefined;
        'aria-disabled'?: boolean | undefined;
        'aria-expanded'?: boolean | undefined;
        'aria-selected'?: boolean | undefined;
        'aria-labelledby'?: string | undefined;
        accessibilityHint?: string | undefined;
        accessibilityValue?: import("react-native").AccessibilityValue | undefined;
        'aria-valuemax'?: number | undefined;
        'aria-valuemin'?: number | undefined;
        'aria-valuenow'?: number | undefined;
        'aria-valuetext'?: string | undefined;
        onAccessibilityAction?: ((event: import("react-native").AccessibilityActionEvent) => void) | undefined;
        importantForAccessibility?: "auto" | "yes" | "no" | "no-hide-descendants" | undefined;
        'aria-hidden'?: boolean | undefined;
        'aria-live'?: "polite" | "assertive" | "off" | undefined;
        'aria-modal'?: boolean | undefined;
        role?: import("react-native").Role | undefined;
        accessibilityLiveRegion?: "none" | "polite" | "assertive" | undefined;
        accessibilityLabelledBy?: string | string[] | undefined;
        accessibilityElementsHidden?: boolean | undefined;
        accessibilityViewIsModal?: boolean | undefined;
        onAccessibilityEscape?: (() => void) | undefined;
        onAccessibilityTap?: (() => void) | undefined;
        onMagicTap?: (() => void) | undefined;
        accessibilityIgnoresInvertColors?: boolean | undefined;
        accessibilityLanguage?: string | undefined;
        target?: string | undefined;
        htmlFor?: string | undefined;
        asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
        dangerouslySetInnerHTML?: {
            __html: string;
        } | undefined;
        className?: string | undefined;
        themeShallow?: boolean | undefined;
        themeInverse?: boolean | undefined;
        tag?: "object" | "map" | "button" | "search" | "header" | "summary" | "menu" | "article" | "dialog" | "figure" | "form" | "img" | "main" | "meter" | "option" | "table" | (string & {}) | "address" | "aside" | "footer" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "nav" | "section" | "blockquote" | "dd" | "div" | "dl" | "dt" | "figcaption" | "hr" | "li" | "ol" | "ul" | "p" | "pre" | "a" | "abbr" | "b" | "bdi" | "bdo" | "br" | "cite" | "code" | "data" | "dfn" | "em" | "i" | "kbd" | "mark" | "q" | "rp" | "rt" | "rtc" | "ruby" | "s" | "samp" | "small" | "span" | "strong" | "sub" | "sup" | "time" | "u" | "var" | "wbr" | "area" | "audio" | "track" | "video" | "embed" | "param" | "picture" | "source" | "canvas" | "noscript" | "script" | "del" | "ins" | "caption" | "col" | "colgroup" | "thead" | "tbody" | "td" | "th" | "tr" | "datalist" | "fieldset" | "input" | "label" | "legend" | "optgroup" | "output" | "progress" | "select" | "textarea" | "details" | "template" | undefined;
        group?: boolean | undefined;
        untilMeasured?: "hide" | "show" | undefined;
        componentName?: string | undefined;
        tabIndex?: string | number | undefined;
        disableOptimization?: boolean | undefined;
        forceStyle?: "hover" | "press" | "focus" | "focusVisible" | undefined;
        disableClassName?: boolean | undefined;
        onPress?: ((event: import("react-native").GestureResponderEvent) => void) | null | undefined;
        onLongPress?: ((event: import("react-native").GestureResponderEvent) => void) | null | undefined;
        onPressIn?: ((event: import("react-native").GestureResponderEvent) => void) | null | undefined;
        onPressOut?: ((event: import("react-native").GestureResponderEvent) => void) | null | undefined;
        onHoverIn?: React.MouseEventHandler<HTMLDivElement> | undefined;
        onHoverOut?: React.MouseEventHandler<HTMLDivElement> | undefined;
        onMouseEnter?: React.MouseEventHandler<HTMLDivElement> | undefined;
        onMouseLeave?: React.MouseEventHandler<HTMLDivElement> | undefined;
        onMouseDown?: React.MouseEventHandler<HTMLDivElement> | undefined;
        onMouseUp?: React.MouseEventHandler<HTMLDivElement> | undefined;
        onFocus?: React.FocusEventHandler<HTMLDivElement> | undefined;
        onBlur?: React.FocusEventHandler<HTMLDivElement> | undefined;
        x?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"x"> | undefined;
        y?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"y"> | undefined;
        perspective?: number | "unset" | undefined;
        scale?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"scale"> | undefined;
        scaleX?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"scaleX"> | undefined;
        scaleY?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"scaleY"> | undefined;
        skewX?: string | undefined;
        skewY?: string | undefined;
        matrix?: "unset" | number[] | undefined;
        rotate?: "unset" | import("@tamagui/core").UnionableString | `${number}deg` | undefined;
        rotateY?: "unset" | import("@tamagui/core").UnionableString | `${number}deg` | undefined;
        rotateX?: "unset" | import("@tamagui/core").UnionableString | `${number}deg` | undefined;
        rotateZ?: "unset" | import("@tamagui/core").UnionableString | `${number}deg` | undefined;
        contain?: import("csstype").Property.Contain | undefined;
        touchAction?: import("csstype").Property.TouchAction | undefined;
        cursor?: import("csstype").Property.Cursor | undefined;
        outlineColor?: "unset" | import("@tamagui/core").GetThemeValueForKey<"outlineColor"> | undefined;
        outlineOffset?: "unset" | import("@tamagui/core").SpaceValue | undefined;
        outlineStyle?: import("csstype").Property.OutlineStyle | undefined;
        outlineWidth?: "unset" | import("@tamagui/core").SpaceValue | undefined;
        userSelect?: import("csstype").Property.UserSelect | undefined;
        scrollbarWidth?: import("csstype").Property.ScrollbarWidth | undefined;
        space?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"space"> | undefined;
        spaceDirection?: "unset" | import("@tamagui/core").SpaceDirection | undefined;
        separator?: React.ReactNode;
        animation?: import("@tamagui/core").AnimationProp | null | undefined;
        animateOnly?: string[] | "unset" | undefined;
        animatePresence?: boolean | "unset" | undefined;
        transformOrigin?: "bottom" | "left" | "right" | "top" | "unset" | (`${string}%` | `${string}px` | `${number}px` | `${number}%`) | "center" | "left bottom" | "left top" | `left ${string}%` | `left ${string}px` | `left ${number}px` | `left ${number}%` | "left center" | "right bottom" | "right top" | `right ${string}%` | `right ${string}px` | `right ${number}px` | `right ${number}%` | "right center" | `${string}% bottom` | `${string}% top` | `${string}% ${string}%` | `${string}% ${string}px` | `${string}% ${number}px` | `${string}% ${number}%` | `${string}% center` | `${string}px bottom` | `${string}px top` | `${string}px ${string}%` | `${string}px ${string}px` | `${string}px ${number}px` | `${string}px ${number}%` | `${string}px center` | `${number}px bottom` | `${number}px top` | `${number}px ${string}%` | `${number}px ${string}px` | `${number}px ${number}px` | `${number}px ${number}%` | `${number}px center` | `${number}% bottom` | `${number}% top` | `${number}% ${string}%` | `${number}% ${string}px` | `${number}% ${number}px` | `${number}% ${number}%` | `${number}% center` | "center bottom" | "center top" | `center ${string}%` | `center ${string}px` | `center ${number}px` | `center ${number}%` | "center center" | `left bottom ${string}px` | `left bottom ${number}px` | `left top ${string}px` | `left top ${number}px` | `left ${string}% ${string}px` | `left ${string}% ${number}px` | `left ${string}px ${string}px` | `left ${string}px ${number}px` | `left ${number}px ${string}px` | `left ${number}px ${number}px` | `left ${number}% ${string}px` | `left ${number}% ${number}px` | `left center ${string}px` | `left center ${number}px` | `right bottom ${string}px` | `right bottom ${number}px` | `right top ${string}px` | `right top ${number}px` | `right ${string}% ${string}px` | `right ${string}% ${number}px` | `right ${string}px ${string}px` | `right ${string}px ${number}px` | `right ${number}px ${string}px` | `right ${number}px ${number}px` | `right ${number}% ${string}px` | `right ${number}% ${number}px` | `right center ${string}px` | `right center ${number}px` | `${string}% bottom ${string}px` | `${string}% bottom ${number}px` | `${string}% top ${string}px` | `${string}% top ${number}px` | `${string}% ${string}% ${string}px` | `${string}% ${string}% ${number}px` | `${string}% ${string}px ${string}px` | `${string}% ${string}px ${number}px` | `${string}% ${number}px ${string}px` | `${string}% ${number}px ${number}px` | `${string}% ${number}% ${string}px` | `${string}% ${number}% ${number}px` | `${string}% center ${string}px` | `${string}% center ${number}px` | `${string}px bottom ${string}px` | `${string}px bottom ${number}px` | `${string}px top ${string}px` | `${string}px top ${number}px` | `${string}px ${string}% ${string}px` | `${string}px ${string}% ${number}px` | `${string}px ${string}px ${string}px` | `${string}px ${string}px ${number}px` | `${string}px ${number}px ${string}px` | `${string}px ${number}px ${number}px` | `${string}px ${number}% ${string}px` | `${string}px ${number}% ${number}px` | `${string}px center ${string}px` | `${string}px center ${number}px` | `${number}px bottom ${string}px` | `${number}px bottom ${number}px` | `${number}px top ${string}px` | `${number}px top ${number}px` | `${number}px ${string}% ${string}px` | `${number}px ${string}% ${number}px` | `${number}px ${string}px ${string}px` | `${number}px ${string}px ${number}px` | `${number}px ${number}px ${string}px` | `${number}px ${number}px ${number}px` | `${number}px ${number}% ${string}px` | `${number}px ${number}% ${number}px` | `${number}px center ${string}px` | `${number}px center ${number}px` | `${number}% bottom ${string}px` | `${number}% bottom ${number}px` | `${number}% top ${string}px` | `${number}% top ${number}px` | `${number}% ${string}% ${string}px` | `${number}% ${string}% ${number}px` | `${number}% ${string}px ${string}px` | `${number}% ${string}px ${number}px` | `${number}% ${number}px ${string}px` | `${number}% ${number}px ${number}px` | `${number}% ${number}% ${string}px` | `${number}% ${number}% ${number}px` | `${number}% center ${string}px` | `${number}% center ${number}px` | `center bottom ${string}px` | `center bottom ${number}px` | `center top ${string}px` | `center top ${number}px` | `center ${string}% ${string}px` | `center ${string}% ${number}px` | `center ${string}px ${string}px` | `center ${string}px ${number}px` | `center ${number}px ${string}px` | `center ${number}px ${number}px` | `center ${number}% ${string}px` | `center ${number}% ${number}px` | `center center ${string}px` | `center center ${number}px` | undefined;
        backfaceVisibility?: "unset" | "hidden" | "visible" | undefined;
        backgroundColor?: "unset" | import("@tamagui/core").GetThemeValueForKey<"backgroundColor"> | import("react-native").OpaqueColorValue | undefined;
        borderBlockColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"borderBlockColor"> | undefined;
        borderBlockEndColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"borderBlockEndColor"> | undefined;
        borderBlockStartColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"borderBlockStartColor"> | undefined;
        borderBottomColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"borderBottomColor"> | undefined;
        borderBottomEndRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderBottomLeftRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderBottomRightRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderBottomStartRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"borderColor"> | undefined;
        borderCurve?: "unset" | "circular" | "continuous" | undefined;
        borderEndColor?: import("react-native").ColorValue | undefined;
        borderEndEndRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderEndStartRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderLeftColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"borderLeftColor"> | undefined;
        borderRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderRightColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"borderRightColor"> | undefined;
        borderStartColor?: import("react-native").ColorValue | undefined;
        borderStartEndRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderStartStartRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderStyle?: "unset" | "dashed" | "dotted" | "solid" | undefined;
        borderTopColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"borderTopColor"> | undefined;
        borderTopEndRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderTopLeftRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderTopRightRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderTopStartRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        opacity?: "unset" | import("react-native").AnimatableNumericValue | undefined;
        alignContent?: "unset" | "center" | "flex-start" | "flex-end" | "stretch" | "space-between" | "space-around" | undefined;
        alignItems?: "unset" | import("react-native").FlexAlignType | undefined;
        alignSelf?: "unset" | "auto" | import("react-native").FlexAlignType | undefined;
        aspectRatio?: string | number | undefined;
        borderBottomWidth?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"borderBottomWidth"> | undefined;
        borderEndWidth?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"borderEndWidth"> | undefined;
        borderLeftWidth?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"borderLeftWidth"> | undefined;
        borderRightWidth?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"borderRightWidth"> | undefined;
        borderStartWidth?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"borderStartWidth"> | undefined;
        borderTopWidth?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"borderTopWidth"> | undefined;
        borderWidth?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"borderWidth"> | undefined;
        bottom?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"bottom"> | null | undefined;
        end?: "unset" | import("react-native").DimensionValue | undefined;
        flex?: number | "unset" | undefined;
        flexBasis?: "unset" | import("react-native").DimensionValue | undefined;
        flexDirection?: "unset" | "row" | "column" | "row-reverse" | "column-reverse" | undefined;
        rowGap?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"rowGap"> | undefined;
        gap?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"gap"> | undefined;
        columnGap?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"columnGap"> | undefined;
        flexGrow?: number | "unset" | undefined;
        flexShrink?: number | "unset" | undefined;
        flexWrap?: "unset" | "wrap" | "nowrap" | "wrap-reverse" | undefined;
        height?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"height"> | null | undefined;
        justifyContent?: "unset" | "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly" | undefined;
        left?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"left"> | null | undefined;
        margin?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"margin"> | null | undefined;
        marginBottom?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"marginBottom"> | null | undefined;
        marginEnd?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"marginEnd"> | null | undefined;
        marginHorizontal?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"marginHorizontal"> | null | undefined;
        marginLeft?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"marginLeft"> | null | undefined;
        marginRight?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"marginRight"> | null | undefined;
        marginStart?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"marginStart"> | null | undefined;
        marginTop?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"marginTop"> | null | undefined;
        marginVertical?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"marginVertical"> | null | undefined;
        maxHeight?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"maxHeight"> | null | undefined;
        maxWidth?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"maxWidth"> | null | undefined;
        minHeight?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"minHeight"> | null | undefined;
        minWidth?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"minWidth"> | null | undefined;
        overflow?: "unset" | "hidden" | "visible" | "scroll" | undefined;
        padding?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"padding"> | null | undefined;
        paddingBottom?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"paddingBottom"> | null | undefined;
        paddingEnd?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"paddingEnd"> | null | undefined;
        paddingHorizontal?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"paddingHorizontal"> | null | undefined;
        paddingLeft?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"paddingLeft"> | null | undefined;
        paddingRight?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"paddingRight"> | null | undefined;
        paddingStart?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"paddingStart"> | null | undefined;
        paddingTop?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"paddingTop"> | null | undefined;
        paddingVertical?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"paddingVertical"> | null | undefined;
        position?: "unset" | "absolute" | "relative" | undefined;
        right?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"right"> | null | undefined;
        start?: "unset" | import("react-native").DimensionValue | undefined;
        top?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"top"> | null | undefined;
        width?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"width"> | null | undefined;
        zIndex?: "unset" | import("@tamagui/core").GetThemeValueForKey<"zIndex"> | undefined;
        direction?: "ltr" | "rtl" | "unset" | "inherit" | undefined;
        shadowColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"shadowColor"> | undefined;
        shadowOffset?: "unset" | import("@tamagui/core").GetThemeValueForKey<"shadowOffset"> | Readonly<{
            width: number;
            height: number;
        }> | undefined;
        shadowOpacity?: "unset" | import("react-native").AnimatableNumericValue | undefined;
        shadowRadius?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"shadowRadius"> | undefined;
        transform?: string | (({
            perspective: import("react-native").AnimatableNumericValue;
        } & {
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            scale: import("react-native").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            scaleX: import("react-native").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            scaleY: import("react-native").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            skewX: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            skewY: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            matrix: import("react-native").AnimatableNumericValue[];
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            rotate: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            rotateY: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            rotateX: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            rotateZ: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            translateX: import("react-native").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateY?: undefined;
        }) | ({
            translateY: import("react-native").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
        }))[] | undefined;
        transformMatrix?: "unset" | number[] | undefined;
        rotation?: "unset" | import("react-native").AnimatableNumericValue | undefined;
        translateX?: "unset" | import("react-native").AnimatableNumericValue | undefined;
        translateY?: "unset" | import("react-native").AnimatableNumericValue | undefined;
        hoverStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>) | null | undefined;
        pressStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>) | null | undefined;
        focusStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>) | null | undefined;
        focusVisibleStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>) | null | undefined;
        disabledStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>) | null | undefined;
        exitStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>) | null | undefined;
        enterStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>) | null | undefined;
        key?: React.Key | null | undefined;
        onKeyDown?: import("@tamagui/core").EventHandler<KeyboardEvent> | undefined;
        'data-orientation': "horizontal" | "vertical";
        ref: (node: TamaguiElement) => void;
    } | {
        /**
         *  The callback that fires when the state of the accordion changes. for use with `useAccordion`
         * @param selected - The values of the accordion items whose contents are expanded.
         */
        control?(selected: string[]): void;
        theme?: string | null | undefined;
        debug?: import("@tamagui/core").DebugProp | undefined;
        hitSlop?: number | import("@tamagui/core").Insets | undefined;
        pointerEvents?: "unset" | "box-none" | "none" | "box-only" | "auto" | undefined;
        display?: "flex" | "unset" | "none" | "inherit" | "inline" | "block" | "contents" | "inline-flex" | undefined;
        children?: any;
        onStartShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        dataSet?: Record<string, string | number | null | undefined> | undefined;
        onScrollShouldSetResponder?: unknown;
        onScrollShouldSetResponderCapture?: unknown;
        onSelectionChangeShouldSetResponder?: unknown;
        onSelectionChangeShouldSetResponderCapture?: unknown;
        onLayout?: ((event: import("react-native").LayoutChangeEvent) => void) | undefined;
        href?: string | undefined;
        hrefAttrs?: {
            target?: "top" | "_blank" | "_self" | "_top" | "blank" | "self" | undefined;
            rel?: string | undefined;
            download?: boolean | undefined;
        } | undefined;
        elevationAndroid?: string | number | undefined;
        rel?: any;
        download?: any;
        focusable?: boolean | undefined;
        onMoveShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onResponderEnd?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderGrant?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderReject?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderMove?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderRelease?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderStart?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onResponderTerminationRequest?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onResponderTerminate?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onStartShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        onMoveShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined;
        style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        id?: string | undefined;
        removeClippedSubviews?: boolean | undefined;
        testID?: string | undefined;
        nativeID?: string | undefined;
        collapsable?: boolean | undefined;
        needsOffscreenAlphaCompositing?: boolean | undefined;
        renderToHardwareTextureAndroid?: boolean | undefined;
        shouldRasterizeIOS?: boolean | undefined;
        isTVSelectable?: boolean | undefined;
        hasTVPreferredFocus?: boolean | undefined;
        tvParallaxProperties?: import("react-native").TVParallaxProperties | undefined;
        tvParallaxShiftDistanceX?: number | undefined;
        tvParallaxShiftDistanceY?: number | undefined;
        tvParallaxTiltAngle?: number | undefined;
        tvParallaxMagnification?: number | undefined;
        onTouchStart?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onTouchMove?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onTouchEnd?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onTouchCancel?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onTouchEndCapture?: ((event: import("react-native").GestureResponderEvent) => void) | undefined;
        onPointerEnter?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerEnterCapture?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerLeave?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerLeaveCapture?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerMove?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerMoveCapture?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerCancel?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerCancelCapture?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerDown?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerDownCapture?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerUp?: ((event: import("react-native").PointerEvent) => void) | undefined;
        onPointerUpCapture?: ((event: import("react-native").PointerEvent) => void) | undefined;
        accessible?: boolean | undefined;
        accessibilityActions?: readonly Readonly<{
            name: string;
            label?: string | undefined;
        }>[] | undefined;
        accessibilityLabel?: string | undefined;
        'aria-label'?: string | undefined;
        accessibilityRole?: import("react-native").AccessibilityRole | undefined;
        accessibilityState?: import("react-native").AccessibilityState | undefined;
        'aria-busy'?: boolean | undefined;
        'aria-checked'?: boolean | "mixed" | undefined;
        'aria-disabled'?: boolean | undefined;
        'aria-expanded'?: boolean | undefined;
        'aria-selected'?: boolean | undefined;
        'aria-labelledby'?: string | undefined;
        accessibilityHint?: string | undefined;
        accessibilityValue?: import("react-native").AccessibilityValue | undefined;
        'aria-valuemax'?: number | undefined;
        'aria-valuemin'?: number | undefined;
        'aria-valuenow'?: number | undefined;
        'aria-valuetext'?: string | undefined;
        onAccessibilityAction?: ((event: import("react-native").AccessibilityActionEvent) => void) | undefined;
        importantForAccessibility?: "auto" | "yes" | "no" | "no-hide-descendants" | undefined;
        'aria-hidden'?: boolean | undefined;
        'aria-live'?: "polite" | "assertive" | "off" | undefined;
        'aria-modal'?: boolean | undefined;
        role?: import("react-native").Role | undefined;
        accessibilityLiveRegion?: "none" | "polite" | "assertive" | undefined;
        accessibilityLabelledBy?: string | string[] | undefined;
        accessibilityElementsHidden?: boolean | undefined;
        accessibilityViewIsModal?: boolean | undefined;
        onAccessibilityEscape?: (() => void) | undefined;
        onAccessibilityTap?: (() => void) | undefined;
        onMagicTap?: (() => void) | undefined;
        accessibilityIgnoresInvertColors?: boolean | undefined;
        accessibilityLanguage?: string | undefined;
        target?: string | undefined;
        htmlFor?: string | undefined;
        asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
        dangerouslySetInnerHTML?: {
            __html: string;
        } | undefined;
        className?: string | undefined;
        themeShallow?: boolean | undefined;
        themeInverse?: boolean | undefined;
        tag?: "object" | "map" | "button" | "search" | "header" | "summary" | "menu" | "article" | "dialog" | "figure" | "form" | "img" | "main" | "meter" | "option" | "table" | (string & {}) | "address" | "aside" | "footer" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "nav" | "section" | "blockquote" | "dd" | "div" | "dl" | "dt" | "figcaption" | "hr" | "li" | "ol" | "ul" | "p" | "pre" | "a" | "abbr" | "b" | "bdi" | "bdo" | "br" | "cite" | "code" | "data" | "dfn" | "em" | "i" | "kbd" | "mark" | "q" | "rp" | "rt" | "rtc" | "ruby" | "s" | "samp" | "small" | "span" | "strong" | "sub" | "sup" | "time" | "u" | "var" | "wbr" | "area" | "audio" | "track" | "video" | "embed" | "param" | "picture" | "source" | "canvas" | "noscript" | "script" | "del" | "ins" | "caption" | "col" | "colgroup" | "thead" | "tbody" | "td" | "th" | "tr" | "datalist" | "fieldset" | "input" | "label" | "legend" | "optgroup" | "output" | "progress" | "select" | "textarea" | "details" | "template" | undefined;
        group?: boolean | undefined;
        untilMeasured?: "hide" | "show" | undefined;
        componentName?: string | undefined;
        tabIndex?: string | number | undefined;
        disableOptimization?: boolean | undefined;
        forceStyle?: "hover" | "press" | "focus" | "focusVisible" | undefined;
        disableClassName?: boolean | undefined;
        onPress?: ((event: import("react-native").GestureResponderEvent) => void) | null | undefined;
        onLongPress?: ((event: import("react-native").GestureResponderEvent) => void) | null | undefined;
        onPressIn?: ((event: import("react-native").GestureResponderEvent) => void) | null | undefined;
        onPressOut?: ((event: import("react-native").GestureResponderEvent) => void) | null | undefined;
        onHoverIn?: React.MouseEventHandler<HTMLDivElement> | undefined;
        onHoverOut?: React.MouseEventHandler<HTMLDivElement> | undefined;
        onMouseEnter?: React.MouseEventHandler<HTMLDivElement> | undefined;
        onMouseLeave?: React.MouseEventHandler<HTMLDivElement> | undefined;
        onMouseDown?: React.MouseEventHandler<HTMLDivElement> | undefined;
        onMouseUp?: React.MouseEventHandler<HTMLDivElement> | undefined;
        onFocus?: React.FocusEventHandler<HTMLDivElement> | undefined;
        onBlur?: React.FocusEventHandler<HTMLDivElement> | undefined;
        x?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"x"> | undefined;
        y?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"y"> | undefined;
        perspective?: number | "unset" | undefined;
        scale?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"scale"> | undefined;
        scaleX?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"scaleX"> | undefined;
        scaleY?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"scaleY"> | undefined;
        skewX?: string | undefined;
        skewY?: string | undefined;
        matrix?: "unset" | number[] | undefined;
        rotate?: "unset" | import("@tamagui/core").UnionableString | `${number}deg` | undefined;
        rotateY?: "unset" | import("@tamagui/core").UnionableString | `${number}deg` | undefined;
        rotateX?: "unset" | import("@tamagui/core").UnionableString | `${number}deg` | undefined;
        rotateZ?: "unset" | import("@tamagui/core").UnionableString | `${number}deg` | undefined;
        contain?: import("csstype").Property.Contain | undefined;
        touchAction?: import("csstype").Property.TouchAction | undefined;
        cursor?: import("csstype").Property.Cursor | undefined;
        outlineColor?: "unset" | import("@tamagui/core").GetThemeValueForKey<"outlineColor"> | undefined;
        outlineOffset?: "unset" | import("@tamagui/core").SpaceValue | undefined;
        outlineStyle?: import("csstype").Property.OutlineStyle | undefined;
        outlineWidth?: "unset" | import("@tamagui/core").SpaceValue | undefined;
        userSelect?: import("csstype").Property.UserSelect | undefined;
        scrollbarWidth?: import("csstype").Property.ScrollbarWidth | undefined;
        space?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"space"> | undefined;
        spaceDirection?: "unset" | import("@tamagui/core").SpaceDirection | undefined;
        separator?: React.ReactNode;
        animation?: import("@tamagui/core").AnimationProp | null | undefined;
        animateOnly?: string[] | "unset" | undefined;
        animatePresence?: boolean | "unset" | undefined;
        transformOrigin?: "bottom" | "left" | "right" | "top" | "unset" | (`${string}%` | `${string}px` | `${number}px` | `${number}%`) | "center" | "left bottom" | "left top" | `left ${string}%` | `left ${string}px` | `left ${number}px` | `left ${number}%` | "left center" | "right bottom" | "right top" | `right ${string}%` | `right ${string}px` | `right ${number}px` | `right ${number}%` | "right center" | `${string}% bottom` | `${string}% top` | `${string}% ${string}%` | `${string}% ${string}px` | `${string}% ${number}px` | `${string}% ${number}%` | `${string}% center` | `${string}px bottom` | `${string}px top` | `${string}px ${string}%` | `${string}px ${string}px` | `${string}px ${number}px` | `${string}px ${number}%` | `${string}px center` | `${number}px bottom` | `${number}px top` | `${number}px ${string}%` | `${number}px ${string}px` | `${number}px ${number}px` | `${number}px ${number}%` | `${number}px center` | `${number}% bottom` | `${number}% top` | `${number}% ${string}%` | `${number}% ${string}px` | `${number}% ${number}px` | `${number}% ${number}%` | `${number}% center` | "center bottom" | "center top" | `center ${string}%` | `center ${string}px` | `center ${number}px` | `center ${number}%` | "center center" | `left bottom ${string}px` | `left bottom ${number}px` | `left top ${string}px` | `left top ${number}px` | `left ${string}% ${string}px` | `left ${string}% ${number}px` | `left ${string}px ${string}px` | `left ${string}px ${number}px` | `left ${number}px ${string}px` | `left ${number}px ${number}px` | `left ${number}% ${string}px` | `left ${number}% ${number}px` | `left center ${string}px` | `left center ${number}px` | `right bottom ${string}px` | `right bottom ${number}px` | `right top ${string}px` | `right top ${number}px` | `right ${string}% ${string}px` | `right ${string}% ${number}px` | `right ${string}px ${string}px` | `right ${string}px ${number}px` | `right ${number}px ${string}px` | `right ${number}px ${number}px` | `right ${number}% ${string}px` | `right ${number}% ${number}px` | `right center ${string}px` | `right center ${number}px` | `${string}% bottom ${string}px` | `${string}% bottom ${number}px` | `${string}% top ${string}px` | `${string}% top ${number}px` | `${string}% ${string}% ${string}px` | `${string}% ${string}% ${number}px` | `${string}% ${string}px ${string}px` | `${string}% ${string}px ${number}px` | `${string}% ${number}px ${string}px` | `${string}% ${number}px ${number}px` | `${string}% ${number}% ${string}px` | `${string}% ${number}% ${number}px` | `${string}% center ${string}px` | `${string}% center ${number}px` | `${string}px bottom ${string}px` | `${string}px bottom ${number}px` | `${string}px top ${string}px` | `${string}px top ${number}px` | `${string}px ${string}% ${string}px` | `${string}px ${string}% ${number}px` | `${string}px ${string}px ${string}px` | `${string}px ${string}px ${number}px` | `${string}px ${number}px ${string}px` | `${string}px ${number}px ${number}px` | `${string}px ${number}% ${string}px` | `${string}px ${number}% ${number}px` | `${string}px center ${string}px` | `${string}px center ${number}px` | `${number}px bottom ${string}px` | `${number}px bottom ${number}px` | `${number}px top ${string}px` | `${number}px top ${number}px` | `${number}px ${string}% ${string}px` | `${number}px ${string}% ${number}px` | `${number}px ${string}px ${string}px` | `${number}px ${string}px ${number}px` | `${number}px ${number}px ${string}px` | `${number}px ${number}px ${number}px` | `${number}px ${number}% ${string}px` | `${number}px ${number}% ${number}px` | `${number}px center ${string}px` | `${number}px center ${number}px` | `${number}% bottom ${string}px` | `${number}% bottom ${number}px` | `${number}% top ${string}px` | `${number}% top ${number}px` | `${number}% ${string}% ${string}px` | `${number}% ${string}% ${number}px` | `${number}% ${string}px ${string}px` | `${number}% ${string}px ${number}px` | `${number}% ${number}px ${string}px` | `${number}% ${number}px ${number}px` | `${number}% ${number}% ${string}px` | `${number}% ${number}% ${number}px` | `${number}% center ${string}px` | `${number}% center ${number}px` | `center bottom ${string}px` | `center bottom ${number}px` | `center top ${string}px` | `center top ${number}px` | `center ${string}% ${string}px` | `center ${string}% ${number}px` | `center ${string}px ${string}px` | `center ${string}px ${number}px` | `center ${number}px ${string}px` | `center ${number}px ${number}px` | `center ${number}% ${string}px` | `center ${number}% ${number}px` | `center center ${string}px` | `center center ${number}px` | undefined;
        backfaceVisibility?: "unset" | "hidden" | "visible" | undefined;
        backgroundColor?: "unset" | import("@tamagui/core").GetThemeValueForKey<"backgroundColor"> | import("react-native").OpaqueColorValue | undefined;
        borderBlockColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"borderBlockColor"> | undefined;
        borderBlockEndColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"borderBlockEndColor"> | undefined;
        borderBlockStartColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"borderBlockStartColor"> | undefined;
        borderBottomColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"borderBottomColor"> | undefined;
        borderBottomEndRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderBottomLeftRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderBottomRightRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderBottomStartRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"borderColor"> | undefined;
        borderCurve?: "unset" | "circular" | "continuous" | undefined;
        borderEndColor?: import("react-native").ColorValue | undefined;
        borderEndEndRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderEndStartRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderLeftColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"borderLeftColor"> | undefined;
        borderRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderRightColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"borderRightColor"> | undefined;
        borderStartColor?: import("react-native").ColorValue | undefined;
        borderStartEndRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderStartStartRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderStyle?: "unset" | "dashed" | "dotted" | "solid" | undefined;
        borderTopColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"borderTopColor"> | undefined;
        borderTopEndRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderTopLeftRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderTopRightRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        borderTopStartRadius?: number | `$${string}` | `$${number}` | "unset" | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/core").UnionableString | import("@tamagui/core").Variable<any> | import("@tamagui/core").UnionableNumber | import("react-native").Animated.AnimatedNode | undefined;
        opacity?: "unset" | import("react-native").AnimatableNumericValue | undefined;
        alignContent?: "unset" | "center" | "flex-start" | "flex-end" | "stretch" | "space-between" | "space-around" | undefined;
        alignItems?: "unset" | import("react-native").FlexAlignType | undefined;
        alignSelf?: "unset" | "auto" | import("react-native").FlexAlignType | undefined;
        aspectRatio?: string | number | undefined;
        borderBottomWidth?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"borderBottomWidth"> | undefined;
        borderEndWidth?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"borderEndWidth"> | undefined;
        borderLeftWidth?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"borderLeftWidth"> | undefined;
        borderRightWidth?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"borderRightWidth"> | undefined;
        borderStartWidth?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"borderStartWidth"> | undefined;
        borderTopWidth?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"borderTopWidth"> | undefined;
        borderWidth?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"borderWidth"> | undefined;
        bottom?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"bottom"> | null | undefined;
        end?: "unset" | import("react-native").DimensionValue | undefined;
        flex?: number | "unset" | undefined;
        flexBasis?: "unset" | import("react-native").DimensionValue | undefined;
        flexDirection?: "unset" | "row" | "column" | "row-reverse" | "column-reverse" | undefined;
        rowGap?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"rowGap"> | undefined;
        gap?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"gap"> | undefined;
        columnGap?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"columnGap"> | undefined;
        flexGrow?: number | "unset" | undefined;
        flexShrink?: number | "unset" | undefined;
        flexWrap?: "unset" | "wrap" | "nowrap" | "wrap-reverse" | undefined;
        height?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"height"> | null | undefined;
        justifyContent?: "unset" | "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly" | undefined;
        left?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"left"> | null | undefined;
        margin?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"margin"> | null | undefined;
        marginBottom?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"marginBottom"> | null | undefined;
        marginEnd?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"marginEnd"> | null | undefined;
        marginHorizontal?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"marginHorizontal"> | null | undefined;
        marginLeft?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"marginLeft"> | null | undefined;
        marginRight?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"marginRight"> | null | undefined;
        marginStart?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"marginStart"> | null | undefined;
        marginTop?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"marginTop"> | null | undefined;
        marginVertical?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"marginVertical"> | null | undefined;
        maxHeight?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"maxHeight"> | null | undefined;
        maxWidth?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"maxWidth"> | null | undefined;
        minHeight?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"minHeight"> | null | undefined;
        minWidth?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"minWidth"> | null | undefined;
        overflow?: "unset" | "hidden" | "visible" | "scroll" | undefined;
        padding?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"padding"> | null | undefined;
        paddingBottom?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"paddingBottom"> | null | undefined;
        paddingEnd?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"paddingEnd"> | null | undefined;
        paddingHorizontal?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"paddingHorizontal"> | null | undefined;
        paddingLeft?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"paddingLeft"> | null | undefined;
        paddingRight?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"paddingRight"> | null | undefined;
        paddingStart?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"paddingStart"> | null | undefined;
        paddingTop?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"paddingTop"> | null | undefined;
        paddingVertical?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"paddingVertical"> | null | undefined;
        position?: "unset" | "absolute" | "relative" | undefined;
        right?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"right"> | null | undefined;
        start?: "unset" | import("react-native").DimensionValue | undefined;
        top?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"top"> | null | undefined;
        width?: number | "unset" | import("react-native").Animated.AnimatedNode | import("@tamagui/core").GetThemeValueForKey<"width"> | null | undefined;
        zIndex?: "unset" | import("@tamagui/core").GetThemeValueForKey<"zIndex"> | undefined;
        direction?: "ltr" | "rtl" | "unset" | "inherit" | undefined;
        shadowColor?: "unset" | import("react-native").OpaqueColorValue | import("@tamagui/core").GetThemeValueForKey<"shadowColor"> | undefined;
        shadowOffset?: "unset" | import("@tamagui/core").GetThemeValueForKey<"shadowOffset"> | Readonly<{
            width: number;
            height: number;
        }> | undefined;
        shadowOpacity?: "unset" | import("react-native").AnimatableNumericValue | undefined;
        shadowRadius?: number | "unset" | import("@tamagui/core").GetThemeValueForKey<"shadowRadius"> | undefined;
        transform?: string | (({
            perspective: import("react-native").AnimatableNumericValue;
        } & {
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            scale: import("react-native").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            scaleX: import("react-native").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            scaleY: import("react-native").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            skewX: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            skewY: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            matrix: import("react-native").AnimatableNumericValue[];
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            rotate: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            rotateY: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            rotateX: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            rotateZ: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            translateX?: undefined;
            translateY?: undefined;
        }) | ({
            translateX: import("react-native").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateY?: undefined;
        }) | ({
            translateY: import("react-native").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            translateX?: undefined;
        }))[] | undefined;
        transformMatrix?: "unset" | number[] | undefined;
        rotation?: "unset" | import("react-native").AnimatableNumericValue | undefined;
        translateX?: "unset" | import("react-native").AnimatableNumericValue | undefined;
        translateY?: "unset" | import("react-native").AnimatableNumericValue | undefined;
        hoverStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>) | null | undefined;
        pressStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>) | null | undefined;
        focusStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>) | null | undefined;
        focusVisibleStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>) | null | undefined;
        disabledStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>) | null | undefined;
        exitStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>) | null | undefined;
        enterStyle?: (import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>) | null | undefined;
        key?: React.Key | null | undefined;
        onKeyDown?: import("@tamagui/core").EventHandler<KeyboardEvent> | undefined;
        'data-orientation': "horizontal" | "vertical";
        ref: (node: TamaguiElement) => void;
    };
    ValueProvider: React.Provider<AccordionValueContextValue | null>;
    valueProviderValue: {
        value: string[];
        onItemOpen: (value: string) => void;
        onItemClose: (value: string) => void;
    } | {
        value: string[];
        onItemOpen: (itemValue: string) => void;
        onItemClose: (itemValue: string) => void;
    };
    collapsibleProviderValue: {
        collapsible: boolean;
    } | {
        collapsible: boolean;
    };
    contextScope: string;
};
type AccordionValueContextValue = {
    value: string[];
    onItemOpen(value: string): void;
    onItemClose(value: string): void;
};
type AccordionImplContextValue = {
    disabled?: boolean;
    direction: AccordionImplProps['dir'];
    orientation: AccordionImplProps['orientation'];
};
type Direction = 'ltr' | 'rtl';
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Stack>;
interface AccordionImplProps extends PrimitiveDivProps {
    /**
     * Whether or not an accordion is disabled from user interaction.
     *
     * @defaultValue false
     */
    disabled?: boolean;
    /**
     * The layout in which the Accordion operates.
     * @default vertical
     */
    orientation?: React.AriaAttributes['aria-orientation'];
    /**
     * The language read direction.
     */
    dir?: Direction;
    /**
     *  The callback that fires when the state of the accordion changes. for use with `useAccordion`
     * @param selected - The values of the accordion items whose contents are expanded.
     */
    control?(selected: string[]): void;
}
interface AccordionImplSingleProps extends AccordionImplProps {
    /**
     * The controlled stateful value of the accordion item whose content is expanded.
     */
    value?: string;
    /**
     * The value of the item whose content is expanded when the accordion is initially rendered. Use
     * `defaultValue` if you do not need to control the state of an accordion.
     */
    defaultValue?: string;
    /**
     * The callback that fires when the state of the accordion changes.
     */
    onValueChange?(value: string): void;
    /**
     * Whether an accordion item can be collapsed after it has been opened.
     * @default false
     */
    collapsible?: boolean;
}
interface AccordionImplMultipleProps extends AccordionImplProps {
    /**
     * The controlled stateful value of the accordion items whose contents are expanded.
     */
    value?: string[];
    /**
     * The value of the items whose contents are expanded when the accordion is initially rendered. Use
     * `defaultValue` if you do not need to control the state of an accordion.
     */
    defaultValue?: string[];
    /**
     * The callback that fires when the state of the accordion changes.
     */
    onValueChange?(value: string[]): void;
}
interface UseAccordionItemParams {
    value: string;
    disabled?: boolean;
}
type AccordionItemContextValue = {
    open?: boolean;
    disabled?: boolean;
    triggerId: string;
};
export declare function useAccordionItem(params: UseAccordionItemParams, contextScope?: string): {
    trigger: {
        ItemSlot: React.ForwardRefExoticComponent<{
            children: React.ReactNode;
        } & {
            __scopeCollection?: string | undefined;
        } & React.RefAttributes<TamaguiElement>>;
        itemSlotProps: {
            __scopeCollection: string;
        };
        frame: {
            'aria-disabled': true | undefined;
            'data-orientation': "horizontal" | "vertical" | undefined;
            id: string;
            __scopCollapsible: string;
        };
    };
    content: {
        role: string;
        'aria-labelledby': string;
        'data-orientation': "horizontal" | "vertical" | undefined;
    };
    header: {
        'data-orientation': "horizontal" | "vertical" | undefined;
        'data-state': string;
        'data-disabled': string | undefined;
    };
    ItemProvider: React.Provider<AccordionItemContextValue>;
    itemProviderValue: {
        open: boolean | undefined;
        disabled: boolean | undefined;
        triggerId: string;
    };
    Collapsible: React.ForwardRefExoticComponent<import("@tamagui/collapsible/types/Collapsible").CollapsibleProps & {
        __scopeCollapsible?: string | undefined;
    } & React.RefAttributes<import("@tamagui/core").TamaguiElement>> & {
        Trigger: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, import("@tamagui/core").TamaguiElement, import("@tamagui/core").StackNonStyleProps & void, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
        Content: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, keyof import("@tamagui/collapsible").CollapsibleContentExtraProps> & import("@tamagui/collapsible").CollapsibleContentExtraProps, import("@tamagui/core").TamaguiElement, import("@tamagui/core").StackNonStyleProps & import("@tamagui/collapsible").CollapsibleContentExtraProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    };
    contextScope: string;
    collapsibleProps: {
        'data-orientation': "horizontal" | "vertical" | undefined;
        'data-state': string;
        disabled: boolean | undefined;
        open: boolean;
        __scopCollapsible: string;
        onOpenChange: (open: any) => void;
    };
};
export {};
//# sourceMappingURL=useAccordion.d.ts.map