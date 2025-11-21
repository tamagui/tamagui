import type { createMenu } from '@tamagui/menu';
import React from 'react';
export declare function createContextMenu(param: Parameters<typeof createMenu>[0]): ({
    (props: import("./createNonNativeContextMenu").ContextMenuProps & {
        __scopeContextMenu?: string;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
} | {
    (props: import("./createNonNativeContextMenu").ContextMenuProps & {
        __scopeContextMenu?: string;
    } & import("@tamagui/menu/types/createNativeMenu/createNativeMenuTypes").MenuProps & {
        native?: boolean;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}) & {
    Trigger: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, import("@tamagui/core").StackStyleBase, {}, {}> | {
        (props: Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").StackStyleBase, {}>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & React.RefAttributes<import("@tamagui/core").TamaguiElement> & import("@tamagui/menu/types/createNativeMenu/createNativeMenuTypes").MenuTriggerProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Portal: {
        (props: import("./createNonNativeContextMenu").ContextMenuPortalProps & {
            __scopeContextMenu?: string;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    } | {
        (props: import("./createNonNativeContextMenu").ContextMenuPortalProps & {
            __scopeContextMenu?: string;
        } & React.FragmentProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Content: React.ForwardRefExoticComponent<import("./createNonNativeContextMenu").ContextMenuContentProps & {
        __scopeContextMenu?: string;
    } & React.RefAttributes<HTMLElement | import("react-native").View>> | {
        (props: import("./createNonNativeContextMenu").ContextMenuContentProps & {
            __scopeContextMenu?: string;
        } & React.RefAttributes<HTMLElement | import("react-native").View> & import("@tamagui/menu/types/createNativeMenu/createNativeMenuTypes").MenuContentProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Group: import("@tamagui/core").TamaguiComponent<any, any, {} & void, {}, {}, {}> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Label: import("@tamagui/core").TamaguiComponent<any, any, {}, {}, {}, {}> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Item: import("@tamagui/core").TamaguiComponent<Omit<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "scope" | keyof import("@tamagui/menu").MenuItemProps> & import("@tamagui/menu").MenuItemProps & {
        scope?: string;
    }, "__scopeContextMenu" | keyof import("./createNonNativeContextMenu").ContextMenuItemProps> & import("./createNonNativeContextMenu").ContextMenuItemProps & {
        __scopeContextMenu?: string;
    }, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/menu").MenuItemProps & {
        scope?: string;
    } & import("./createNonNativeContextMenu").ContextMenuItemProps & {
        __scopeContextMenu?: string;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/core").StaticConfigPublic> | {
        (props: Omit<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            transparent?: boolean | undefined;
            fullscreen?: boolean | undefined;
            circular?: boolean | undefined;
            backgrounded?: boolean | undefined;
            radiused?: boolean | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            padded?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }>, "scope" | keyof import("@tamagui/menu").MenuItemProps> & import("@tamagui/menu").MenuItemProps & {
            scope?: string;
        }, "__scopeContextMenu" | keyof import("./createNonNativeContextMenu").ContextMenuItemProps> & import("./createNonNativeContextMenu").ContextMenuItemProps & {
            __scopeContextMenu?: string;
        } & React.RefAttributes<import("@tamagui/core").TamaguiElement> & {
            children: React.ReactNode;
            textValue?: string;
        } & {
            disabled?: boolean;
            hidden?: boolean;
            destructive?: boolean;
            key: string;
        } & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    CheckboxItem: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "scope" | keyof import("@tamagui/menu").MenuCheckboxItemProps> & import("@tamagui/menu").MenuCheckboxItemProps & {
        scope?: string;
    }, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/menu").MenuCheckboxItemProps & {
        scope?: string;
    } & void, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/core").StaticConfigPublic> | {
        (props: Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            transparent?: boolean | undefined;
            fullscreen?: boolean | undefined;
            circular?: boolean | undefined;
            backgrounded?: boolean | undefined;
            radiused?: boolean | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            padded?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }>, "scope" | keyof import("@tamagui/menu").MenuCheckboxItemProps> & import("@tamagui/menu").MenuCheckboxItemProps & {
            scope?: string;
        } & React.RefAttributes<import("@tamagui/core").TamaguiElement> & Omit<import("@tamagui/menu/types/createNativeMenu/createNativeMenuTypes").MenuItemProps, "onSelect"> & {
            value: "mixed" | "on" | "off" | boolean;
            onValueChange?: (state: "mixed" | "on" | "off", prevState: "mixed" | "on" | "off") => void;
            key: string;
        } & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    RadioGroup: React.ForwardRefExoticComponent<Omit<Omit<Omit<any, "scope" | keyof import("@tamagui/menu").MenuRadioGroupProps> & import("@tamagui/menu").MenuRadioGroupProps & {
        scope?: string;
    } & React.RefAttributes<any>, "ref"> & {
        __scopeContextMenu?: string;
    }, "ref"> & React.RefAttributes<any>> | {
        (props: Omit<Omit<Omit<any, "scope" | keyof import("@tamagui/menu").MenuRadioGroupProps> & import("@tamagui/menu").MenuRadioGroupProps & {
            scope?: string;
        } & React.RefAttributes<any>, "ref"> & {
            __scopeContextMenu?: string;
        }, "ref"> & React.RefAttributes<any> & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    RadioItem: import("@tamagui/core").TamaguiComponent<Omit<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "scope" | keyof import("@tamagui/menu").MenuRadioItemProps> & import("@tamagui/menu").MenuRadioItemProps & {
        scope?: string;
    }, "theme" | "debug" | "hitSlop" | "pointerEvents" | "display" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "id" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "onStartShouldSetResponder" | "onScrollShouldSetResponder" | "onScrollShouldSetResponderCapture" | "onSelectionChangeShouldSetResponder" | "onSelectionChangeShouldSetResponderCapture" | "onLayout" | "elevationAndroid" | "rel" | "download" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "style" | "onFocus" | "onBlur" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onHoverOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "x" | "y" | "perspective" | "scale" | "scaleX" | "scaleY" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "contain" | "cursor" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "userSelect" | "backdropFilter" | "background" | "backgroundImage" | "backgroundOrigin" | "backgroundPosition" | "backgroundRepeat" | "backgroundSize" | "boxSizing" | "overflowX" | "overflowY" | "transformOrigin" | "filter" | "mixBlendMode" | "backgroundClip" | "backgroundBlendMode" | "backgroundAttachment" | "clipPath" | "caretColor" | "transformStyle" | "mask" | "maskImage" | "textEmphasis" | "borderImage" | "float" | "content" | "overflowBlock" | "overflowInline" | "maskBorder" | "maskBorderMode" | "maskBorderOutset" | "maskBorderRepeat" | "maskBorderSlice" | "maskBorderSource" | "maskBorderWidth" | "maskClip" | "maskComposite" | "maskMode" | "maskOrigin" | "maskPosition" | "maskRepeat" | "maskSize" | "maskType" | "gridRow" | "gridRowEnd" | "gridRowGap" | "gridRowStart" | "gridColumn" | "gridColumnEnd" | "gridColumnGap" | "gridColumnStart" | "gridTemplateColumns" | "gridTemplateAreas" | "containerType" | "blockSize" | "inlineSize" | "minBlockSize" | "maxBlockSize" | "objectFit" | "verticalAlign" | "minInlineSize" | "maxInlineSize" | "borderInlineColor" | "borderInlineStartColor" | "borderInlineEndColor" | "borderBlockWidth" | "borderBlockStartWidth" | "borderBlockEndWidth" | "borderInlineWidth" | "borderInlineStartWidth" | "borderInlineEndWidth" | "borderBlockStyle" | "borderBlockStartStyle" | "borderBlockEndStyle" | "borderInlineStyle" | "borderInlineStartStyle" | "borderInlineEndStyle" | "marginBlock" | "marginBlockStart" | "marginBlockEnd" | "marginInline" | "marginInlineStart" | "marginInlineEnd" | "paddingBlock" | "paddingBlockStart" | "paddingBlockEnd" | "paddingInline" | "paddingInlineStart" | "paddingInlineEnd" | "inset" | "insetBlock" | "insetBlockStart" | "insetBlockEnd" | "insetInline" | "insetInlineStart" | "insetInlineEnd" | "animation" | "animateOnly" | "animatePresence" | "passThrough" | "elevation" | "backfaceVisibility" | "backgroundColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "isolation" | "boxShadow" | "experimental_backgroundImage" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "bottom" | "end" | "flex" | "flexBasis" | "flexDirection" | "rowGap" | "gap" | "columnGap" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "right" | "start" | "top" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | `$${string}` | `$${number}` | `$group-${string}` | `$group-${number}` | `$group-${string}-hover` | `$group-${string}-press` | `$group-${string}-focus` | `$group-${string}-focusVisible` | `$group-${string}-focusWithin` | `$group-${number}-hover` | `$group-${number}-press` | `$group-${number}-focus` | `$group-${number}-focusVisible` | `$group-${number}-focusWithin` | `$theme-${string}` | `$theme-${number}` | "hoverStyle" | "pressStyle" | "focusStyle" | "focusWithinStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "key" | "transparent" | "circular" | "scope" | "fullscreen" | "backgrounded" | "radiused" | "hoverTheme" | "pressTheme" | "focusTheme" | "padded" | "elevate" | "bordered" | "chromeless" | "unstyled" | "onSelect" | "textValue" | "value" | "__scopeContextMenu"> & Omit<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "scope" | keyof import("@tamagui/menu").MenuRadioItemProps> & import("@tamagui/menu").MenuRadioItemProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/core").TamaguiElement>, "ref"> & {
        __scopeContextMenu?: string;
    }, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/menu").MenuRadioItemProps & {
        scope?: string;
    } & Omit<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "scope" | keyof import("@tamagui/menu").MenuRadioItemProps> & import("@tamagui/menu").MenuRadioItemProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/core").TamaguiElement>, "ref"> & {
        __scopeContextMenu?: string;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@tamagui/core").StaticConfigPublic> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    ItemIndicator: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/menu").MenuItemIndicatorProps & {
        scope?: string;
    }, {}, {}>, keyof import("./createNonNativeContextMenu").ContextMenuItemIndicatorProps> & import("./createNonNativeContextMenu").ContextMenuItemIndicatorProps & {
        __scopeContextMenu?: string;
    }, any, import("@tamagui/menu").MenuItemIndicatorProps & {
        scope?: string;
    } & import("./createNonNativeContextMenu").ContextMenuItemIndicatorProps & {
        __scopeContextMenu?: string;
    }, {}, {}, import("@tamagui/core").StaticConfigPublic> | {
        (props: Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/menu").MenuItemIndicatorProps & {
            scope?: string;
        }, {}, {}>, keyof import("./createNonNativeContextMenu").ContextMenuItemIndicatorProps> & import("./createNonNativeContextMenu").ContextMenuItemIndicatorProps & {
            __scopeContextMenu?: string;
        } & React.RefAttributes<any> & import("@tamagui/menu/types/createNativeMenu/createNativeMenuTypes").MenuItemIndicatorProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Separator: import("@tamagui/core").TamaguiComponent<Omit<any, string | number | symbol> & Omit<any, "ref"> & {
        __scopeContextMenu?: string;
    }, any, Omit<any, "ref"> & {
        __scopeContextMenu?: string;
    }, {}, {}, {}> | {
        (props: Omit<any, string | number | symbol> & Omit<any, "ref"> & {
            __scopeContextMenu?: string;
        } & React.RefAttributes<any> & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Arrow: any;
    Sub: React.FC<import("./createNonNativeContextMenu").ContextMenuSubProps & {
        __scopeContextMenu?: string;
    }> | {
        (props: import("./createNonNativeContextMenu").ContextMenuSubProps & {
            __scopeContextMenu?: string;
        } & import("@tamagui/menu/types/createNativeMenu/createNativeMenuTypes").MenuSubProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    SubTrigger: React.FC<Omit<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, "scope" | keyof import("@tamagui/menu").MenuSubTriggerProps> & import("@tamagui/menu").MenuSubTriggerProps & {
        scope?: string;
    } & React.RefAttributes<import("@tamagui/core").TamaguiElement>, "ref"> & {
        __scopeContextMenu?: string;
    } & {
        children: React.ReactNode;
        textValue?: string;
    } & {
        disabled?: boolean;
        hidden?: boolean;
        destructive?: boolean;
        key: string;
    } & {
        key: string;
    }>;
    SubContent: React.ForwardRefExoticComponent<import("./createNonNativeContextMenu").ContextMenuSubContentProps & {
        children?: React.ReactNode | undefined;
    } & {
        __scopeContextMenu?: string;
    } & React.RefAttributes<HTMLElement | import("react-native").View>> | {
        (props: import("./createNonNativeContextMenu").ContextMenuSubContentProps & {
            children?: React.ReactNode | undefined;
        } & {
            __scopeContextMenu?: string;
        } & React.RefAttributes<HTMLElement | import("react-native").View> & import("@tamagui/menu/types/createNativeMenu/createNativeMenuTypes").MenuSubContentProps & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    ItemTitle: import("@tamagui/core").TamaguiComponent<any, any, {} & void, {}, {}, {}> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    ItemSubtitle: import("@tamagui/core").TamaguiComponent<any, any, {} & void, {}, {}, {}> | {
        (props: any): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    ItemIcon: React.FC<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "transparent" | "circular" | "fullscreen" | "backgrounded" | "radiused" | "hoverTheme" | "pressTheme" | "focusTheme" | "padded" | "elevate" | "bordered" | "chromeless"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeAndShorthands<import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>> & import("@tamagui/menu/types/createNativeMenu/createNativeMenuTypes").MenuItemCommonProps>;
    ItemImage: React.ForwardRefExoticComponent<import("react-native").ImageProps & React.RefAttributes<import("react-native").Image>> | {
        (props: import("react-native").ImageProps & React.RefAttributes<import("react-native").Image> & import("@tamagui/menu/types/createNativeMenu/createNativeMenuTypes").MenuItemCommonProps & {
            source: import("react-native").ImageProps["source"];
            ios?: {
                style?: ImageOptions;
                lazy?: boolean;
            };
        } & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Preview: {
        (): null;
        displayName: string;
    } | {
        (props: {
            children: React.ReactNode | (() => React.ReactNode);
            size?: NonNullable<React.ComponentProps<any>["previewConfig"]>["previewSize"];
            onPress?: React.ComponentProps<any>["onPressMenuPreview"];
        } & {
            [x: string]: any;
            [x: number]: any;
            [x: symbol]: any;
        } & {
            native?: boolean;
        }): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
};
export type { ContextMenuProps, ContextMenuTriggerProps, ContextMenuContentProps, ContextMenuGroupProps, ContextMenuItemProps, ContextMenuCheckboxItemProps, ContextMenuRadioGroupProps, ContextMenuRadioItemProps, ContextMenuItemIndicatorProps, ContextMenuSeparatorProps, ContextMenuArrowProps, ContextMenuSubProps, ContextMenuSubTriggerProps, ContextMenuSubContentProps, ContextMenuItemIconProps, ContextMenuItemImageProps, } from './createNonNativeContextMenu';
//# sourceMappingURL=ContextMenu.d.ts.map