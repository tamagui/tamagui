import { AnimatePresenceProps } from '@tamagui/animate-presence/types/types';
import type { Scope } from '@tamagui/create-context';
import { ThemeableStackProps } from '@tamagui/stacks';
import { GetProps, Stack, StackProps } from '@tamagui/web';
import * as React from 'react';
declare const createCollapsibleScope: import("tamagui").CreateScope;
interface CollapsibleProps extends StackProps {
    defaultOpen?: boolean;
    open?: boolean;
    disabled?: boolean;
    onOpenChange?(open: boolean): void;
}
type CollapsibleTriggerProps = GetProps<typeof Stack>;
declare const CollapsibleTriggerFrame: import("tamagui").TamaguiComponent<StackProps | (Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
    [x: string]: undefined;
}>>), import("tamagui").TamaguiElement, import("tamagui").StackPropsBase, {} | {
    [x: string]: undefined;
}, {
    displayName: string | undefined;
    __baseProps: import("tamagui").StackPropsBase;
    __variantProps: {};
}>;
declare const CollapsibleTrigger: import("@tamagui/web").ReactComponentWithRef<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>> & Omit<StackProps | (Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
    [x: string]: undefined;
}>>), "style" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | `$${string}` | `$${number}` | keyof {
    columnGap?: import("@tamagui/web").SpaceValue | undefined;
    contain?: import("csstype").Property.Contain | undefined;
    cursor?: import("csstype").Property.Cursor | undefined;
    display?: "flex" | "none" | "inherit" | "inline" | "block" | "contents" | "inline-flex" | undefined;
    gap?: import("@tamagui/web").SpaceValue | undefined;
    outlineColor?: import("csstype").Property.OutlineColor | undefined;
    outlineOffset?: import("@tamagui/web").SpaceValue | undefined;
    outlineStyle?: import("csstype").Property.OutlineStyle | undefined;
    outlineWidth?: import("@tamagui/web").SpaceValue | undefined;
    pointerEvents?: "box-none" | "none" | "box-only" | "auto" | undefined;
    rowGap?: import("@tamagui/web").SpaceValue | undefined;
    space?: import("@tamagui/web").SpaceValue | undefined;
    spaceDirection?: import("@tamagui/web").SpaceDirection | undefined;
    separator?: React.ReactNode;
    animation?: import("@tamagui/web").AnimationProp | null | undefined;
    animateOnly?: string[] | undefined;
    userSelect?: import("csstype").Property.UserSelect | undefined;
} | "backgroundColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "bottom" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "right" | "start" | "top" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | keyof import("tamagui").TransformStyleProps | keyof import("tamagui").TamaguiComponentPropsBase | keyof import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>>, import("tamagui").TamaguiElement> & {
    staticConfig: import("tamagui").StaticConfigParsed;
    styleable: import("tamagui").Styleable<StackProps | (Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>>), import("tamagui").TamaguiElement>;
};
interface CollapsibleContentProps extends AnimatePresenceProps, ThemeableStackProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const CollapsibleContentFrame: import("tamagui").TamaguiComponent<StackProps | (Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
    [x: string]: undefined;
}>>), import("tamagui").TamaguiElement, import("tamagui").StackPropsBase, {} | {
    [x: string]: undefined;
}, {
    displayName: string | undefined;
    __baseProps: import("tamagui").StackPropsBase;
    __variantProps: {};
}>;
declare const CollapsibleContent: import("@tamagui/web").ReactComponentWithRef<CollapsibleContentProps & {
    __scopeCollapsible?: Scope;
} & Omit<StackProps | (Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
    [x: string]: undefined;
} & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
    [x: string]: undefined;
}>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
    style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
    [x: string]: undefined;
}>>), "__scopeCollapsible" | keyof CollapsibleContentProps>, import("tamagui").TamaguiElement> & {
    staticConfig: import("tamagui").StaticConfigParsed;
    styleable: import("tamagui").Styleable<StackProps | (Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>>), import("tamagui").TamaguiElement>;
};
declare const Collapsible: React.ForwardRefExoticComponent<CollapsibleProps & {
    __scopeCollapsible?: Scope;
} & React.RefAttributes<import("tamagui").TamaguiElement>> & {
    Trigger: import("@tamagui/web").ReactComponentWithRef<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>> & import("@tamagui/web").MediaProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>> & Omit<StackProps | (Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>>), "style" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "aria-labelledby" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-live" | "aria-modal" | "accessibilityLiveRegion" | "accessibilityLabelledBy" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | `$${string}` | `$${number}` | keyof {
        columnGap?: import("@tamagui/web").SpaceValue | undefined;
        contain?: import("csstype").Property.Contain | undefined;
        cursor?: import("csstype").Property.Cursor | undefined;
        display?: "flex" | "none" | "inherit" | "inline" | "block" | "contents" | "inline-flex" | undefined;
        gap?: import("@tamagui/web").SpaceValue | undefined;
        outlineColor?: import("csstype").Property.OutlineColor | undefined;
        outlineOffset?: import("@tamagui/web").SpaceValue | undefined;
        outlineStyle?: import("csstype").Property.OutlineStyle | undefined;
        outlineWidth?: import("@tamagui/web").SpaceValue | undefined;
        pointerEvents?: "box-none" | "none" | "box-only" | "auto" | undefined;
        rowGap?: import("@tamagui/web").SpaceValue | undefined;
        space?: import("@tamagui/web").SpaceValue | undefined;
        spaceDirection?: import("@tamagui/web").SpaceDirection | undefined;
        separator?: React.ReactNode;
        animation?: import("@tamagui/web").AnimationProp | null | undefined;
        animateOnly?: string[] | undefined;
        userSelect?: import("csstype").Property.UserSelect | undefined;
    } | "backgroundColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "bottom" | "end" | "flex" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "right" | "start" | "top" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | keyof import("tamagui").TransformStyleProps | keyof import("tamagui").TamaguiComponentPropsBase | keyof import("@tamagui/web").PseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>>>>, import("tamagui").TamaguiElement> & {
        staticConfig: import("tamagui").StaticConfigParsed;
        styleable: import("tamagui").Styleable<StackProps | (Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
            style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
            [x: string]: undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
            style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
            [x: string]: undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
            style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
            [x: string]: undefined;
        }>>), import("tamagui").TamaguiElement>;
    };
    Content: import("@tamagui/web").ReactComponentWithRef<CollapsibleContentProps & {
        __scopeCollapsible?: Scope;
    } & Omit<StackProps | (Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
        style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
    } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
        [x: string]: undefined;
    }>>), "__scopeCollapsible" | keyof CollapsibleContentProps>, import("tamagui").TamaguiElement> & {
        staticConfig: import("tamagui").StaticConfigParsed;
        styleable: import("tamagui").Styleable<StackProps | (Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
            style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
            [x: string]: undefined;
        } & import("@tamagui/web").MediaProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
            style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
            [x: string]: undefined;
        }>> & import("@tamagui/web").PseudoProps<Partial<Omit<import("react-native").ViewProps, "display" | "children" | ("onLayout" | keyof import("react-native").GestureResponderHandlers) | "style"> & import("@tamagui/web").ExtendBaseStackProps & import("tamagui").TamaguiComponentPropsBase & {
            style?: import("@tamagui/web").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
        } & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStylePropsBase>> & Omit<{}, string | number> & {
            [x: string]: undefined;
        }>>), import("tamagui").TamaguiElement>;
    };
};
export { Collapsible, CollapsibleContent, CollapsibleContentFrame, CollapsibleTrigger, CollapsibleTriggerFrame, createCollapsibleScope, };
export type { CollapsibleContentProps, CollapsibleProps, CollapsibleTriggerProps };
//# sourceMappingURL=Collapsible.d.ts.map