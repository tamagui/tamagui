import { Dismissable as DismissableLayer } from '@tamagui/dismissable';
import { FocusScope } from '@tamagui/focus-scope';
import { type ImageProps } from '@tamagui/image';
import type { PopperContentProps } from '@tamagui/popper';
import * as PopperPrimitive from '@tamagui/popper';
import type { RovingFocusGroupProps } from '@tamagui/roving-focus';
import type { TextProps } from '@tamagui/web';
import { type GetRef, type ViewProps, View } from '@tamagui/web';
import type { TamaguiElement } from '@tamagui/web/types';
import * as React from 'react';
type Direction = 'ltr' | 'rtl';
type ScopedProps<P> = P & {
    scope?: string;
};
interface MenuBaseProps extends PopperPrimitive.PopperProps {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?(open: boolean): void;
    dir?: Direction;
    modal?: boolean;
    native?: boolean;
}
type PopperAnchorProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperAnchor>;
interface MenuAnchorProps extends PopperAnchorProps {
}
interface MenuPortalProps {
    children?: React.ReactNode;
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
    zIndex?: number;
}
/**
 * We purposefully don't union MenuRootContent and MenuSubContent props here because
 * they have conflicting prop types. We agreed that we would allow MenuSubContent to
 * accept props that it would just ignore.
 */
