import type BaseMenuTypes from '@tamagui/create-menu';
import { createBaseMenu, type CreateBaseMenuProps } from '@tamagui/create-menu';
import { type TamaguiElement, type ViewProps } from '@tamagui/web';
import React from 'react';
type Direction = 'ltr' | 'rtl';
export declare const CONTEXTMENU_CONTEXT = "ContextMenuContext";
type ScopedProps<P> = P & {
    scope?: string;
};
type BaseMenu = ReturnType<typeof createBaseMenu>['Menu'];
interface ContextMenuProps extends BaseMenuTypes.MenuProps {
    children?: React.ReactNode;
    onOpenChange?(open: boolean): void;
    dir?: Direction;
    modal?: boolean;
}
interface ContextMenuTriggerProps extends ViewProps {
    disabled?: boolean;
}
type ContextMenuPortalProps = React.ComponentPropsWithoutRef<BaseMenu['Portal']>;
interface ContextMenuContentProps extends Omit<React.ComponentPropsWithoutRef<BaseMenu['Content']>, 'onEntryFocus' | 'side' | 'sideOffset' | 'align'> {
}
type ContextMenuGroupProps = React.ComponentPropsWithoutRef<BaseMenu['Group']>;
type ContextMenuItemProps = React.ComponentPropsWithoutRef<BaseMenu['Item']>;
type ContextMenuItemImageProps = React.ComponentPropsWithoutRef<BaseMenu['ItemImage']>;
type ContextMenuItemIconProps = React.ComponentPropsWithoutRef<BaseMenu['ItemIcon']>;
type ContextMenuCheckboxItemProps = React.ComponentPropsWithoutRef<BaseMenu['CheckboxItem']>;
type ContextMenuRadioGroupProps = React.ComponentPropsWithoutRef<BaseMenu['RadioGroup']>;
type ContextMenuRadioItemProps = React.ComponentPropsWithoutRef<BaseMenu['RadioItem']>;
type ContextMenuItemIndicatorProps = React.ComponentPropsWithoutRef<BaseMenu['ItemIndicator']>;
type ContextMenuSeparatorProps = React.ComponentPropsWithoutRef<BaseMenu['Separator']>;
type ContextMenuArrowProps = React.ComponentPropsWithoutRef<BaseMenu['Arrow']>;
interface ContextMenuSubProps extends BaseMenuTypes.MenuSubProps {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
}
type ContextMenuSubTriggerProps = React.ComponentPropsWithoutRef<BaseMenu['SubTrigger']>;
type ContextMenuSubContentProps = React.ComponentPropsWithoutRef<BaseMenu['SubContent']>;
export declare function createNonNativeContextMenu(params: CreateBaseMenuProps): {
    (props: ScopedProps<ContextMenuProps>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
} & {
    Root: {
        (props: ScopedProps<ContextMenuProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Trigger: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | keyof ContextMenuTriggerProps> & ContextMenuTriggerProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & ContextMenuTriggerProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}>;
    Portal: {
        (props: ScopedProps<ContextMenuPortalProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Content: React.ForwardRefExoticComponent<ContextMenuContentProps & {
        scope?: string;
    } & React.RefAttributes<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View>>;
    Group: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, keyof BaseMenuTypes.MenuGroupProps> & BaseMenuTypes.MenuGroupProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuTypes.MenuGroupProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Label: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>, keyof BaseMenuTypes.MenuLabelProps> & BaseMenuTypes.MenuLabelProps, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & BaseMenuTypes.MenuLabelProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Item: React.ForwardRefExoticComponent<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof BaseMenuTypes.MenuItemProps> & BaseMenuTypes.MenuItemProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>>;
    CheckboxItem: React.ForwardRefExoticComponent<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof BaseMenuTypes.MenuCheckboxItemProps> & BaseMenuTypes.MenuCheckboxItemProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>>;
    RadioGroup: React.ForwardRefExoticComponent<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof BaseMenuTypes.MenuRadioGroupProps> & BaseMenuTypes.MenuRadioGroupProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View>>;
    RadioItem: React.ForwardRefExoticComponent<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof BaseMenuTypes.MenuRadioItemProps> & BaseMenuTypes.MenuRadioItemProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>>;
    ItemIndicator: import("@tamagui/web").TamaguiComponent<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps> & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    }, "theme" | "debug" | `$${string}` | `$${number}` | `$group-${string}` | `$group-${number}` | `$group-${string}-hover` | `$group-${string}-press` | `$group-${string}-focus` | `$group-${string}-focusVisible` | `$group-${string}-focusWithin` | `$group-${number}-hover` | `$group-${number}-press` | `$group-${number}-focus` | `$group-${number}-focusVisible` | `$group-${number}-focusWithin` | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "pointerEvents" | "display" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "unstyled" | "id" | "render" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "animatedBy" | "style" | "onFocus" | "onBlur" | "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMoveCapture" | "onPointerCancelCapture" | "onPointerDownCapture" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "position" | "x" | "y" | "perspective" | "scale" | "scaleX" | "scaleY" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "borderCurve" | "contain" | "cursor" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "outline" | "userSelect" | "backdropFilter" | "background" | "backgroundImage" | "backgroundOrigin" | "backgroundPosition" | "backgroundRepeat" | "backgroundSize" | "boxShadow" | "border" | "overflowX" | "overflowY" | "transformOrigin" | "filter" | "backgroundClip" | "backgroundBlendMode" | "backgroundAttachment" | "clipPath" | "caretColor" | "transformStyle" | "mask" | "maskImage" | "textEmphasis" | "borderImage" | "float" | "content" | "overflowBlock" | "overflowInline" | "maskBorder" | "maskBorderMode" | "maskBorderOutset" | "maskBorderRepeat" | "maskBorderSlice" | "maskBorderSource" | "maskBorderWidth" | "maskClip" | "maskComposite" | "maskMode" | "maskOrigin" | "maskPosition" | "maskRepeat" | "maskSize" | "maskType" | "gridRow" | "gridRowEnd" | "gridRowGap" | "gridRowStart" | "gridColumn" | "gridColumnEnd" | "gridColumnGap" | "gridColumnStart" | "gridTemplateColumns" | "gridTemplateAreas" | "containerType" | "blockSize" | "inlineSize" | "minBlockSize" | "maxBlockSize" | "objectFit" | "verticalAlign" | "minInlineSize" | "maxInlineSize" | "borderInlineColor" | "borderInlineStartColor" | "borderInlineEndColor" | "borderBlockWidth" | "borderBlockStartWidth" | "borderBlockEndWidth" | "borderInlineWidth" | "borderInlineStartWidth" | "borderInlineEndWidth" | "borderBlockStyle" | "borderBlockStartStyle" | "borderBlockEndStyle" | "borderInlineStyle" | "borderInlineStartStyle" | "borderInlineEndStyle" | "marginBlock" | "marginBlockStart" | "marginBlockEnd" | "marginInline" | "marginInlineStart" | "marginInlineEnd" | "paddingBlock" | "paddingBlockStart" | "paddingBlockEnd" | "paddingInline" | "paddingInlineStart" | "paddingInlineEnd" | "inset" | "insetBlock" | "insetBlockStart" | "insetBlockEnd" | "insetInline" | "insetInlineStart" | "insetInlineEnd" | "transition" | "animateOnly" | "animatePresence" | "passThrough" | "backfaceVisibility" | "backgroundColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "isolation" | "mixBlendMode" | "experimental_backgroundImage" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "bottom" | "boxSizing" | "end" | "flex" | "flexBasis" | "flexDirection" | "rowGap" | "gap" | "columnGap" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "right" | "start" | "top" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "onMouseMove" | "onMouseOver" | "onMouseOut" | "onClick" | "onDoubleClick" | "onContextMenu" | "onWheel" | "onKeyDown" | "onKeyUp" | "onChange" | "onInput" | "onBeforeInput" | "onScroll" | "onCopy" | "onCut" | "onPaste" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "hoverStyle" | "pressStyle" | "focusStyle" | "focusWithinStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "forceMount" | "scope" | "key"> & Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps> & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    } & Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps> & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Separator: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, keyof BaseMenuTypes.MenuSeparatorProps> & BaseMenuTypes.MenuSeparatorProps, TamaguiElement, import("@tamagui/web").StackNonStyleProps & BaseMenuTypes.MenuSeparatorProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Arrow: React.ForwardRefExoticComponent<Omit<BaseMenuTypes.MenuArrowProps & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>>;
    Sub: {
        (props: ScopedProps<ContextMenuSubProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    SubTrigger: import("@tamagui/web").TamaguiComponent<Omit<ViewProps, "scope" | "key" | keyof BaseMenuTypes.MenuSubTriggerProps> & Omit<BaseMenuTypes.MenuSubTriggerProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & Omit<BaseMenuTypes.MenuSubTriggerProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}>;
    SubContent: React.ForwardRefExoticComponent<Omit<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: import("@tamagui/web").SizeTokens | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof BaseMenuTypes.MenuSubContentProps> & BaseMenuTypes.MenuSubContentProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<(HTMLElement & import("@tamagui/web").TamaguiElementMethods) | import("react-native").View>>;
    ItemTitle: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>, keyof BaseMenuTypes.MenuItemTitleProps> & BaseMenuTypes.MenuItemTitleProps, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & BaseMenuTypes.MenuItemTitleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    ItemSubtitle: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }>, keyof BaseMenuTypes.MenuItemSubTitleProps> & BaseMenuTypes.MenuItemSubTitleProps, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps & BaseMenuTypes.MenuItemSubTitleProps, import("@tamagui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/web").FontSizeTokens | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    ItemIcon: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, `$${string}` | `$${number}` | import("@tamagui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@tamagui/web").StackStyleBase | keyof import("@tamagui/web").StackNonStyleProps | keyof import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>>> & import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>, TamaguiElement, import("@tamagui/web").StackNonStyleProps & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {}>>, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    ItemImage: React.ForwardRefExoticComponent<import("react-native").ImageProps & React.RefAttributes<import("react-native").Image>>;
    Preview: () => null;
};
export type { ContextMenuArrowProps, ContextMenuCheckboxItemProps, ContextMenuContentProps, ContextMenuGroupProps, ContextMenuItemIconProps, ContextMenuItemImageProps, ContextMenuItemIndicatorProps, ContextMenuItemProps, ContextMenuPortalProps, ContextMenuProps, ContextMenuRadioGroupProps, ContextMenuRadioItemProps, ContextMenuSeparatorProps, ContextMenuSubContentProps, ContextMenuSubProps, ContextMenuSubTriggerProps, ContextMenuTriggerProps, };
//# sourceMappingURL=createNonNativeContextMenu.d.ts.map