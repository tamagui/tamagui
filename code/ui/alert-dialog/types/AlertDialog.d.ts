import type { TamaguiElement } from '@tamagui/core';
import type { DialogCloseProps, DialogContentProps, DialogDescriptionProps, DialogOverlayExtraProps, DialogOverlayProps, DialogPortalProps, DialogProps, DialogTitleProps, DialogTriggerProps } from '@tamagui/dialog';
import * as React from 'react';
export type AlertDialogScopes = string;
type ScopedProps<P> = Omit<P, 'scope'> & {
    scope?: AlertDialogScopes;
};
type AlertDialogProps = ScopedProps<DialogProps> & {
    native?: boolean;
};
type AlertDialogTriggerProps = ScopedProps<DialogTriggerProps>;
declare const AlertDialogTrigger: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@tamagui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").StackStyleBase, {}>>> & Omit<DialogTriggerProps, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogTriggerProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
type AlertDialogPortalProps = ScopedProps<DialogPortalProps>;
declare const AlertDialogPortal: React.FC<AlertDialogPortalProps>;
type AlertDialogOverlayExtraProps = ScopedProps<{}> & DialogOverlayExtraProps;
type AlertDialogOverlayProps = AlertDialogOverlayExtraProps & DialogOverlayProps;
declare const AlertDialogOverlay: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    open?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, "scope" | `$${string}` | `$${number}` | import("@tamagui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "elevation" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | "fullscreen" | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> | "forceMount"> & Omit<{}, "scope"> & {
    scope?: AlertDialogScopes;
} & {
    forceMount?: true;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
} & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>>, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
    scope?: AlertDialogScopes;
} & {
    forceMount?: true;
} & {
    scope?: import("@tamagui/dialog").DialogScopes;
} & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
} & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>>, import("@tamagui/core").StackStyleBase, {
    open?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type AlertDialogContentProps = ScopedProps<Omit<DialogContentProps, 'onPointerDownOutside' | 'onInteractOutside'>>;
declare const AlertDialogContent: React.ForwardRefExoticComponent<Omit<Omit<DialogContentProps, "onPointerDownOutside" | "onInteractOutside">, "scope"> & {
    scope?: AlertDialogScopes;
} & React.RefAttributes<TamaguiElement>>;
type AlertDialogTitleProps = ScopedProps<DialogTitleProps>;
declare const AlertDialogTitle: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "theme" | "debug" | "scope" | "children" | `$${string}` | `$${number}` | import("@tamagui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "id" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "style" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "size" | "unstyled" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "numberOfLines" | "onTextLayout" | "maxFontSizeMultiplier" | "minimumFontScale" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | keyof import("@tamagui/core").TextStylePropsBase | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}>>> & Omit<DialogTitleProps, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogTitleProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
type AlertDialogDescriptionProps = ScopedProps<DialogDescriptionProps>;
declare const AlertDialogDescription: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "theme" | "debug" | "scope" | "children" | `$${string}` | `$${number}` | import("@tamagui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "id" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "style" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "size" | "unstyled" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "numberOfLines" | "onTextLayout" | "maxFontSizeMultiplier" | "minimumFontScale" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | keyof import("@tamagui/core").TextStylePropsBase | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").TextStylePropsBase, {
    size?: import("@tamagui/core").FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}>>> & Omit<DialogDescriptionProps, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogDescriptionProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
type AlertDialogActionProps = ScopedProps<DialogCloseProps>;
declare const AlertDialogAction: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@tamagui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").StackStyleBase, {}>> | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | "displayWhenAdapted"> & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
type AlertDialogCancelProps = ScopedProps<DialogCloseProps>;
declare const AlertDialogCancel: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@tamagui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").StackStyleBase, {}>> | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | "displayWhenAdapted"> & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
    scope?: AlertDialogScopes;
}, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
declare const AlertDialog: React.FC<AlertDialogProps> & {
    Trigger: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@tamagui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").StackStyleBase, {}>>> & Omit<DialogTriggerProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogTriggerProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Portal: React.FC<AlertDialogPortalProps>;
    Overlay: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
    }>, "scope" | `$${string}` | `$${number}` | import("@tamagui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "elevation" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | "fullscreen" | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> | "forceMount"> & Omit<{}, "scope"> & {
        scope?: AlertDialogScopes;
    } & {
        forceMount?: true;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    } & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>>, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<{}, "scope"> & {
        scope?: AlertDialogScopes;
    } & {
        forceMount?: true;
    } & {
        scope?: import("@tamagui/dialog").DialogScopes;
    } & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>>, import("@tamagui/core").StackStyleBase, {
        open?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Content: React.ForwardRefExoticComponent<Omit<Omit<DialogContentProps, "onPointerDownOutside" | "onInteractOutside">, "scope"> & {
        scope?: AlertDialogScopes;
    } & React.RefAttributes<TamaguiElement>>;
    Action: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@tamagui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").StackStyleBase, {}>> | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | "displayWhenAdapted"> & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Cancel: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "scope" | `$${string}` | `$${number}` | import("@tamagui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").StackStyleBase, {}>> | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | "displayWhenAdapted"> & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogCloseProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Title: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "theme" | "debug" | "scope" | "children" | `$${string}` | `$${number}` | import("@tamagui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "id" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "style" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "size" | "unstyled" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "numberOfLines" | "onTextLayout" | "maxFontSizeMultiplier" | "minimumFontScale" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | keyof import("@tamagui/core").TextStylePropsBase | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/core").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }>>> & Omit<DialogTitleProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogTitleProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Description: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "theme" | "debug" | "scope" | "children" | `$${string}` | `$${number}` | import("@tamagui/core").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "id" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "style" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "size" | "unstyled" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "numberOfLines" | "onTextLayout" | "maxFontSizeMultiplier" | "minimumFontScale" | "adjustsFontSizeToFit" | "dynamicTypeRamp" | "suppressHighlighting" | "lineBreakStrategyIOS" | "selectable" | "selectionColor" | "textBreakStrategy" | "dataDetectorType" | "android_hyphenationFrequency" | keyof import("@tamagui/core").TextStylePropsBase | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/core").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }>>> & Omit<DialogDescriptionProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<DialogDescriptionProps, "scope"> & {
        scope?: AlertDialogScopes;
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
};
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, };
export type { AlertDialogActionProps, AlertDialogCancelProps, AlertDialogContentProps, AlertDialogDescriptionProps, AlertDialogOverlayProps, AlertDialogPortalProps, AlertDialogProps, AlertDialogTitleProps, AlertDialogTriggerProps, };
//# sourceMappingURL=AlertDialog.d.ts.map