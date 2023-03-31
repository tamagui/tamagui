import { Scope } from '@tamagui/create-context';
import { GroupProps } from '@tamagui/group';
import { RovingFocusGroup } from '@tamagui/roving-focus';
import { GetProps, SizeTokens } from '@tamagui/web';
import React from 'react';
declare const createToggleGroupScope: import("@tamagui/create-context").CreateScope;
declare const ToggleGroupItemFrame: import("@tamagui/web").TamaguiComponent<(Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}, "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
} & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}, "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
}, "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}>>) | (Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, string | number> & {
    [x: string]: undefined;
}>>), import("@tamagui/web").TamaguiElement, Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps, {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
} & ({} | {
    [x: string]: undefined;
})>;
type ToggleGroupItemProps = GetProps<typeof ToggleGroupItemFrame> & {
    value: string;
    id?: string;
    disabled?: boolean;
    size?: SizeTokens;
};
interface ToggleGroupSingleProps extends ToggleGroupImplSingleProps {
    type: 'single';
}
interface ToggleGroupMultipleProps extends ToggleGroupImplMultipleProps {
    type: 'multiple';
}
declare const ToggleGroup: React.ForwardRefExoticComponent<(ToggleGroupSingleProps | ToggleGroupMultipleProps) & React.RefAttributes<HTMLElement>> & {
    Item: React.ForwardRefExoticComponent<((Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    }, "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless"> & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    }>> & {
        value: string;
        id?: string | undefined;
        disabled?: boolean | undefined;
        size?: SizeTokens | undefined;
    }) | Omit<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    }, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: SizeTokens | undefined;
    } & {
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | "all" | undefined;
    }, string | number> & {
        [x: string]: undefined;
    }>> & {
        value: string;
        id?: string | undefined;
        disabled?: boolean | undefined;
        size?: SizeTokens | undefined;
    }, "ref">) & React.RefAttributes<HTMLButtonElement>>;
};
interface ToggleGroupImplSingleProps extends ToggleGroupImplProps {
    /**
     * The controlled stateful value of the item that is pressed.
     */
    value?: string;
    /**
     * The value of the item that is pressed when initially rendered. Use
     * `defaultValue` if you do not need to control the state of a toggle group.
     */
    defaultValue?: string;
    /**
     * The callback that fires when the value of the toggle group changes.
     */
    onValueChange?(value: string): void;
}
interface ToggleGroupImplMultipleProps extends ToggleGroupImplProps {
    /**
     * The controlled stateful value of the items that are pressed.
     */
    value?: string[];
    /**
     * The value of the items that are pressed when initially rendered. Use
     * `defaultValue` if you do not need to control the state of a toggle group.
     */
    defaultValue?: string[];
    /**
     * The callback that fires when the state of the toggle group changes.
     */
    onValueChange?(value: string[]): void;
}
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup>;
declare const ToggleGroupImplElementFrame: import("@tamagui/web").TamaguiComponent<(Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
} & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
}>> & {
    axis?: "horizontal" | "vertical" | undefined;
    scrollable?: boolean | undefined;
    showScrollIndicator?: boolean | undefined;
    disabled?: boolean | undefined;
    disablePassBorderRadius?: (boolean | "bottom" | "end" | "start" | "top") | undefined;
    forceUseItem?: boolean | undefined;
} & {
    __scopeGroup?: Scope<any>;
} & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Omit<import("@tamagui/web").StackProps, "removeClippedSubviews" | "style" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityLabelledBy" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityLanguage" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "elevation" | "backgroundColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderColor" | "borderEndColor" | "borderLeftColor" | "borderLeftWidth" | "borderRadius" | "borderRightColor" | "borderRightWidth" | "borderStartColor" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderTopWidth" | "borderWidth" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderEndWidth" | "borderStartWidth" | "bottom" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "right" | "start" | "top" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless" | "fullscreen" | `$${string}` | `$${number}` | keyof import("@tamagui/web").TransformStyleProps | keyof {
    pointerEvents?: "box-none" | "none" | "box-only" | "auto" | undefined;
    cursor?: import("csstype").Property.Cursor | undefined;
    contain?: import("csstype").Property.Contain | undefined;
    display?: "flex" | "none" | "inherit" | "inline" | "block" | "contents" | "inline-flex" | undefined;
    gap?: import("@tamagui/web").SpaceTokens | undefined;
    columnGap?: import("@tamagui/web").SpaceTokens | undefined;
    rowGap?: import("@tamagui/web").SpaceTokens | undefined;
    userSelect?: import("csstype").Property.UserSelect | undefined;
    outlineColor?: import("csstype").Property.OutlineColor | undefined;
    outlineStyle?: import("csstype").Property.OutlineStyle | undefined;
    outlineOffset?: import("csstype").Property.OutlineOffset<0 | (string & {})> | undefined;
    outlineWidth?: import("csstype").Property.OutlineWidth<0 | (string & {})> | undefined;
} | keyof import("@tamagui/web").TamaguiComponentPropsBase | keyof import("@tamagui/core/types/reactNativeTypes").RNViewProps | "size" | "unstyled" | keyof import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
}>> | "axis" | "scrollable" | "showScrollIndicator" | "disablePassBorderRadius" | "forceUseItem" | "__scopeGroup" | keyof React.RefAttributes<import("@tamagui/web").TamaguiElement>>) | (Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
} & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
}>> & {
    axis?: "horizontal" | "vertical" | undefined;
    scrollable?: boolean | undefined;
    showScrollIndicator?: boolean | undefined;
    disabled?: boolean | undefined;
    disablePassBorderRadius?: (boolean | "bottom" | "end" | "start" | "top") | undefined;
    forceUseItem?: boolean | undefined;
} & {
    __scopeGroup?: Scope<any>;
} & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Omit<import("@tamagui/web").StackProps, "removeClippedSubviews" | "style" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityLabelledBy" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityLanguage" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "elevation" | "backgroundColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderColor" | "borderEndColor" | "borderLeftColor" | "borderLeftWidth" | "borderRadius" | "borderRightColor" | "borderRightWidth" | "borderStartColor" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderTopWidth" | "borderWidth" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderEndWidth" | "borderStartWidth" | "bottom" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "right" | "start" | "top" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless" | "fullscreen" | `$${string}` | `$${number}` | keyof import("@tamagui/web").TransformStyleProps | keyof {
    pointerEvents?: "box-none" | "none" | "box-only" | "auto" | undefined;
    cursor?: import("csstype").Property.Cursor | undefined;
    contain?: import("csstype").Property.Contain | undefined;
    display?: "flex" | "none" | "inherit" | "inline" | "block" | "contents" | "inline-flex" | undefined;
    gap?: import("@tamagui/web").SpaceTokens | undefined;
    columnGap?: import("@tamagui/web").SpaceTokens | undefined;
    rowGap?: import("@tamagui/web").SpaceTokens | undefined;
    userSelect?: import("csstype").Property.UserSelect | undefined;
    outlineColor?: import("csstype").Property.OutlineColor | undefined;
    outlineStyle?: import("csstype").Property.OutlineStyle | undefined;
    outlineOffset?: import("csstype").Property.OutlineOffset<0 | (string & {})> | undefined;
    outlineWidth?: import("csstype").Property.OutlineWidth<0 | (string & {})> | undefined;
} | keyof import("@tamagui/web").TamaguiComponentPropsBase | keyof import("@tamagui/core/types/reactNativeTypes").RNViewProps | "size" | "unstyled" | keyof import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
}>> | "axis" | "scrollable" | "showScrollIndicator" | "disablePassBorderRadius" | "forceUseItem" | "__scopeGroup" | keyof React.RefAttributes<import("@tamagui/web").TamaguiElement>> & Omit<{}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
} & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
}>> & {
    axis?: "horizontal" | "vertical" | undefined;
    scrollable?: boolean | undefined;
    showScrollIndicator?: boolean | undefined;
    disabled?: boolean | undefined;
    disablePassBorderRadius?: (boolean | "bottom" | "end" | "start" | "top") | undefined;
    forceUseItem?: boolean | undefined;
} & {
    __scopeGroup?: Scope<any>;
} & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Omit<import("@tamagui/web").StackProps, "removeClippedSubviews" | "style" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityLabelledBy" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityLanguage" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "elevation" | "backgroundColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderColor" | "borderEndColor" | "borderLeftColor" | "borderLeftWidth" | "borderRadius" | "borderRightColor" | "borderRightWidth" | "borderStartColor" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderTopWidth" | "borderWidth" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderEndWidth" | "borderStartWidth" | "bottom" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "right" | "start" | "top" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless" | "fullscreen" | `$${string}` | `$${number}` | keyof import("@tamagui/web").TransformStyleProps | keyof {
    pointerEvents?: "box-none" | "none" | "box-only" | "auto" | undefined;
    cursor?: import("csstype").Property.Cursor | undefined;
    contain?: import("csstype").Property.Contain | undefined;
    display?: "flex" | "none" | "inherit" | "inline" | "block" | "contents" | "inline-flex" | undefined;
    gap?: import("@tamagui/web").SpaceTokens | undefined;
    columnGap?: import("@tamagui/web").SpaceTokens | undefined;
    rowGap?: import("@tamagui/web").SpaceTokens | undefined;
    userSelect?: import("csstype").Property.UserSelect | undefined;
    outlineColor?: import("csstype").Property.OutlineColor | undefined;
    outlineStyle?: import("csstype").Property.OutlineStyle | undefined;
    outlineOffset?: import("csstype").Property.OutlineOffset<0 | (string & {})> | undefined;
    outlineWidth?: import("csstype").Property.OutlineWidth<0 | (string & {})> | undefined;
} | keyof import("@tamagui/web").TamaguiComponentPropsBase | keyof import("@tamagui/core/types/reactNativeTypes").RNViewProps | "size" | "unstyled" | keyof import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
}>> | "axis" | "scrollable" | "showScrollIndicator" | "disablePassBorderRadius" | "forceUseItem" | "__scopeGroup" | keyof React.RefAttributes<import("@tamagui/web").TamaguiElement>> & Omit<{}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
} & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
}>> & {
    axis?: "horizontal" | "vertical" | undefined;
    scrollable?: boolean | undefined;
    showScrollIndicator?: boolean | undefined;
    disabled?: boolean | undefined;
    disablePassBorderRadius?: (boolean | "bottom" | "end" | "start" | "top") | undefined;
    forceUseItem?: boolean | undefined;
} & {
    __scopeGroup?: Scope<any>;
} & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Omit<import("@tamagui/web").StackProps, "removeClippedSubviews" | "style" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityLabelledBy" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityLanguage" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "elevation" | "backgroundColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderColor" | "borderEndColor" | "borderLeftColor" | "borderLeftWidth" | "borderRadius" | "borderRightColor" | "borderRightWidth" | "borderStartColor" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderTopWidth" | "borderWidth" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderEndWidth" | "borderStartWidth" | "bottom" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "right" | "start" | "top" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless" | "fullscreen" | `$${string}` | `$${number}` | keyof import("@tamagui/web").TransformStyleProps | keyof {
    pointerEvents?: "box-none" | "none" | "box-only" | "auto" | undefined;
    cursor?: import("csstype").Property.Cursor | undefined;
    contain?: import("csstype").Property.Contain | undefined;
    display?: "flex" | "none" | "inherit" | "inline" | "block" | "contents" | "inline-flex" | undefined;
    gap?: import("@tamagui/web").SpaceTokens | undefined;
    columnGap?: import("@tamagui/web").SpaceTokens | undefined;
    rowGap?: import("@tamagui/web").SpaceTokens | undefined;
    userSelect?: import("csstype").Property.UserSelect | undefined;
    outlineColor?: import("csstype").Property.OutlineColor | undefined;
    outlineStyle?: import("csstype").Property.OutlineStyle | undefined;
    outlineOffset?: import("csstype").Property.OutlineOffset<0 | (string & {})> | undefined;
    outlineWidth?: import("csstype").Property.OutlineWidth<0 | (string & {})> | undefined;
} | keyof import("@tamagui/web").TamaguiComponentPropsBase | keyof import("@tamagui/core/types/reactNativeTypes").RNViewProps | "size" | "unstyled" | keyof import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
}>> | "axis" | "scrollable" | "showScrollIndicator" | "disablePassBorderRadius" | "forceUseItem" | "__scopeGroup" | keyof React.RefAttributes<import("@tamagui/web").TamaguiElement>> & Omit<{}, string | number> & {
    [x: string]: undefined;
}>>), import("@tamagui/web").TamaguiElement, Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
} & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
}>> & {
    axis?: "horizontal" | "vertical" | undefined;
    scrollable?: boolean | undefined;
    showScrollIndicator?: boolean | undefined;
    disabled?: boolean | undefined;
    disablePassBorderRadius?: (boolean | "bottom" | "end" | "start" | "top") | undefined;
    forceUseItem?: boolean | undefined;
} & {
    __scopeGroup?: Scope<any>;
} & React.RefAttributes<import("@tamagui/web").TamaguiElement> & Omit<import("@tamagui/web").StackProps, "removeClippedSubviews" | "style" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityLabelledBy" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityLanguage" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "elevation" | "backgroundColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderBottomWidth" | "borderColor" | "borderEndColor" | "borderLeftColor" | "borderLeftWidth" | "borderRadius" | "borderRightColor" | "borderRightWidth" | "borderStartColor" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "borderTopWidth" | "borderWidth" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderEndWidth" | "borderStartWidth" | "bottom" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "right" | "start" | "top" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "transparent" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "circular" | "backgrounded" | "radiused" | "padded" | "chromeless" | "fullscreen" | `$${string}` | `$${number}` | keyof import("@tamagui/web").TransformStyleProps | keyof {
    pointerEvents?: "box-none" | "none" | "box-only" | "auto" | undefined;
    cursor?: import("csstype").Property.Cursor | undefined;
    contain?: import("csstype").Property.Contain | undefined;
    display?: "flex" | "none" | "inherit" | "inline" | "block" | "contents" | "inline-flex" | undefined;
    gap?: import("@tamagui/web").SpaceTokens | undefined;
    columnGap?: import("@tamagui/web").SpaceTokens | undefined;
    rowGap?: import("@tamagui/web").SpaceTokens | undefined;
    userSelect?: import("csstype").Property.UserSelect | undefined;
    outlineColor?: import("csstype").Property.OutlineColor | undefined;
    outlineStyle?: import("csstype").Property.OutlineStyle | undefined;
    outlineOffset?: import("csstype").Property.OutlineOffset<0 | (string & {})> | undefined;
    outlineWidth?: import("csstype").Property.OutlineWidth<0 | (string & {})> | undefined;
} | keyof import("@tamagui/web").TamaguiComponentPropsBase | keyof import("@tamagui/core/types/reactNativeTypes").RNViewProps | "size" | "unstyled" | keyof import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | "onLayout" | keyof import("react-native").GestureResponderHandlers> & import("@tamagui/web").ExtendBaseStackProps & import("@tamagui/web").TamaguiComponentPropsBase & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/core/types/reactNativeTypes").RNViewProps & Omit<{
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: SizeTokens | undefined;
} & {
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | "all" | undefined;
}, "size" | "unstyled"> & {
    readonly unstyled?: boolean | undefined;
    readonly size?: any;
}>> | "axis" | "scrollable" | "showScrollIndicator" | "disablePassBorderRadius" | "forceUseItem" | "__scopeGroup" | keyof React.RefAttributes<import("@tamagui/web").TamaguiElement>>, {} | {
    [x: string]: undefined;
}>;
type ToggleGroupImplProps = GetProps<typeof ToggleGroupImplElementFrame> & GroupProps & {
    disabled?: boolean;
    orientation?: RovingFocusGroupProps['orientation'];
    rovingFocus?: boolean;
    dir?: RovingFocusGroupProps['dir'];
    loop?: RovingFocusGroupProps['loop'];
};
export { ToggleGroup, createToggleGroupScope };
export type { ToggleGroupItemProps, ToggleGroupMultipleProps, ToggleGroupSingleProps };
//# sourceMappingURL=ToggleGroup.d.ts.map