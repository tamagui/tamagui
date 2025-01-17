import type { RovingFocusGroupProps, RovingFocusItemProps } from '@tamagui/roving-focus';
import type { PropsWithChildren } from 'react';
import type { YStackProps } from 'tamagui';
type CheckboxesProps<K extends string> = {
    values: Record<K, boolean>;
    onValuesChange: (values: Record<K, boolean>) => void;
} & YStackProps;
type CardProps = {
    unstyled?: boolean;
};
export declare const Checkboxes: (<K extends string>(props: PropsWithChildren<CheckboxesProps<K>>) => import("react/jsx-runtime").JSX.Element) & {
    Group: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps & import("tamagui").GroupExtraProps & {
        __scopeGroup?: import("tamagui").Scope;
    }, "size" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "fullscreen" | "unstyled" | "transparent" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        size?: any;
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        size?: any;
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        size?: any;
        unstyled?: boolean | undefined;
    }>> & import("react").RefAttributes<import("tamagui").TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("tamagui").GroupExtraProps & {
        __scopeGroup?: import("tamagui").Scope;
    }, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        size?: any;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig" | "extractable" | "styleable"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("tamagui").GroupExtraProps & {
            __scopeGroup?: import("tamagui").Scope;
        }, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("tamagui").SizeTokens | undefined;
            inset?: number | import("tamagui").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | null | undefined;
            transparent?: boolean | undefined;
            fullscreen?: boolean | undefined;
            circular?: boolean | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            backgrounded?: boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
            size?: any;
            unstyled?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    } & {
        Item: import("react").ForwardRefExoticComponent<import("tamagui").GroupItemProps & {
            __scopeGroup?: import("tamagui").Scope;
        } & import("react").RefAttributes<unknown>>;
    };
    /** FocusGroup is necessary for keyboard arrow navigation */
    FocusGroup: import("react").ForwardRefExoticComponent<RovingFocusGroupProps & import("react").RefAttributes<import("tamagui").TamaguiElement>> & {
        Item: import("react").ForwardRefExoticComponent<RovingFocusItemProps & {
            value: string;
        } & import("react").RefAttributes<any>>;
    };
    Title: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiTextElement, import("tamagui").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("tamagui").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Checkbox: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: import("tamagui").SizeTokens | undefined;
        disabled?: boolean | undefined;
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        unstyled?: boolean | undefined;
    }>, "theme" | "native" | "debug" | "userSelect" | "cursor" | "pointerEvents" | "alignContent" | "alignItems" | "alignSelf" | "bottom" | "backgroundColor" | "borderBottomColor" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomWidth" | "borderLeftColor" | "borderLeftWidth" | "borderColor" | "borderRadius" | "borderStyle" | "borderRightWidth" | "borderRightColor" | "borderTopColor" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopWidth" | "borderWidth" | "display" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "maxHeight" | "maxWidth" | "marginBottom" | "minHeight" | "minWidth" | "marginLeft" | "marginRight" | "marginTop" | "marginHorizontal" | "marginVertical" | "opacity" | "overflow" | "padding" | "paddingBottom" | "paddingLeft" | "position" | "paddingRight" | "paddingTop" | "paddingHorizontal" | "paddingVertical" | "right" | "shadowColor" | "shadowRadius" | "shadowOffset" | "shadowOpacity" | "top" | "width" | "zIndex" | "size" | "style" | "transform" | "space" | "background" | "outlineColor" | "children" | "className" | "value" | "x" | "y" | "perspective" | "scale" | "scaleX" | "scaleY" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "transition" | "textWrap" | "contain" | "touchAction" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "scrollbarWidth" | "transformOrigin" | "filter" | "mixBlendMode" | "backgroundImage" | "backgroundOrigin" | "backgroundPosition" | "backgroundRepeat" | "backgroundSize" | "backgroundClip" | "backgroundBlendMode" | "backgroundAttachment" | "clipPath" | "caretColor" | "transformStyle" | "mask" | "maskImage" | "textEmphasis" | "borderImage" | "float" | "content" | "overflowBlock" | "overflowInline" | "maskBorder" | "maskBorderMode" | "maskBorderOutset" | "maskBorderRepeat" | "maskBorderSlice" | "maskBorderSource" | "maskBorderWidth" | "maskClip" | "maskComposite" | "maskMode" | "maskOrigin" | "maskPosition" | "maskRepeat" | "maskSize" | "maskType" | "gridRow" | "gridRowEnd" | "gridRowGap" | "gridRowStart" | "gridColumn" | "gridColumnEnd" | "gridColumnGap" | "gridColumnStart" | "gridTemplateColumns" | "gridTemplateAreas" | "backdropFilter" | "containerType" | "blockSize" | "inlineSize" | "minBlockSize" | "maxBlockSize" | "objectFit" | "verticalAlign" | "minInlineSize" | "maxInlineSize" | "borderInlineColor" | "borderInlineStartColor" | "borderInlineEndColor" | "borderBlockWidth" | "borderBlockStartWidth" | "borderBlockEndWidth" | "borderInlineWidth" | "borderInlineStartWidth" | "borderInlineEndWidth" | "borderBlockStyle" | "borderBlockStartStyle" | "borderBlockEndStyle" | "borderInlineStyle" | "borderInlineStartStyle" | "borderInlineEndStyle" | "marginBlock" | "marginBlockStart" | "marginBlockEnd" | "marginInline" | "marginInlineStart" | "marginInlineEnd" | "paddingBlock" | "paddingBlockStart" | "paddingBlockEnd" | "paddingInline" | "paddingInlineStart" | "paddingInlineEnd" | "insetBlock" | "insetBlockStart" | "insetBlockEnd" | "insetInline" | "insetInlineStart" | "insetInlineEnd" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "animatePresence" | "backfaceVisibility" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomEndRadius" | "borderBottomStartRadius" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderTopEndRadius" | "borderTopStartRadius" | "isolation" | "boxShadow" | "aspectRatio" | "borderEndWidth" | "borderStartWidth" | "end" | "rowGap" | "gap" | "columnGap" | "marginEnd" | "marginStart" | "paddingEnd" | "paddingStart" | "start" | "direction" | "inset" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "unstyled" | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "themeShallow" | "themeInverse" | "id" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | `$${string}` | "hoverStyle" | "pressStyle" | "focusStyle" | "focusWithinStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "name" | `$${number}` | "scaleIcon" | `$theme-${string}` | `$theme-${number}` | "defaultChecked" | "checked" | "required" | `$group-${string}` | `$group-${number}` | `$group-${string}-hover` | `$group-${string}-press` | `$group-${string}-focus` | `$group-${string}-focusVisible` | `$group-${string}-focusWithin` | `$group-${number}-hover` | `$group-${number}-press` | `$group-${number}-focus` | `$group-${number}-focusVisible` | `$group-${number}-focusWithin` | "onCheckedChange" | "labelledBy" | "scaleSize" | "sizeAdjust"> & import("tamagui").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/checkbox-headless").CheckboxExtraProps & {
        scaleIcon?: number;
        scaleSize?: number;
        sizeAdjust?: number;
        native?: import("tamagui").NativeValue<"web">;
    } & {
        size?: import("tamagui").SizeTokens;
        unstyled?: boolean;
    } & import("react").RefAttributes<import("tamagui").TamaguiElement>> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: import("tamagui").SizeTokens | undefined;
        disabled?: boolean | undefined;
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        unstyled?: boolean | undefined;
    }>, "theme" | "native" | "debug" | "userSelect" | "cursor" | "pointerEvents" | "alignContent" | "alignItems" | "alignSelf" | "bottom" | "backgroundColor" | "borderBottomColor" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomWidth" | "borderLeftColor" | "borderLeftWidth" | "borderColor" | "borderRadius" | "borderStyle" | "borderRightWidth" | "borderRightColor" | "borderTopColor" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopWidth" | "borderWidth" | "display" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "maxHeight" | "maxWidth" | "marginBottom" | "minHeight" | "minWidth" | "marginLeft" | "marginRight" | "marginTop" | "marginHorizontal" | "marginVertical" | "opacity" | "overflow" | "padding" | "paddingBottom" | "paddingLeft" | "position" | "paddingRight" | "paddingTop" | "paddingHorizontal" | "paddingVertical" | "right" | "shadowColor" | "shadowRadius" | "shadowOffset" | "shadowOpacity" | "top" | "width" | "zIndex" | "size" | "style" | "transform" | "space" | "background" | "outlineColor" | "children" | "className" | "value" | "x" | "y" | "perspective" | "scale" | "scaleX" | "scaleY" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "transition" | "textWrap" | "contain" | "touchAction" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "scrollbarWidth" | "transformOrigin" | "filter" | "mixBlendMode" | "backgroundImage" | "backgroundOrigin" | "backgroundPosition" | "backgroundRepeat" | "backgroundSize" | "backgroundClip" | "backgroundBlendMode" | "backgroundAttachment" | "clipPath" | "caretColor" | "transformStyle" | "mask" | "maskImage" | "textEmphasis" | "borderImage" | "float" | "content" | "overflowBlock" | "overflowInline" | "maskBorder" | "maskBorderMode" | "maskBorderOutset" | "maskBorderRepeat" | "maskBorderSlice" | "maskBorderSource" | "maskBorderWidth" | "maskClip" | "maskComposite" | "maskMode" | "maskOrigin" | "maskPosition" | "maskRepeat" | "maskSize" | "maskType" | "gridRow" | "gridRowEnd" | "gridRowGap" | "gridRowStart" | "gridColumn" | "gridColumnEnd" | "gridColumnGap" | "gridColumnStart" | "gridTemplateColumns" | "gridTemplateAreas" | "backdropFilter" | "containerType" | "blockSize" | "inlineSize" | "minBlockSize" | "maxBlockSize" | "objectFit" | "verticalAlign" | "minInlineSize" | "maxInlineSize" | "borderInlineColor" | "borderInlineStartColor" | "borderInlineEndColor" | "borderBlockWidth" | "borderBlockStartWidth" | "borderBlockEndWidth" | "borderInlineWidth" | "borderInlineStartWidth" | "borderInlineEndWidth" | "borderBlockStyle" | "borderBlockStartStyle" | "borderBlockEndStyle" | "borderInlineStyle" | "borderInlineStartStyle" | "borderInlineEndStyle" | "marginBlock" | "marginBlockStart" | "marginBlockEnd" | "marginInline" | "marginInlineStart" | "marginInlineEnd" | "paddingBlock" | "paddingBlockStart" | "paddingBlockEnd" | "paddingInline" | "paddingInlineStart" | "paddingInlineEnd" | "insetBlock" | "insetBlockStart" | "insetBlockEnd" | "insetInline" | "insetInlineStart" | "insetInlineEnd" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "animatePresence" | "backfaceVisibility" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomEndRadius" | "borderBottomStartRadius" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderTopEndRadius" | "borderTopStartRadius" | "isolation" | "boxShadow" | "aspectRatio" | "borderEndWidth" | "borderStartWidth" | "end" | "rowGap" | "gap" | "columnGap" | "marginEnd" | "marginStart" | "paddingEnd" | "paddingStart" | "start" | "direction" | "inset" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "unstyled" | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "themeShallow" | "themeInverse" | "id" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | `$${string}` | "hoverStyle" | "pressStyle" | "focusStyle" | "focusWithinStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "name" | `$${number}` | "scaleIcon" | `$theme-${string}` | `$theme-${number}` | "defaultChecked" | "checked" | "required" | `$group-${string}` | `$group-${number}` | `$group-${string}-hover` | `$group-${string}-press` | `$group-${string}-focus` | `$group-${string}-focusVisible` | `$group-${string}-focusWithin` | `$group-${number}-hover` | `$group-${number}-press` | `$group-${number}-focus` | `$group-${number}-focusVisible` | `$group-${number}-focusWithin` | "onCheckedChange" | "labelledBy" | "scaleSize" | "sizeAdjust"> & import("tamagui").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/checkbox-headless").CheckboxExtraProps & {
        scaleIcon?: number;
        scaleSize?: number;
        sizeAdjust?: number;
        native?: import("tamagui").NativeValue<"web">;
    } & {
        size?: import("tamagui").SizeTokens;
        unstyled?: boolean;
    }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("tamagui").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/checkbox-headless").CheckboxExtraProps & {
        scaleIcon?: number;
        scaleSize?: number;
        sizeAdjust?: number;
        native?: import("tamagui").NativeValue<"web">;
    } & {
        size?: import("tamagui").SizeTokens;
        unstyled?: boolean;
    } & void, import("@tamagui/web").StackStyleBase, {
        size?: import("tamagui").SizeTokens | undefined;
        disabled?: boolean | undefined;
        elevation?: number | import("tamagui").SizeTokens | undefined;
        inset?: number | import("tamagui").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig" | "extractable" | "styleable"> & {
        __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
            size?: import("tamagui").SizeTokens | undefined;
            disabled?: boolean | undefined;
            elevation?: number | import("tamagui").SizeTokens | undefined;
            inset?: number | import("tamagui").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | null | undefined;
            transparent?: boolean | undefined;
            fullscreen?: boolean | undefined;
            circular?: boolean | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            backgrounded?: boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
            unstyled?: boolean | undefined;
        }>, "theme" | "native" | "debug" | "userSelect" | "cursor" | "pointerEvents" | "alignContent" | "alignItems" | "alignSelf" | "bottom" | "backgroundColor" | "borderBottomColor" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomWidth" | "borderLeftColor" | "borderLeftWidth" | "borderColor" | "borderRadius" | "borderStyle" | "borderRightWidth" | "borderRightColor" | "borderTopColor" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopWidth" | "borderWidth" | "display" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "maxHeight" | "maxWidth" | "marginBottom" | "minHeight" | "minWidth" | "marginLeft" | "marginRight" | "marginTop" | "marginHorizontal" | "marginVertical" | "opacity" | "overflow" | "padding" | "paddingBottom" | "paddingLeft" | "position" | "paddingRight" | "paddingTop" | "paddingHorizontal" | "paddingVertical" | "right" | "shadowColor" | "shadowRadius" | "shadowOffset" | "shadowOpacity" | "top" | "width" | "zIndex" | "size" | "style" | "transform" | "space" | "background" | "outlineColor" | "children" | "className" | "value" | "x" | "y" | "perspective" | "scale" | "scaleX" | "scaleY" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "transition" | "textWrap" | "contain" | "touchAction" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "scrollbarWidth" | "transformOrigin" | "filter" | "mixBlendMode" | "backgroundImage" | "backgroundOrigin" | "backgroundPosition" | "backgroundRepeat" | "backgroundSize" | "backgroundClip" | "backgroundBlendMode" | "backgroundAttachment" | "clipPath" | "caretColor" | "transformStyle" | "mask" | "maskImage" | "textEmphasis" | "borderImage" | "float" | "content" | "overflowBlock" | "overflowInline" | "maskBorder" | "maskBorderMode" | "maskBorderOutset" | "maskBorderRepeat" | "maskBorderSlice" | "maskBorderSource" | "maskBorderWidth" | "maskClip" | "maskComposite" | "maskMode" | "maskOrigin" | "maskPosition" | "maskRepeat" | "maskSize" | "maskType" | "gridRow" | "gridRowEnd" | "gridRowGap" | "gridRowStart" | "gridColumn" | "gridColumnEnd" | "gridColumnGap" | "gridColumnStart" | "gridTemplateColumns" | "gridTemplateAreas" | "backdropFilter" | "containerType" | "blockSize" | "inlineSize" | "minBlockSize" | "maxBlockSize" | "objectFit" | "verticalAlign" | "minInlineSize" | "maxInlineSize" | "borderInlineColor" | "borderInlineStartColor" | "borderInlineEndColor" | "borderBlockWidth" | "borderBlockStartWidth" | "borderBlockEndWidth" | "borderInlineWidth" | "borderInlineStartWidth" | "borderInlineEndWidth" | "borderBlockStyle" | "borderBlockStartStyle" | "borderBlockEndStyle" | "borderInlineStyle" | "borderInlineStartStyle" | "borderInlineEndStyle" | "marginBlock" | "marginBlockStart" | "marginBlockEnd" | "marginInline" | "marginInlineStart" | "marginInlineEnd" | "paddingBlock" | "paddingBlockStart" | "paddingBlockEnd" | "paddingInline" | "paddingInlineStart" | "paddingInlineEnd" | "insetBlock" | "insetBlockStart" | "insetBlockEnd" | "insetInline" | "insetInlineStart" | "insetInlineEnd" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "animatePresence" | "backfaceVisibility" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomEndRadius" | "borderBottomStartRadius" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderTopEndRadius" | "borderTopStartRadius" | "isolation" | "boxShadow" | "aspectRatio" | "borderEndWidth" | "borderStartWidth" | "end" | "rowGap" | "gap" | "columnGap" | "marginEnd" | "marginStart" | "paddingEnd" | "paddingStart" | "start" | "direction" | "inset" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "unstyled" | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "themeShallow" | "themeInverse" | "id" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | `$${string}` | "hoverStyle" | "pressStyle" | "focusStyle" | "focusWithinStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "name" | `$${number}` | "scaleIcon" | `$theme-${string}` | `$theme-${number}` | "defaultChecked" | "checked" | "required" | `$group-${string}` | `$group-${number}` | `$group-${string}-hover` | `$group-${string}-press` | `$group-${string}-focus` | `$group-${string}-focusVisible` | `$group-${string}-focusWithin` | `$group-${number}-hover` | `$group-${number}-press` | `$group-${number}-focus` | `$group-${number}-focusVisible` | `$group-${number}-focusWithin` | "onCheckedChange" | "labelledBy" | "scaleSize" | "sizeAdjust"> & import("tamagui").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/checkbox-headless").CheckboxExtraProps & {
            scaleIcon?: number;
            scaleSize?: number;
            sizeAdjust?: number;
            native?: import("tamagui").NativeValue<"web">;
        } & {
            size?: import("tamagui").SizeTokens;
            unstyled?: boolean;
        }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("tamagui").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & import("@tamagui/checkbox-headless").CheckboxExtraProps & {
            scaleIcon?: number;
            scaleSize?: number;
            sizeAdjust?: number;
            native?: import("tamagui").NativeValue<"web">;
        } & {
            size?: import("tamagui").SizeTokens;
            unstyled?: boolean;
        } & void, import("@tamagui/web").StackStyleBase, {
            size?: import("tamagui").SizeTokens | undefined;
            disabled?: boolean | undefined;
            elevation?: number | import("tamagui").SizeTokens | undefined;
            inset?: number | import("tamagui").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | null | undefined;
            transparent?: boolean | undefined;
            fullscreen?: boolean | undefined;
            circular?: boolean | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            backgrounded?: boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
            unstyled?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    } & {
        Indicator: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("tamagui").SizeTokens | undefined;
            inset?: number | import("tamagui").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | null | undefined;
            transparent?: boolean | undefined;
            fullscreen?: boolean | undefined;
            circular?: boolean | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            backgrounded?: boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
            unstyled?: boolean | undefined;
        }>, "theme" | "debug" | "userSelect" | "cursor" | "pointerEvents" | "alignContent" | "alignItems" | "alignSelf" | "bottom" | "backgroundColor" | "borderBottomColor" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomWidth" | "borderLeftColor" | "borderLeftWidth" | "borderColor" | "borderRadius" | "borderStyle" | "borderRightWidth" | "borderRightColor" | "borderTopColor" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopWidth" | "borderWidth" | "display" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "maxHeight" | "maxWidth" | "marginBottom" | "minHeight" | "minWidth" | "marginLeft" | "marginRight" | "marginTop" | "marginHorizontal" | "marginVertical" | "opacity" | "overflow" | "padding" | "paddingBottom" | "paddingLeft" | "position" | "paddingRight" | "paddingTop" | "paddingHorizontal" | "paddingVertical" | "right" | "shadowColor" | "shadowRadius" | "shadowOffset" | "shadowOpacity" | "top" | "width" | "zIndex" | "style" | "transform" | "space" | "background" | "outlineColor" | "children" | "className" | "x" | "y" | "perspective" | "scale" | "scaleX" | "scaleY" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "transition" | "textWrap" | "contain" | "touchAction" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "scrollbarWidth" | "transformOrigin" | "filter" | "mixBlendMode" | "backgroundImage" | "backgroundOrigin" | "backgroundPosition" | "backgroundRepeat" | "backgroundSize" | "backgroundClip" | "backgroundBlendMode" | "backgroundAttachment" | "clipPath" | "caretColor" | "transformStyle" | "mask" | "maskImage" | "textEmphasis" | "borderImage" | "float" | "content" | "overflowBlock" | "overflowInline" | "maskBorder" | "maskBorderMode" | "maskBorderOutset" | "maskBorderRepeat" | "maskBorderSlice" | "maskBorderSource" | "maskBorderWidth" | "maskClip" | "maskComposite" | "maskMode" | "maskOrigin" | "maskPosition" | "maskRepeat" | "maskSize" | "maskType" | "gridRow" | "gridRowEnd" | "gridRowGap" | "gridRowStart" | "gridColumn" | "gridColumnEnd" | "gridColumnGap" | "gridColumnStart" | "gridTemplateColumns" | "gridTemplateAreas" | "backdropFilter" | "containerType" | "blockSize" | "inlineSize" | "minBlockSize" | "maxBlockSize" | "objectFit" | "verticalAlign" | "minInlineSize" | "maxInlineSize" | "borderInlineColor" | "borderInlineStartColor" | "borderInlineEndColor" | "borderBlockWidth" | "borderBlockStartWidth" | "borderBlockEndWidth" | "borderInlineWidth" | "borderInlineStartWidth" | "borderInlineEndWidth" | "borderBlockStyle" | "borderBlockStartStyle" | "borderBlockEndStyle" | "borderInlineStyle" | "borderInlineStartStyle" | "borderInlineEndStyle" | "marginBlock" | "marginBlockStart" | "marginBlockEnd" | "marginInline" | "marginInlineStart" | "marginInlineEnd" | "paddingBlock" | "paddingBlockStart" | "paddingBlockEnd" | "paddingInline" | "paddingInlineStart" | "paddingInlineEnd" | "insetBlock" | "insetBlockStart" | "insetBlockEnd" | "insetInline" | "insetInlineStart" | "insetInlineEnd" | "spaceDirection" | "separator" | "animation" | "animateOnly" | "animatePresence" | "backfaceVisibility" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomEndRadius" | "borderBottomStartRadius" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderTopEndRadius" | "borderTopStartRadius" | "isolation" | "boxShadow" | "aspectRatio" | "borderEndWidth" | "borderStartWidth" | "end" | "rowGap" | "gap" | "columnGap" | "marginEnd" | "marginStart" | "paddingEnd" | "paddingStart" | "start" | "direction" | "inset" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "themeShallow" | "themeInverse" | "id" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | `$${string}` | "hoverStyle" | "pressStyle" | "focusStyle" | "focusWithinStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | `$${number}` | "forceMount" | `$theme-${string}` | `$theme-${number}` | "disablePassStyles"> & import("tamagui").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & {
            forceMount?: boolean;
            disablePassStyles?: boolean;
        }, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("tamagui").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & {
            forceMount?: boolean;
            disablePassStyles?: boolean;
        }, import("@tamagui/web").StackStyleBase, {
            elevation?: number | import("tamagui").SizeTokens | undefined;
            inset?: number | import("tamagui").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | null | undefined;
            transparent?: boolean | undefined;
            fullscreen?: boolean | undefined;
            circular?: boolean | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            backgrounded?: boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
            unstyled?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic>;
        Label: import("@tamagui/web").ReactComponentWithRef<import("tamagui").LabelProps, import("react-native").View | HTMLButtonElement>;
    };
    Card: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        active?: boolean | undefined;
    }>, "unstyled"> & CardProps, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & CardProps, import("@tamagui/web").StackStyleBase, {
        active?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=checkboxParts.d.ts.map