interface MenuContentProps extends MenuRootContentTypeProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
}
interface MenuRootContentTypeProps extends Omit<MenuContentImplProps, keyof MenuContentImplPrivateProps> {
}
type MenuContentImplElement = GetRef<typeof PopperPrimitive.PopperContent>;
type FocusScopeProps = React.ComponentPropsWithoutRef<typeof FocusScope>;
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>;
type MenuContentImplPrivateProps = {
    onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'];
    onDismiss?: DismissableLayerProps['onDismiss'];
    disableOutsidePointerEvents?: DismissableLayerProps['disableOutsidePointerEvents'];
    /**
     * Whether scrolling outside the `MenuContent` should be prevented
     * (default: `false`)
     */
    disableOutsideScroll?: boolean;
    /**
     * Whether focus should be trapped within the `MenuContent`
     * (default: false)
     */
    trapFocus?: FocusScopeProps['trapped'];
    /**
     * Whether to disable dismissing the menu when the user scrolls outside of it
     * (default: false, meaning scroll will dismiss on web)
     */
    disableDismissOnScroll?: boolean;
};
interface MenuContentImplProps extends MenuContentImplPrivateProps, Omit<PopperContentProps, 'dir' | 'onPlaced'> {
    /**
     * Event handler called when auto-focusing on close.
     * Can be canceled.
     */
    onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'];
    /**
     * Whether keyboard navigation should loop around
     * @defaultValue false
     */
    loop?: RovingFocusGroupProps['loop'];
    onEntryFocus?: RovingFocusGroupProps['onEntryFocus'];
    onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown'];
    onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside'];
    onFocusOutside?: DismissableLayerProps['onFocusOutside'];
    onInteractOutside?: DismissableLayerProps['onInteractOutside'];
}
interface MenuGroupProps extends ViewProps {
}
interface MenuLabelProps extends TextProps {
}
interface MenuItemProps extends Omit<MenuItemImplProps, 'onSelect'> {
    onSelect?: (event: Event) => void;
    /**
     * Prevents the menu from closing when this item is selected.
     * Useful for toggle items or multi-select scenarios.
     */
    preventCloseOnSelect?: boolean;
}
interface MenuItemImplProps extends ViewProps {
    disabled?: boolean;
    textValue?: string;
}
interface MenuItemTitleProps extends TextProps {
}
interface MenuItemSubTitleProps extends TextProps {
}
type MenuItemIconProps = ViewProps;
type CheckedState = boolean | 'indeterminate';
interface MenuCheckboxItemProps extends MenuItemProps {
    checked?: CheckedState;
    onCheckedChange?: (checked: boolean) => void;
}
interface MenuRadioGroupProps extends MenuGroupProps {
    value?: string;
    onValueChange?: (value: string) => void;
}
interface MenuRadioItemProps extends MenuItemProps {
    value: string;
}
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof View>;
interface MenuItemIndicatorProps extends PrimitiveSpanProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
}
interface MenuSeparatorProps extends ViewProps {
}
type PopperArrowProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperArrow>;
type MenuArrowProps = PopperArrowProps;
export interface MenuSubProps extends PopperPrimitive.PopperProps {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?(open: boolean): void;
}
interface MenuSubTriggerProps extends MenuItemImplProps {
}
export type MenuSubContentElement = MenuContentImplElement;
export interface MenuSubContentProps extends Omit<MenuContentImplProps, keyof MenuContentImplPrivateProps | 'onCloseAutoFocus' | 'onEntryFocus' | 'side' | 'align'> {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
}
export declare function createBaseMenu(): {
    Menu: {
        (props: ScopedProps<MenuBaseProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    } & {
        Anchor: {
            (props: MenuAnchorProps): import("react/jsx-runtime").JSX.Element;
            displayName: string;
        };
        Portal: {
            (props: ScopedProps<MenuPortalProps>): import("react/jsx-runtime").JSX.Element;
            displayName: string;
        };
        Content: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, keyof MenuContentProps> & MenuContentProps & {
            scope?: string;
        }, (HTMLElement & import("@tamagui/core").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & MenuContentProps & {
            scope?: string;
        }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
        Group: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, keyof MenuGroupProps> & MenuGroupProps, TamaguiElement, import("@tamagui/core").StackNonStyleProps & MenuGroupProps, import("@tamagui/core").StackStyleBase, {}, {}>;
        Label: import("@tamagui/core").TamaguiComponent<Omit<TextProps, keyof MenuLabelProps> & MenuLabelProps, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & MenuLabelProps, import("@tamagui/core").TextStylePropsBase, {}, {}>;
        Item: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, "scope" | keyof MenuItemProps> & MenuItemProps & {
            scope?: string;
        }, TamaguiElement, import("@tamagui/core").StackNonStyleProps & MenuItemProps & {
            scope?: string;
        }, import("@tamagui/core").StackStyleBase, {}, {}>;
        CheckboxItem: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, "scope" | keyof MenuCheckboxItemProps> & MenuCheckboxItemProps & {
            scope?: string;
        }, TamaguiElement, import("@tamagui/core").StackNonStyleProps & MenuCheckboxItemProps & {
            scope?: string;
        }, import("@tamagui/core").StackStyleBase, {}, {}>;
        RadioGroup: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, "scope" | keyof MenuRadioGroupProps> & MenuRadioGroupProps & {
            scope?: string;
        }, TamaguiElement, import("@tamagui/core").StackNonStyleProps & MenuRadioGroupProps & {
            scope?: string;
        }, import("@tamagui/core").StackStyleBase, {}, {}>;
        RadioItem: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, "scope" | keyof MenuRadioItemProps> & MenuRadioItemProps & {
            scope?: string;
        }, TamaguiElement, import("@tamagui/core").StackNonStyleProps & MenuRadioItemProps & {
            scope?: string;
        }, import("@tamagui/core").StackStyleBase, {}, {}>;
        ItemIndicator: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, "scope" | keyof MenuItemIndicatorProps> & MenuItemIndicatorProps & {
            scope?: string;
        }, TamaguiElement, import("@tamagui/core").StackNonStyleProps & MenuItemIndicatorProps & {
            scope?: string;
        }, import("@tamagui/core").StackStyleBase, {}, {}>;
        Separator: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, keyof MenuSeparatorProps> & MenuSeparatorProps, TamaguiElement, import("@tamagui/core").StackNonStyleProps & MenuSeparatorProps, import("@tamagui/core").StackStyleBase, {}, {}>;
        Arrow: import("@tamagui/core").RefComponent<TamaguiElement, Omit<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & PopperPrimitive.PopperArrowExtraProps & import("@tamagui/core").RefProp<TamaguiElement>, "ref">>;
        Sub: React.FC<ScopedProps<MenuSubProps>>;
        SubTrigger: import("@tamagui/core").RefComponent<TamaguiElement, ScopedProps<MenuSubTriggerProps>>;
        SubContent: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, keyof MenuSubContentProps> & MenuSubContentProps & {
            scope?: string;
        }, (HTMLElement & import("@tamagui/core").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & MenuSubContentProps & {
            scope?: string;
        }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
        ItemTitle: import("@tamagui/core").TamaguiComponent<Omit<TextProps, keyof MenuItemTitleProps> & MenuItemTitleProps, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & MenuItemTitleProps, import("@tamagui/core").TextStylePropsBase, {}, {}>;
        ItemSubtitle: import("@tamagui/core").TamaguiComponent<Omit<TextProps, keyof MenuItemSubTitleProps> & MenuItemSubTitleProps, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps & MenuItemSubTitleProps, import("@tamagui/core").TextStylePropsBase, {}, {}>;
        ItemImage: import("@tamagui/core").RefComponent<TamaguiElement, ImageProps>;
        ItemIcon: import("@tamagui/core").TamaguiComponent<Omit<ViewProps, "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").StackNonStyleProps | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>>> & import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>, TamaguiElement, import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>>, import("@tamagui/core").StackStyleBase, {}, {}>;
    };
};
export type { MenuAnchorProps, MenuArrowProps, MenuCheckboxItemProps, MenuContentProps, MenuGroupProps, MenuItemIconProps, MenuItemIndicatorProps, MenuItemProps, MenuItemSubTitleProps, MenuItemTitleProps, MenuLabelProps, MenuPortalProps, MenuBaseProps as MenuProps, MenuRadioGroupProps, MenuRadioItemProps, MenuSeparatorProps, MenuSubTriggerProps, };
//# sourceMappingURL=createBaseMenu.d.ts.map