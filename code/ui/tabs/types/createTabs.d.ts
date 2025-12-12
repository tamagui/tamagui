import type { GroupProps } from '@tamagui/group';
import { type RovingFocusGroupProps } from '@tamagui/roving-focus';
import type { GetProps, StackProps, TamaguiElement } from '@tamagui/web';
import * as React from 'react';
import type { LayoutRectangle } from 'react-native';
import { DefaultTabsContentFrame, DefaultTabsFrame, DefaultTabsTabFrame } from './Tabs';
type TabsComponent = (props: {
    direction: 'horizontal' | 'vertical';
} & StackProps) => any;
type TabComponent = (props: {
    active?: boolean;
} & StackProps) => any;
type ContentComponent = (props: StackProps) => any;
export declare function createTabs<C extends TabsComponent, T extends TabComponent, F extends ContentComponent>(createProps: {
    ContentFrame: F;
    TabFrame: T;
    TabsFrame: C;
}): React.ForwardRefExoticComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    inset?: number | import("@tamagui/web").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    unstyled?: boolean | undefined;
}>, keyof TabsExtraProps<string>> & TabsExtraProps<string> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    inset?: number | import("@tamagui/web").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    unstyled?: boolean | undefined;
}>, keyof TabsExtraProps<string>> & TabsExtraProps<string>, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & TabsExtraProps<string>, import("@tamagui/web").StackStyleBase, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    inset?: number | import("@tamagui/web").SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig" | "extractable" | "styleable"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: import("@tamagui/web").SizeTokens | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
    }>, keyof TabsExtraProps<string>> & TabsExtraProps<string>, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & TabsExtraProps<string>, import("@tamagui/web").StackStyleBase, {
        size?: import("@tamagui/web").SizeTokens | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    List: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "size" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "unstyled" | "transparent" | "backgrounded" | "radiused" | "padded" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
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
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
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
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
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
    }>> & import("@tamagui/group").GroupExtraProps & {
        /**
         * Whether to loop over after reaching the end or start of the items
         * @default true
         */
        loop?: boolean;
    } & React.RefAttributes<TamaguiElement>>;
    /**
     * @deprecated Use Tabs.Tab instead
     */
    Trigger: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "theme" | "debug" | `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "id" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "onStartShouldSetResponder" | "dataSet" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "href" | "hrefAttrs" | "elevationAndroid" | "rel" | "download" | "focusable" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "style" | "onFocus" | "onBlur" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "size" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "unstyled" | "transparent" | "backgrounded" | "radiused" | "padded" | "chromeless" | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> | "value" | "onInteraction" | "disableActiveTheme" | "__scopeTabs"> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "size" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "unstyled" | "transparent" | "backgrounded" | "radiused" | "padded" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Disables setting the active theme when tab is active */
        disableActiveTheme?: boolean;
    } & {
        __scopeTabs?: string;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "size" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "unstyled" | "transparent" | "backgrounded" | "radiused" | "padded" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Disables setting the active theme when tab is active */
        disableActiveTheme?: boolean;
    } & {
        __scopeTabs?: string;
    }, import("@tamagui/web").StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Tab: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "theme" | "debug" | `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "id" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "onStartShouldSetResponder" | "dataSet" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "href" | "hrefAttrs" | "elevationAndroid" | "rel" | "download" | "focusable" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "style" | "onFocus" | "onBlur" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "size" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "unstyled" | "transparent" | "backgrounded" | "radiused" | "padded" | "chromeless" | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> | "value" | "onInteraction" | "disableActiveTheme" | "__scopeTabs"> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "size" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "unstyled" | "transparent" | "backgrounded" | "radiused" | "padded" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Disables setting the active theme when tab is active */
        disableActiveTheme?: boolean;
    } & {
        __scopeTabs?: string;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "size" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "unstyled" | "transparent" | "backgrounded" | "radiused" | "padded" | "chromeless"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Disables setting the active theme when tab is active */
        disableActiveTheme?: boolean;
    } & {
        __scopeTabs?: string;
    }, import("@tamagui/web").StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        unstyled?: boolean | undefined;
        transparent?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Content: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
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
    }>, keyof TabsContentExtraProps> & TabsContentExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & TabsContentExtraProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        inset?: number | import("@tamagui/web").SizeTokens | {
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
    }, import("@tamagui/web").StaticConfigPublic>;
};
type TabsFrameProps = GetProps<typeof DefaultTabsFrame>;
type TabsExtraProps<Tab = string> = {
    /** The value for the selected tab, if controlled */
    value?: string;
    /** The value of the tab to select by default, if uncontrolled */
    defaultValue?: Tab;
    /** A function called when a new tab is selected */
    onValueChange?: (value: Tab) => void;
    /**
     * The orientation the tabs are layed out.
     * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
     * @defaultValue horizontal
     */
    orientation?: RovingFocusGroupProps['orientation'];
    /**
     * The direction of navigation between toolbar items.
     */
    dir?: RovingFocusGroupProps['dir'];
    /**
     * Whether a tab is activated automatically or manually. Only supported in web.
     * @defaultValue automatic
     * */
    activationMode?: 'automatic' | 'manual';
};
type TabsProps<Tab = string> = TabsFrameProps & TabsExtraProps<Tab>;
type TabsListFrameProps = GroupProps;
type TabsListProps = TabsListFrameProps & {
    /**
     * Whether to loop over after reaching the end or start of the items
     * @default true
     */
    loop?: boolean;
};
type InteractionType = 'select' | 'focus' | 'hover';
type TabLayout = LayoutRectangle;
type TabsTriggerFrameProps = GetProps<typeof DefaultTabsTabFrame>;
/**
 * @deprecated use `TabTabsProps` instead
 */
type TabsTriggerProps = TabsTriggerFrameProps & {
    /** The value for the tabs state to be changed to after activation of the trigger */
    value: string;
    /** Used for making custom indicators when trigger interacted with */
    onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
    /** Disables setting the active theme when tab is active */
    disableActiveTheme?: boolean;
};
type TabsTabProps = TabsTriggerProps;
type TabsTriggerLayout = LayoutRectangle;
type TabsContentFrameProps = GetProps<typeof DefaultTabsContentFrame>;
type TabsContentExtraProps = {
    /** Will show the content when the value matches the state of Tabs root */
    value: string;
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with Tamagui animations.
     */
    forceMount?: true;
};
type TabsContentProps = TabsContentFrameProps & TabsContentExtraProps;
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsTriggerLayout, TabsTabProps, TabsContentProps, TabLayout, };
//# sourceMappingURL=createTabs.d.ts.map