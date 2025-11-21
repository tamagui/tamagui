import { Menu, type MenuItemIconProps, type MenuItemImageProps, type MenuProps, type MenuSubProps, type createMenu } from '@tamagui/create-menu';
import { type TamaguiElement, type ViewProps } from '@tamagui/web';
import * as React from 'react';
type Direction = 'ltr' | 'rtl';
type ScopedProps<P> = P & {
    scope?: string;
};
interface ContextMenuProps extends MenuProps {
    children?: React.ReactNode;
    onOpenChange?(open: boolean): void;
    dir?: Direction;
    modal?: boolean;
}
interface ContextMenuTriggerProps extends ViewProps {
    disabled?: boolean;
}
type MenuPortalProps = React.ComponentPropsWithoutRef<typeof Menu.Portal>;
interface ContextMenuPortalProps extends MenuPortalProps {
}
type MenuContentProps = React.ComponentPropsWithoutRef<typeof Menu.Content>;
interface ContextMenuContentProps extends Omit<MenuContentProps, 'onEntryFocus' | 'side' | 'sideOffset' | 'align'> {
}
type MenuGroupProps = React.ComponentPropsWithoutRef<typeof Menu.Group>;
type ContextMenuGroupProps = MenuGroupProps & {};
type MenuItemProps = React.ComponentPropsWithoutRef<typeof Menu.Item>;
interface ContextMenuItemProps extends MenuItemProps {
}
type ContextMenuItemImageProps = MenuItemImageProps;
type ContextMenuItemIconProps = MenuItemIconProps;
type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof Menu.CheckboxItem>;
interface ContextMenuCheckboxItemProps extends MenuCheckboxItemProps {
}
type ContextMenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof Menu.RadioGroup>;
type ContextMenuRadioItemProps = React.ComponentPropsWithoutRef<typeof Menu.RadioItem>;
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<typeof Menu.ItemIndicator>;
interface ContextMenuItemIndicatorProps extends MenuItemIndicatorProps {
}
type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof Menu.Separator>;
type ContextMenuSeparatorProps = MenuSeparatorProps & {};
type MenuArrowProps = React.ComponentPropsWithoutRef<typeof Menu.Arrow>;
interface ContextMenuArrowProps extends MenuArrowProps {
}
interface ContextMenuSubProps extends MenuSubProps {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
}
type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof Menu.SubTrigger>;
type ContextMenuSubTriggerProps = ScopedProps<MenuSubTriggerProps>;
type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof Menu.SubContent>;
interface ContextMenuSubContentProps extends MenuSubContentProps {
}
export declare const CONTEXTMENU_CONTEXT = "ContextMenuContext";
export declare function createNonNativeContextMenu(param: Parameters<typeof createMenu>[0]): {
    (props: ScopedProps<ContextMenuProps>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
} & {
    Root: {
        (props: ScopedProps<ContextMenuProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Trigger: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").StackProps, "scope" | keyof ContextMenuTriggerProps> & ContextMenuTriggerProps & {
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
    } & React.RefAttributes<HTMLElement | import("react-native").View>>;
    Group: import("@tamagui/web").TamaguiComponent<any, any, {} & void, {}, {}, {}>;
    Label: import("@tamagui/web").TamaguiComponent<any, any, {}, {}, {}, {}>;
    Item: React.ForwardRefExoticComponent<ContextMenuItemProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>>;
    CheckboxItem: React.ForwardRefExoticComponent<ContextMenuCheckboxItemProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>>;
    RadioGroup: React.ForwardRefExoticComponent<Omit<ScopedProps<Omit<Omit<any, "scope" | keyof import("@tamagui/create-menu").MenuRadioGroupProps> & import("@tamagui/create-menu").MenuRadioGroupProps & {
        scope?: string;
    } & React.RefAttributes<any>, "ref">>, "ref"> & React.RefAttributes<any>>;
    RadioItem: React.ForwardRefExoticComponent<Omit<import("@tamagui/create-menu").MenuRadioItemProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>>;
    ItemIndicator: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    }, {}, {}>, keyof ContextMenuItemIndicatorProps> & ContextMenuItemIndicatorProps & {
        scope?: string;
    }, any, import("@tamagui/create-menu").MenuItemIndicatorProps & {
        scope?: string;
    } & ContextMenuItemIndicatorProps & {
        scope?: string;
    }, {}, {}, import("@tamagui/web").StaticConfigPublic>;
    Separator: import("@tamagui/web").TamaguiComponent<Omit<any, string | number | symbol> & Omit<any, "ref"> & {
        scope?: string;
    }, any, Omit<any, "ref"> & {
        scope?: string;
    }, {}, {}, {}>;
    Arrow: React.ForwardRefExoticComponent<ContextMenuArrowProps & React.RefAttributes<TamaguiElement>>;
    Sub: React.FC<ScopedProps<ContextMenuSubProps>>;
    SubTrigger: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").StackProps, "theme" | "debug" | `$${string}` | `$${number}` | `$group-${string}` | `$group-${number}` | `$group-${string}-hover` | `$group-${string}-press` | `$group-${string}-focus` | `$group-${string}-focusVisible` | `$group-${string}-focusWithin` | `$group-${number}-hover` | `$group-${number}-press` | `$group-${number}-focus` | `$group-${number}-focusVisible` | `$group-${number}-focusWithin` | `$theme-${string}` | `$theme-${number}` | "hitSlop" | "pointerEvents" | "display" | "children" | "target" | "htmlFor" | "asChild" | "dangerouslySetInnerHTML" | "disabled" | "className" | "themeShallow" | "themeInverse" | "id" | "tag" | "group" | "untilMeasured" | "componentName" | "tabIndex" | "role" | "disableOptimization" | "forceStyle" | "disableClassName" | "style" | "onFocus" | "onBlur" | "needsOffscreenAlphaCompositing" | "removeClippedSubviews" | "testID" | "nativeID" | "collapsable" | "collapsableChildren" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerUp" | "onPointerUpCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "aria-label" | "accessibilityRole" | "accessibilityState" | "aria-busy" | "aria-checked" | "aria-disabled" | "aria-expanded" | "aria-selected" | "accessibilityHint" | "accessibilityValue" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "onAccessibilityAction" | "importantForAccessibility" | "aria-hidden" | "aria-modal" | "accessibilityLabelledBy" | "aria-labelledby" | "accessibilityLiveRegion" | "aria-live" | "screenReaderFocusable" | "accessibilityElementsHidden" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "accessibilityLanguage" | "accessibilityShowsLargeContentViewer" | "accessibilityLargeContentTitle" | "accessibilityRespondsToUserInteraction" | "x" | "y" | "perspective" | "scale" | "scaleX" | "scaleY" | "skewX" | "skewY" | "matrix" | "rotate" | "rotateY" | "rotateX" | "rotateZ" | "contain" | "cursor" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "userSelect" | "backdropFilter" | "background" | "backgroundImage" | "backgroundOrigin" | "backgroundPosition" | "backgroundRepeat" | "backgroundSize" | "boxSizing" | "overflowX" | "overflowY" | "transformOrigin" | "filter" | "mixBlendMode" | "backgroundClip" | "backgroundBlendMode" | "backgroundAttachment" | "clipPath" | "caretColor" | "transformStyle" | "mask" | "maskImage" | "textEmphasis" | "borderImage" | "float" | "content" | "overflowBlock" | "overflowInline" | "maskBorder" | "maskBorderMode" | "maskBorderOutset" | "maskBorderRepeat" | "maskBorderSlice" | "maskBorderSource" | "maskBorderWidth" | "maskClip" | "maskComposite" | "maskMode" | "maskOrigin" | "maskPosition" | "maskRepeat" | "maskSize" | "maskType" | "gridRow" | "gridRowEnd" | "gridRowGap" | "gridRowStart" | "gridColumn" | "gridColumnEnd" | "gridColumnGap" | "gridColumnStart" | "gridTemplateColumns" | "gridTemplateAreas" | "containerType" | "blockSize" | "inlineSize" | "minBlockSize" | "maxBlockSize" | "objectFit" | "verticalAlign" | "minInlineSize" | "maxInlineSize" | "borderInlineColor" | "borderInlineStartColor" | "borderInlineEndColor" | "borderBlockWidth" | "borderBlockStartWidth" | "borderBlockEndWidth" | "borderInlineWidth" | "borderInlineStartWidth" | "borderInlineEndWidth" | "borderBlockStyle" | "borderBlockStartStyle" | "borderBlockEndStyle" | "borderInlineStyle" | "borderInlineStartStyle" | "borderInlineEndStyle" | "marginBlock" | "marginBlockStart" | "marginBlockEnd" | "marginInline" | "marginInlineStart" | "marginInlineEnd" | "paddingBlock" | "paddingBlockStart" | "paddingBlockEnd" | "paddingInline" | "paddingInlineStart" | "paddingInlineEnd" | "inset" | "insetBlock" | "insetBlockStart" | "insetBlockEnd" | "insetInline" | "insetInlineStart" | "insetInlineEnd" | "animation" | "animateOnly" | "animatePresence" | "passThrough" | "backfaceVisibility" | "backgroundColor" | "borderBlockColor" | "borderBlockEndColor" | "borderBlockStartColor" | "borderBottomColor" | "borderBottomEndRadius" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStartRadius" | "borderColor" | "borderCurve" | "borderEndColor" | "borderEndEndRadius" | "borderEndStartRadius" | "borderLeftColor" | "borderRadius" | "borderRightColor" | "borderStartColor" | "borderStartEndRadius" | "borderStartStartRadius" | "borderStyle" | "borderTopColor" | "borderTopEndRadius" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStartRadius" | "opacity" | "isolation" | "boxShadow" | "experimental_backgroundImage" | "alignContent" | "alignItems" | "alignSelf" | "aspectRatio" | "borderBottomWidth" | "borderEndWidth" | "borderLeftWidth" | "borderRightWidth" | "borderStartWidth" | "borderTopWidth" | "borderWidth" | "bottom" | "end" | "flex" | "flexBasis" | "flexDirection" | "rowGap" | "gap" | "columnGap" | "flexGrow" | "flexShrink" | "flexWrap" | "height" | "justifyContent" | "left" | "margin" | "marginBottom" | "marginEnd" | "marginHorizontal" | "marginLeft" | "marginRight" | "marginStart" | "marginTop" | "marginVertical" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "overflow" | "padding" | "paddingBottom" | "paddingEnd" | "paddingHorizontal" | "paddingLeft" | "paddingRight" | "paddingStart" | "paddingTop" | "paddingVertical" | "position" | "right" | "start" | "top" | "width" | "zIndex" | "direction" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "transform" | "transformMatrix" | "rotation" | "translateX" | "translateY" | "onPress" | "onLongPress" | "onPressIn" | "onPressOut" | "onHoverIn" | "onMouseEnter" | "onHoverOut" | "onMouseLeave" | "onMouseDown" | "onMouseUp" | "hoverStyle" | "pressStyle" | "focusStyle" | "focusWithinStyle" | "focusVisibleStyle" | "disabledStyle" | "exitStyle" | "enterStyle" | "scope" | "unstyled" | "key" | "textValue"> & Omit<import("@tamagui/create-menu").MenuSubTriggerProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & Omit<import("@tamagui/create-menu").MenuSubTriggerProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>, "ref"> & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}>;
    SubContent: React.ForwardRefExoticComponent<ContextMenuSubContentProps & {
        children?: React.ReactNode | undefined;
    } & {
        scope?: string;
    } & React.RefAttributes<HTMLElement | import("react-native").View>>;
    ItemTitle: import("@tamagui/web").TamaguiComponent<any, any, {} & void, {}, {}, {}>;
    ItemSubtitle: import("@tamagui/web").TamaguiComponent<any, any, {} & void, {}, {}, {}>;
    ItemIcon: import("@tamagui/web").TamaguiComponent<any, any, {}, {}, {}, {}>;
    ItemImage: React.ForwardRefExoticComponent<import("react-native").ImageProps & React.RefAttributes<import("react-native").Image>>;
    Preview: {
        (): null;
        displayName: string;
    };
};
export type { ContextMenuArrowProps, ContextMenuCheckboxItemProps, ContextMenuContentProps, ContextMenuGroupProps, ContextMenuItemIconProps, ContextMenuItemImageProps, ContextMenuItemIndicatorProps, ContextMenuItemProps, ContextMenuPortalProps, ContextMenuProps, ContextMenuRadioGroupProps, ContextMenuRadioItemProps, ContextMenuSeparatorProps, ContextMenuSubContentProps, ContextMenuSubProps, ContextMenuSubTriggerProps, ContextMenuTriggerProps, };
//# sourceMappingURL=createNonNativeContextMenu.d.ts.map