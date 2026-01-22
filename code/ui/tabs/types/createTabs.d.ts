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
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    unstyled?: boolean | undefined;
}>, keyof TabsExtraProps<string>> & TabsExtraProps<string> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    unstyled?: boolean | undefined;
}>, keyof TabsExtraProps<string>> & TabsExtraProps<string>, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & TabsExtraProps<string>, import("@tamagui/web").StackStyleBase, {
    size?: import("@tamagui/web").SizeTokens | undefined;
    elevation?: number | import("@tamagui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: import("@tamagui/web").SizeTokens | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        unstyled?: boolean | undefined;
    }>, keyof TabsExtraProps<string>> & TabsExtraProps<string>, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & TabsExtraProps<string>, import("@tamagui/web").StackStyleBase, {
        size?: import("@tamagui/web").SizeTokens | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    List: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "size" | "fullscreen" | "unstyled"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
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
    Trigger: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }>, "theme" | "debug" | `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "id" | "render" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onStartShouldSetResponder" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "elevationAndroid" | "rel" | "download" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "style" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMoveCapture" | "onPointerCancelCapture" | "onPointerDownCapture" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | keyof import("@tamagui/web").StackStyleBase | "size" | "unstyled" | "activeStyle" | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>>> | "value" | "onInteraction" | "activeTheme" | "__scopeTabs"> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | keyof import("@tamagui/web").StackStyleBase | "size" | "unstyled" | "activeStyle"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Custom styles to apply when tab is active */
        activeStyle?: TabsTriggerFrameProps;
        /** Theme to apply when tab is active (use null for no theme) */
        activeTheme?: string | null;
    } & {
        __scopeTabs?: string;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | keyof import("@tamagui/web").StackStyleBase | "size" | "unstyled" | "activeStyle"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Custom styles to apply when tab is active */
        activeStyle?: TabsTriggerFrameProps;
        /** Theme to apply when tab is active (use null for no theme) */
        activeTheme?: string | null;
    } & {
        __scopeTabs?: string;
    }, import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, {
        accept: {
            readonly activeStyle: "style";
        };
    }>;
    Tab: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }>, "theme" | "debug" | `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "id" | "render" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onStartShouldSetResponder" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "elevationAndroid" | "rel" | "download" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "style" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMoveCapture" | "onPointerCancelCapture" | "onPointerDownCapture" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | keyof import("@tamagui/web").StackStyleBase | "size" | "unstyled" | "activeStyle" | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>>> | "value" | "onInteraction" | "activeTheme" | "__scopeTabs"> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | keyof import("@tamagui/web").StackStyleBase | "size" | "unstyled" | "activeStyle"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Custom styles to apply when tab is active */
        activeStyle?: TabsTriggerFrameProps;
        /** Theme to apply when tab is active (use null for no theme) */
        activeTheme?: string | null;
    } & {
        __scopeTabs?: string;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disabled" | keyof import("@tamagui/web").StackStyleBase | "size" | "unstyled" | "activeStyle"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }> & {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }>> & {
        /** The value for the tabs state to be changed to after activation of the trigger */
        value: string;
        /** Used for making custom indicators when trigger interacted with */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Custom styles to apply when tab is active */
        activeStyle?: TabsTriggerFrameProps;
        /** Theme to apply when tab is active (use null for no theme) */
        activeTheme?: string | null;
    } & {
        __scopeTabs?: string;
    }, import("@tamagui/web").StackStyleBase & {
        readonly activeStyle?: Partial<import("@tamagui/web").InferStyleProps<React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>> & React.RefAttributes<TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
            __tama: [import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, {}];
        }, {
            accept: {
                readonly activeStyle: "style";
            };
        }>> | undefined;
    }, {
        disabled?: boolean | undefined;
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, {
        accept: {
            readonly activeStyle: "style";
        };
    }>;
    Content: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, keyof TabsContentExtraProps> & TabsContentExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & TabsContentExtraProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
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
    /** Custom styles to apply when tab is active */
    activeStyle?: TabsTriggerFrameProps;
    /** Theme to apply when tab is active (use null for no theme) */
    activeTheme?: string | null;
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
export type { TabLayout, TabsContentProps, TabsListProps, TabsProps, TabsTabProps, TabsTriggerLayout, TabsTriggerProps, };
//# sourceMappingURL=createTabs.d.ts.map