import { type RovingFocusGroupProps } from '@tamagui/roving-focus';
import { type TokenSize } from '@tamagui/size';
import type { GetProps, TamaguiElement } from '@tamagui/web';
import * as React from 'react';
import type { LayoutRectangle } from 'react-native';
export declare const TabsFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: TokenSize | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: TokenSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const TabsListFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: TokenSize | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: TokenSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const TabsTabFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    disabled?: boolean | undefined;
    size?: TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    disabled?: boolean | undefined;
    size?: TokenSize | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        disabled?: boolean | undefined;
        size?: TokenSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const TabsContentFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: TokenSize | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: TokenSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
type TabsScopeProps = {
    __scopeTabs?: string;
};
type TabsFrameProps = GetProps<typeof TabsFrame>;
type TabsExtraProps<Tab = string> = TabsScopeProps & {
    /** The value for the selected tab, if controlled */
    value?: string;
    /** The value of the tab to select by default, if uncontrolled */
    defaultValue?: Tab;
    /** A function called when a new tab is selected */
    onValueChange?: (value: Tab) => void;
    /** Coordinates a size value with styled descendants. */
    size?: TokenSize;
    /**
     * The orientation the tabs are laid out.
     * Mainly so arrow navigation is done accordingly (left & right vs. up & down).
     * @defaultValue horizontal
     */
    orientation?: RovingFocusGroupProps['orientation'];
    /** The direction of navigation between tab triggers. */
    dir?: RovingFocusGroupProps['dir'];
    /**
     * Whether a tab is activated automatically or manually. Automatic activation is only
     * supported on web; native tabs always activate manually.
     * @defaultValue automatic
     */
    activationMode?: 'automatic' | 'manual';
};
export type TabsProps<Tab = string> = TabsFrameProps & TabsExtraProps<Tab>;
type TabsListExtraProps = TabsScopeProps & {
    /** Whether keyboard navigation loops after the first or last trigger. */
    loop?: boolean;
    /** Disables every trigger in the list. */
    disabled?: boolean;
};
export type TabsListProps = GetProps<typeof TabsListFrame> & TabsListExtraProps;
export type InteractionType = 'select' | 'focus' | 'hover';
export type TabLayout = LayoutRectangle;
export type TabsTriggerLayout = LayoutRectangle;
type TabsTabExtraProps = TabsScopeProps & {
    /** The value selected when this trigger is activated. */
    value: string;
    /** Reports the measured trigger rectangle for custom indicators. */
    onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
    /** Custom styles to apply while this trigger is selected. */
    activeStyle?: GetProps<typeof TabsTabFrame>;
    /** Theme to apply while this trigger is selected. */
    activeTheme?: string | null;
};
export type TabsTabProps = GetProps<typeof TabsTabFrame> & TabsTabExtraProps;
type TabsContentExtraProps = TabsScopeProps & {
    /** The value that selects this content. */
    value: string;
    /** Mounts the content even when its value is not selected. */
    forceMount?: boolean;
};
export type TabsContentProps = GetProps<typeof TabsContentFrame> & TabsContentExtraProps;
export declare const TabsList: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: TokenSize | undefined;
}>, "__scopeTabs" | "loop" | "size" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & TabsScopeProps & {
    /** Whether keyboard navigation loops after the first or last trigger. */
    loop?: boolean;
    /** Disables every trigger in the list. */
    disabled?: boolean;
}, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & TabsScopeProps & {
    /** Whether keyboard navigation loops after the first or last trigger. */
    loop?: boolean;
    /** Disables every trigger in the list. */
    disabled?: boolean;
}, import("@tamagui/web").StackStyleBase, {
    size?: TokenSize | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const TabsTab: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    disabled?: boolean | undefined;
    size?: TokenSize | undefined;
}>, "__scopeTabs" | "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "activeStyle" | "activeTheme" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "children" | "className" | "collapsable" | "collapsableChildren" | "componentName" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableOptimization" | "disabled" | "download" | "elevationAndroid" | "forceStyle" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "isTVSelectable" | "nativeID" | "needsOffscreenAlphaCompositing" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onInteraction" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchStart" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "screenReaderFocusable" | "shouldRasterizeIOS" | "size" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "tvParallaxMagnification" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "untilMeasured" | "value" | keyof import("@tamagui/web").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    disabled?: boolean | undefined;
    size?: TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & TabsScopeProps & {
    /** The value selected when this trigger is activated. */
    value: string;
    /** Reports the measured trigger rectangle for custom indicators. */
    onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
    /** Custom styles to apply while this trigger is selected. */
    activeStyle?: GetProps<typeof TabsTabFrame>;
    /** Theme to apply while this trigger is selected. */
    activeTheme?: string | null;
}, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    disabled?: boolean | undefined;
    size?: TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & TabsScopeProps & {
    /** The value selected when this trigger is activated. */
    value: string;
    /** Reports the measured trigger rectangle for custom indicators. */
    onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
    /** Custom styles to apply while this trigger is selected. */
    activeStyle?: GetProps<typeof TabsTabFrame>;
    /** Theme to apply while this trigger is selected. */
    activeTheme?: string | null;
}, import("@tamagui/web").StackStyleBase, {
    disabled?: boolean | undefined;
    size?: TokenSize | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const TabsContent: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: TokenSize | undefined;
}>, "__scopeTabs" | "forceMount" | "size" | "value" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & TabsScopeProps & {
    /** The value that selects this content. */
    value: string;
    /** Mounts the content even when its value is not selected. */
    forceMount?: boolean;
}, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & TabsScopeProps & {
    /** The value that selects this content. */
    value: string;
    /** Mounts the content even when its value is not selected. */
    forceMount?: boolean;
}, import("@tamagui/web").StackStyleBase, {
    size?: TokenSize | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const Tabs: React.FunctionComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: TokenSize | undefined;
}>, "__scopeTabs" | "activationMode" | "defaultValue" | "dir" | "onValueChange" | "orientation" | "size" | "value" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & TabsScopeProps & {
    /** The value for the selected tab, if controlled */
    value?: string;
    /** The value of the tab to select by default, if uncontrolled */
    defaultValue?: string | undefined;
    /** A function called when a new tab is selected */
    onValueChange?: ((value: string) => void) | undefined;
    /** Coordinates a size value with styled descendants. */
    size?: TokenSize;
    /**
     * The orientation the tabs are laid out.
     * Mainly so arrow navigation is done accordingly (left & right vs. up & down).
     * @defaultValue horizontal
     */
    orientation?: RovingFocusGroupProps['orientation'];
    /** The direction of navigation between tab triggers. */
    dir?: RovingFocusGroupProps['dir'];
    /**
     * Whether a tab is activated automatically or manually. Automatic activation is only
     * supported on web; native tabs always activate manually.
     * @defaultValue automatic
     */
    activationMode?: 'automatic' | 'manual';
} & {
    ref?: React.Ref<import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods)> | undefined;
}> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: TokenSize | undefined;
}>, "__scopeTabs" | "activationMode" | "defaultValue" | "dir" | "onValueChange" | "orientation" | "size" | "value" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & TabsScopeProps & {
    /** The value for the selected tab, if controlled */
    value?: string;
    /** The value of the tab to select by default, if uncontrolled */
    defaultValue?: string | undefined;
    /** A function called when a new tab is selected */
    onValueChange?: ((value: string) => void) | undefined;
    /** Coordinates a size value with styled descendants. */
    size?: TokenSize;
    /**
     * The orientation the tabs are laid out.
     * Mainly so arrow navigation is done accordingly (left & right vs. up & down).
     * @defaultValue horizontal
     */
    orientation?: RovingFocusGroupProps['orientation'];
    /** The direction of navigation between tab triggers. */
    dir?: RovingFocusGroupProps['dir'];
    /**
     * Whether a tab is activated automatically or manually. Automatic activation is only
     * supported on web; native tabs always activate manually.
     * @defaultValue automatic
     */
    activationMode?: 'automatic' | 'manual';
}, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: TokenSize | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & TabsScopeProps & {
    /** The value for the selected tab, if controlled */
    value?: string;
    /** The value of the tab to select by default, if uncontrolled */
    defaultValue?: string | undefined;
    /** A function called when a new tab is selected */
    onValueChange?: ((value: string) => void) | undefined;
    /** Coordinates a size value with styled descendants. */
    size?: TokenSize;
    /**
     * The orientation the tabs are laid out.
     * Mainly so arrow navigation is done accordingly (left & right vs. up & down).
     * @defaultValue horizontal
     */
    orientation?: RovingFocusGroupProps['orientation'];
    /** The direction of navigation between tab triggers. */
    dir?: RovingFocusGroupProps['dir'];
    /**
     * Whether a tab is activated automatically or manually. Automatic activation is only
     * supported on web; native tabs always activate manually.
     * @defaultValue automatic
     */
    activationMode?: 'automatic' | 'manual';
}, import("@tamagui/web").StackStyleBase, {
    size?: TokenSize | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: TokenSize | undefined;
    }>, "__scopeTabs" | "activationMode" | "defaultValue" | "dir" | "onValueChange" | "orientation" | "size" | "value" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        size?: TokenSize | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & TabsScopeProps & {
        /** The value for the selected tab, if controlled */
        value?: string;
        /** The value of the tab to select by default, if uncontrolled */
        defaultValue?: string | undefined;
        /** A function called when a new tab is selected */
        onValueChange?: ((value: string) => void) | undefined;
        /** Coordinates a size value with styled descendants. */
        size?: TokenSize;
        /**
         * The orientation the tabs are laid out.
         * Mainly so arrow navigation is done accordingly (left & right vs. up & down).
         * @defaultValue horizontal
         */
        orientation?: RovingFocusGroupProps['orientation'];
        /** The direction of navigation between tab triggers. */
        dir?: RovingFocusGroupProps['dir'];
        /**
         * Whether a tab is activated automatically or manually. Automatic activation is only
         * supported on web; native tabs always activate manually.
         * @defaultValue automatic
         */
        activationMode?: 'automatic' | 'manual';
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        size?: TokenSize | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & TabsScopeProps & {
        /** The value for the selected tab, if controlled */
        value?: string;
        /** The value of the tab to select by default, if uncontrolled */
        defaultValue?: string | undefined;
        /** A function called when a new tab is selected */
        onValueChange?: ((value: string) => void) | undefined;
        /** Coordinates a size value with styled descendants. */
        size?: TokenSize;
        /**
         * The orientation the tabs are laid out.
         * Mainly so arrow navigation is done accordingly (left & right vs. up & down).
         * @defaultValue horizontal
         */
        orientation?: RovingFocusGroupProps['orientation'];
        /** The direction of navigation between tab triggers. */
        dir?: RovingFocusGroupProps['dir'];
        /**
         * Whether a tab is activated automatically or manually. Automatic activation is only
         * supported on web; native tabs always activate manually.
         * @defaultValue automatic
         */
        activationMode?: 'automatic' | 'manual';
    }, import("@tamagui/web").StackStyleBase, {
        size?: TokenSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Frame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        size?: TokenSize | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
        ref?: React.Ref<TamaguiElement> | undefined;
    }> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: TokenSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
            size?: TokenSize | undefined;
        }, import("@tamagui/web").StaticConfigPublic];
    };
    List: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: TokenSize | undefined;
    }>, "__scopeTabs" | "loop" | "size" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        size?: TokenSize | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & TabsScopeProps & {
        /** Whether keyboard navigation loops after the first or last trigger. */
        loop?: boolean;
        /** Disables every trigger in the list. */
        disabled?: boolean;
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        size?: TokenSize | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & TabsScopeProps & {
        /** Whether keyboard navigation loops after the first or last trigger. */
        loop?: boolean;
        /** Disables every trigger in the list. */
        disabled?: boolean;
    }, import("@tamagui/web").StackStyleBase, {
        size?: TokenSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Tab: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        disabled?: boolean | undefined;
        size?: TokenSize | undefined;
    }>, "__scopeTabs" | "accessibilityActions" | "accessibilityElementsHidden" | "accessibilityHint" | "accessibilityIgnoresInvertColors" | "accessibilityLabel" | "accessibilityLabelledBy" | "accessibilityLanguage" | "accessibilityLargeContentTitle" | "accessibilityLiveRegion" | "accessibilityRespondsToUserInteraction" | "accessibilityRole" | "accessibilityShowsLargeContentViewer" | "accessibilityState" | "accessibilityValue" | "accessibilityViewIsModal" | "accessible" | "activeStyle" | "activeTheme" | "animatedBy" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-modal" | "aria-selected" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "asChild" | "children" | "className" | "collapsable" | "collapsableChildren" | "componentName" | "container" | "dangerouslySetInnerHTML" | "debug" | "disableClassName" | "disableOptimization" | "disabled" | "download" | "elevationAndroid" | "forceStyle" | "group" | "hasTVPreferredFocus" | "hitSlop" | "htmlFor" | "id" | "importantForAccessibility" | "isTVSelectable" | "nativeID" | "needsOffscreenAlphaCompositing" | "onAccessibilityAction" | "onAccessibilityEscape" | "onAccessibilityTap" | "onBeforeInput" | "onBlur" | "onChange" | "onClick" | "onContextMenu" | "onCopy" | "onCut" | "onDoubleClick" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDragStart" | "onDrop" | "onFocus" | "onInput" | "onInteraction" | "onKeyDown" | "onKeyUp" | "onLayout" | "onLongPress" | "onMagicTap" | "onMouseDown" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseOut" | "onMouseOver" | "onMouseUp" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onPaste" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPress" | "onPressIn" | "onPressOut" | "onResponderEnd" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderTerminate" | "onResponderTerminationRequest" | "onScroll" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onStartShouldSetResponder" | "onStartShouldSetResponderCapture" | "onTouchCancel" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchStart" | "onWheel" | "rel" | "removeClippedSubviews" | "render" | "renderToHardwareTextureAndroid" | "role" | "screenReaderFocusable" | "shouldRasterizeIOS" | "size" | "style" | "tabIndex" | "target" | "testID" | "theme" | "themeShallow" | "tvParallaxMagnification" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "untilMeasured" | "value" | keyof import("@tamagui/web").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        disabled?: boolean | undefined;
        size?: TokenSize | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & TabsScopeProps & {
        /** The value selected when this trigger is activated. */
        value: string;
        /** Reports the measured trigger rectangle for custom indicators. */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Custom styles to apply while this trigger is selected. */
        activeStyle?: GetProps<typeof TabsTabFrame>;
        /** Theme to apply while this trigger is selected. */
        activeTheme?: string | null;
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        disabled?: boolean | undefined;
        size?: TokenSize | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & TabsScopeProps & {
        /** The value selected when this trigger is activated. */
        value: string;
        /** Reports the measured trigger rectangle for custom indicators. */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Custom styles to apply while this trigger is selected. */
        activeStyle?: GetProps<typeof TabsTabFrame>;
        /** Theme to apply while this trigger is selected. */
        activeTheme?: string | null;
    }, import("@tamagui/web").StackStyleBase, {
        disabled?: boolean | undefined;
        size?: TokenSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Content: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: TokenSize | undefined;
    }>, "__scopeTabs" | "forceMount" | "size" | "value" | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/web").StackStyleBase> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        size?: TokenSize | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & TabsScopeProps & {
        /** The value that selects this content. */
        value: string;
        /** Mounts the content even when its value is not selected. */
        forceMount?: boolean;
    }, import("react-native").View | (HTMLElement & import("@tamagui/web").TamaguiElementMethods), import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        size?: TokenSize | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & TabsScopeProps & {
        /** The value that selects this content. */
        value: string;
        /** Mounts the content even when its value is not selected. */
        forceMount?: boolean;
    }, import("@tamagui/web").StackStyleBase, {
        size?: TokenSize | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=Tabs.d.ts.map