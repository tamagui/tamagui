import type { ColorTokens, GetProps, SizeTokens } from '@tamagui/web';
import type { FunctionComponent, JSX, ReactNode } from 'react';
type IconProp = JSX.Element | FunctionComponent<{
    color?: any;
    size?: any;
}> | null;
type ListItemVariant = 'outlined';
export type ListItemExtraProps = {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    title?: ReactNode;
    subTitle?: ReactNode;
    iconSize?: SizeTokens | true;
    color?: ColorTokens | string;
};
export type ListItemProps = GetProps<typeof ListItemFrame> & ListItemExtraProps;
declare const ListItemFrame: FunctionComponent<Omit<import("@tamagui/web").StackNonStyleProps, "color" | "size" | keyof import("@tamagui/web").StackStyleBase | "variant" | "disabled"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
}>> & {
    ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        color?: string | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ListItem: FunctionComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
}>, "theme" | "debug" | "size" | "style" | "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/web").GroupMediaKeys | "children" | keyof import("@tamagui/web").StackStyleBase | "render" | "role" | "variant" | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "id" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMoveCapture" | "onPointerCancelCapture" | "onPointerDownCapture" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> | keyof ListItemExtraProps> & Omit<import("@tamagui/web").StackNonStyleProps, "color" | "size" | keyof import("@tamagui/web").StackStyleBase | "variant" | "disabled"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
}>> & ListItemExtraProps & {
    ref?: import("react").Ref<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View> | undefined;
}> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
}>, "theme" | "debug" | "size" | "style" | "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/web").GroupMediaKeys | "children" | keyof import("@tamagui/web").StackStyleBase | "render" | "role" | "variant" | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "id" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMoveCapture" | "onPointerCancelCapture" | "onPointerDownCapture" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> | keyof ListItemExtraProps> & Omit<import("@tamagui/web").StackNonStyleProps, "color" | "size" | keyof import("@tamagui/web").StackStyleBase | "variant" | "disabled"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
}>> & ListItemExtraProps, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View, import("@tamagui/web").StackNonStyleProps & Omit<import("@tamagui/web").StackNonStyleProps, "color" | "size" | keyof import("@tamagui/web").StackStyleBase | "variant" | "disabled"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
}>> & ListItemExtraProps, import("@tamagui/web").StackStyleBase, {
    color?: string | undefined;
    size?: false | import("@tamagui/web").Size | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        color?: string | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
    }>, "theme" | "debug" | "size" | "style" | "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/web").GroupMediaKeys | "children" | keyof import("@tamagui/web").StackStyleBase | "render" | "role" | "variant" | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "id" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMoveCapture" | "onPointerCancelCapture" | "onPointerDownCapture" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        color?: string | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> | keyof ListItemExtraProps> & Omit<import("@tamagui/web").StackNonStyleProps, "color" | "size" | keyof import("@tamagui/web").StackStyleBase | "variant" | "disabled"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        color?: string | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        color?: string | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        color?: string | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
    }>> & ListItemExtraProps, (HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View, import("@tamagui/web").StackNonStyleProps & Omit<import("@tamagui/web").StackNonStyleProps, "color" | "size" | keyof import("@tamagui/web").StackStyleBase | "variant" | "disabled"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        color?: string | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        color?: string | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        color?: string | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
    }>> & ListItemExtraProps, import("@tamagui/web").StackStyleBase, {
        color?: string | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Apply: import("react").Provider<{
        size?: SizeTokens | true;
        variant?: ListItemVariant;
        color?: ColorTokens | string;
    }> & import("react").ProviderExoticComponent<Partial<{
        size?: SizeTokens | true;
        variant?: ListItemVariant;
        color?: ColorTokens | string;
    }> & {
        children?: ReactNode;
        scope?: string;
    }>;
    Frame: FunctionComponent<Omit<import("@tamagui/web").StackNonStyleProps, "color" | "size" | keyof import("@tamagui/web").StackStyleBase | "variant" | "disabled"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        color?: string | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        color?: string | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        color?: string | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
    }>> & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        color?: string | undefined;
        size?: false | import("@tamagui/web").Size | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
            color?: string | undefined;
            size?: false | import("@tamagui/web").Size | undefined;
            variant?: "outlined" | undefined;
            disabled?: boolean | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Text: FunctionComponent<Omit<import("@tamagui/web").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase | "variant"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    }>> & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
            size?: import("@tamagui/web").FontSize | undefined;
            variant?: "outlined" | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Subtitle: FunctionComponent<Omit<import("@tamagui/web").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase | "variant"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
        variant?: "outlined" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
        variant?: "outlined" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
        size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
        variant?: "outlined" | undefined;
    }>> & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
            size?: number | boolean | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | `$${number}` | undefined;
            variant?: "outlined" | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    Icon: (props: {
        children: React.ReactNode;
        size?: SizeTokens | true;
        scaleIcon?: number;
    }) => any;
    Title: FunctionComponent<Omit<import("@tamagui/web").TextNonStyleProps, "size" | keyof import("@tamagui/web").TextStylePropsBase | "variant"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    }>> & {
        ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSize | undefined;
        variant?: "outlined" | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
            size?: import("@tamagui/web").FontSize | undefined;
            variant?: "outlined" | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
};
export {};
//# sourceMappingURL=ListItem.d.ts.map