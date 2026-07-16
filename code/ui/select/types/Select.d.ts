import type { FontSizeTokens, GetProps, SizeTokens, TamaguiElement } from '@tamagui/core';
import * as React from 'react';
import type { SelectProps, SelectScopedProps } from './types';
declare const SelectValueFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@tamagui/web").FontSizeTokens | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export type SelectValueExtraProps = SelectScopedProps<{
    placeholder?: React.ReactNode;
}>;
export type SelectValueProps = GetProps<typeof SelectValueFrame> & SelectValueExtraProps;
export declare const SelectIcon: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
declare const SelectItemIndicatorFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type SelectItemIndicatorProps = SelectScopedProps<GetProps<typeof SelectItemIndicatorFrame>>;
declare const SelectIndicatorFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export type SelectIndicatorProps = GetProps<typeof SelectIndicatorFrame>;
export declare const SelectGroupFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
type SelectGroupProps = SelectScopedProps<GetProps<typeof SelectGroupFrame>>;
declare const SelectLabelFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
    size?: number | true | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | `$${number}` | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export type SelectLabelProps = SelectScopedProps<GetProps<typeof SelectLabelFrame>>;
export declare const SelectSeparator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    vertical?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const Select: (<Value extends string = string>(props: SelectScopedProps<SelectProps<Value>>) => import("react/jsx-runtime").JSX.Element) & {
    Adapt: ((props: import("@tamagui/adapt").AdaptProps) => import("react/jsx-runtime").JSX.Element) & {
        Contents: {
            ({ scope, ...rest }: {
                scope?: string;
            }): React.FunctionComponentElement<any>;
            shouldForwardSpace: boolean;
        };
    };
    Content: ({ children, scope, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, ...focusScopeProps }: import("./types").SelectContentProps & import("@tamagui/focus-scope").FocusScopeProps) => import("react/jsx-runtime").JSX.Element | null;
    Group: import("@tamagui/compose-refs").RefComponent<TamaguiElement, SelectGroupProps>;
    Icon: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Item: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").StackNonStyleProps, import("@tamagui/core").StackStyleBase, {
        size?: SizeTokens | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }>, keyof import("./SelectItem").SelectItemExtraProps> & import("./SelectItem").SelectItemExtraProps, TamaguiElement, import("@tamagui/core").StackNonStyleProps & import("./SelectItem").SelectItemExtraProps, import("@tamagui/core").StackStyleBase, {
        size?: SizeTokens | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    ItemIndicator: import("@tamagui/compose-refs").RefComponent<TamaguiElement, SelectItemIndicatorProps>;
    ItemText: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }>, "scope"> & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").TextStylePropsBase, {
        size?: FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Label: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: number | true | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | `$${number}` | undefined;
        unstyled?: boolean | undefined;
    }>, "scope"> & {
        scope?: any;
    }, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & {
        scope?: any;
    }, import("@tamagui/core").TextStylePropsBase, {
        size?: number | true | `$${string}` | `$${string}.${string}` | `$${string}.${number}` | `${number}rem` | import("@tamagui/core").UnionableNumber | import("@tamagui/core").UnionableString | `$${number}` | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    ScrollDownButton: import("@tamagui/compose-refs").RefComponent<TamaguiElement, import("./types").SelectScrollButtonProps>;
    ScrollUpButton: import("@tamagui/compose-refs").RefComponent<TamaguiElement, import("./types").SelectScrollButtonProps>;
    Separator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        vertical?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Trigger: import("@tamagui/compose-refs").RefComponent<TamaguiElement, import("./SelectTrigger").SelectTriggerProps>;
    Value: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>, "scope" | "placeholder"> & {
        placeholder?: React.ReactNode;
    } & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & {
        placeholder?: React.ReactNode;
    } & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Viewport: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "size" | "unstyled" | "scope" | "disableScroll"> & {
        size?: SizeTokens | true;
        disableScroll?: boolean;
        unstyled?: boolean;
    } & {
        scope?: import("./types").SelectScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & {
        size?: SizeTokens | true;
        disableScroll?: boolean;
        unstyled?: boolean;
    } & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").StackStyleBase, {
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        transparent?: boolean | undefined;
        circular?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Indicator: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
    }>, "theme" | "debug" | "hitSlop" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "render" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "onStartShouldSetResponder" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "elevationAndroid" | "rel" | "download" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "style" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMoveCapture" | "onPointerCancelCapture" | "onPointerDownCapture" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "elevation" | keyof import("@tamagui/core").StackStyleBase | "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | "scope" | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>>> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "unstyled" | "elevation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
    }>> & {
        scope?: import("./types").SelectScopes;
    }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "unstyled" | "elevation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
    }>> & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => import("react/jsx-runtime").JSX.Element;
};
export {};
//# sourceMappingURL=Select.d.ts.map
