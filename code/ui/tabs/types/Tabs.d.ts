import { RNTamaguiViewNonStyleProps } from '@tamagui/core/types';
import type { GroupProps } from '@tamagui/group';
import { RovingFocusGroup } from '@tamagui/roving-focus';
import type { GetProps, SizeTokens, StackStyleBase, StaticConfigPublic, TamaDefer, TamaguiComponent, TamaguiElement } from '@tamagui/web';
import * as React from 'react';
import type { LayoutRectangle } from 'react-native';
type TabsListFrameProps = GroupProps;
type TabsListProps = TabsListFrameProps & {
    /**
     * Whether to loop over after reaching the end or start of the items
     * @default true
     */
    loop?: boolean;
};
declare const TabsTriggerFrame: TamaguiComponent<TamaDefer, TamaguiElement, RNTamaguiViewNonStyleProps, StackStyleBase, {
    disabled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | {
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
    size?: SizeTokens | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
}, StaticConfigPublic>;
/**
 * @deprecated Use `TabLayout` instead
 */
type TabsTriggerLayout = LayoutRectangle;
type TabLayout = LayoutRectangle;
type InteractionType = 'select' | 'focus' | 'hover';
type TabsTriggerFrameProps = GetProps<typeof TabsTriggerFrame>;
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
declare const TabsContentFrame: TamaguiComponent<TamaDefer, TamaguiElement, RNTamaguiViewNonStyleProps, StackStyleBase, {
    elevation?: number | import("@tamagui/core/types").SizeTokens | undefined;
    inset?: number | import("@tamagui/core/types").SizeTokens | {
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
}, StaticConfigPublic>;
type TabsContentFrameProps = GetProps<typeof TabsContentFrame>;
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
type TabsContextValue = {
    baseId: string;
    value?: string;
    onChange: (value: string) => void;
    orientation?: TabsProps['orientation'];
    dir?: TabsProps['dir'];
    activationMode?: TabsProps['activationMode'];
    size: SizeTokens;
    registerTrigger: () => void;
    unregisterTrigger: () => void;
    triggersCount: number;
};
declare const useTabsContext: (scope?: string) => TabsContextValue;
declare const TabsFrame: TamaguiComponent<TamaDefer, TamaguiElement, RNTamaguiViewNonStyleProps, StackStyleBase, {
    size?: import("@tamagui/core/types").SizeTokens | undefined;
    elevation?: number | import("@tamagui/core/types").SizeTokens | undefined;
    inset?: number | import("@tamagui/core/types").SizeTokens | {
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
}, StaticConfigPublic>;
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup>;
type TabsFrameProps = GetProps<typeof TabsFrame>;
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
export declare const Tabs: React.ForwardRefExoticComponent<Omit<import("@tamagui/web").GetFinalProps<RNTamaguiViewNonStyleProps, StackStyleBase, {
    size?: import("@tamagui/core/types").SizeTokens | undefined;
    elevation?: number | import("@tamagui/core/types").SizeTokens | undefined;
    inset?: number | import("@tamagui/core/types").SizeTokens | {
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
}>, keyof TabsExtraProps<string>> & TabsExtraProps<string> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<RNTamaguiViewNonStyleProps, StackStyleBase, {
    size?: import("@tamagui/core/types").SizeTokens | undefined;
    elevation?: number | import("@tamagui/core/types").SizeTokens | undefined;
    inset?: number | import("@tamagui/core/types").SizeTokens | {
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
}>, keyof TabsExtraProps<string>> & TabsExtraProps<string>, TamaguiElement, RNTamaguiViewNonStyleProps & TabsExtraProps<string>, StackStyleBase, {
    size?: import("@tamagui/core/types").SizeTokens | undefined;
    elevation?: number | import("@tamagui/core/types").SizeTokens | undefined;
    inset?: number | import("@tamagui/core/types").SizeTokens | {
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
}, StaticConfigPublic> & Omit<StaticConfigPublic, "staticConfig" | "extractable" | "styleable"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<RNTamaguiViewNonStyleProps, StackStyleBase, {
        size?: import("@tamagui/core/types").SizeTokens | undefined;
        elevation?: number | import("@tamagui/core/types").SizeTokens | undefined;
        inset?: number | import("@tamagui/core/types").SizeTokens | {
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
    }>, keyof TabsExtraProps<string>> & TabsExtraProps<string>, TamaguiElement, RNTamaguiViewNonStyleProps & TabsExtraProps<string>, StackStyleBase, {
        size?: import("@tamagui/core/types").SizeTokens | undefined;
        elevation?: number | import("@tamagui/core/types").SizeTokens | undefined;
        inset?: number | import("@tamagui/core/types").SizeTokens | {
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
    }, StaticConfigPublic];
} & {
    List: React.ForwardRefExoticComponent<Omit<RNTamaguiViewNonStyleProps, "elevation" | keyof StackStyleBase | "transparent" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless" | "size" | "unstyled"> & import("@tamagui/web").WithThemeValues<StackStyleBase> & {
        elevation?: number | import("@tamagui/core/types").SizeTokens | undefined;
        inset?: number | import("@tamagui/core/types").SizeTokens | {
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
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<StackStyleBase> & {
        elevation?: number | import("@tamagui/core/types").SizeTokens | undefined;
        inset?: number | import("@tamagui/core/types").SizeTokens | {
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
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<StackStyleBase, {
        elevation?: number | import("@tamagui/core/types").SizeTokens | undefined;
        inset?: number | import("@tamagui/core/types").SizeTokens | {
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
    Trigger: TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<RNTamaguiViewNonStyleProps, StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }>, "theme" | "debug" | "hitSlop" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "id" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "onStartShouldSetResponder" | "dataSet" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "href" | "hrefAttrs" | "elevationAndroid" | "rel" | "download" | "focusable" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "style" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "elevation" | keyof StackStyleBase | "transparent" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless" | "size" | "unstyled" | `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "active" | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<StackStyleBase>>> | "value" | "onInteraction" | "disableActiveTheme" | "__scopeTabs"> & Omit<RNTamaguiViewNonStyleProps, "disabled" | "elevation" | keyof StackStyleBase | "transparent" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless" | "size" | "unstyled" | "active"> & import("@tamagui/web").WithThemeValues<StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Disables setting the active theme when tab is active */
        disableActiveTheme?: boolean;
    } & {
        __scopeTabs?: string;
    }, TamaguiElement, RNTamaguiViewNonStyleProps & Omit<RNTamaguiViewNonStyleProps, "disabled" | "elevation" | keyof StackStyleBase | "transparent" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless" | "size" | "unstyled" | "active"> & import("@tamagui/web").WithThemeValues<StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Disables setting the active theme when tab is active */
        disableActiveTheme?: boolean;
    } & {
        __scopeTabs?: string;
    }, StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }, StaticConfigPublic>;
    Tab: TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<RNTamaguiViewNonStyleProps, StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }>, "theme" | "debug" | "hitSlop" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "id" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "onStartShouldSetResponder" | "dataSet" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "href" | "hrefAttrs" | "elevationAndroid" | "rel" | "download" | "focusable" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "style" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onFocus" | "onBlur" | "elevation" | keyof StackStyleBase | "transparent" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless" | "size" | "unstyled" | `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "active" | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<StackStyleBase>>> | "value" | "onInteraction" | "disableActiveTheme" | "__scopeTabs"> & Omit<RNTamaguiViewNonStyleProps, "disabled" | "elevation" | keyof StackStyleBase | "transparent" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless" | "size" | "unstyled" | "active"> & import("@tamagui/web").WithThemeValues<StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Disables setting the active theme when tab is active */
        disableActiveTheme?: boolean;
    } & {
        __scopeTabs?: string;
    }, TamaguiElement, RNTamaguiViewNonStyleProps & Omit<RNTamaguiViewNonStyleProps, "disabled" | "elevation" | keyof StackStyleBase | "transparent" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless" | "size" | "unstyled" | "active"> & import("@tamagui/web").WithThemeValues<StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<StackStyleBase> & {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Disables setting the active theme when tab is active */
        disableActiveTheme?: boolean;
    } & {
        __scopeTabs?: string;
    }, StackStyleBase, {
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
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
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }, StaticConfigPublic>;
    Content: TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<RNTamaguiViewNonStyleProps, StackStyleBase, {
        elevation?: number | import("@tamagui/core/types").SizeTokens | undefined;
        inset?: number | import("@tamagui/core/types").SizeTokens | {
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
    }>, keyof TabsContentExtraProps> & TabsContentExtraProps, TamaguiElement, RNTamaguiViewNonStyleProps & TabsContentExtraProps, StackStyleBase, {
        elevation?: number | import("@tamagui/core/types").SizeTokens | undefined;
        inset?: number | import("@tamagui/core/types").SizeTokens | {
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
    }, StaticConfigPublic>;
};
export { useTabsContext };
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsTriggerLayout, TabsTabProps, TabsContentProps, TabLayout, };
//# sourceMappingURL=Tabs.d.ts.map