import { Dismissable as DismissableLayer } from '@tamagui/dismissable';
import { FocusScope } from '@tamagui/focus-scope';
import * as PopperPrimitive from '@tamagui/popper';
import type { PopperContentProps } from '@tamagui/popper';
import { PortalProps } from '@tamagui/portal';
import type { RovingFocusGroupProps } from '@tamagui/roving-focus';
import { Stack } from '@tamagui/web';
import { TamaguiElement } from '@tamagui/web/types';
import * as React from 'react';
type Direction = 'ltr' | 'rtl';
type ScopedProps<P> = P & {
    __scopeMenu?: string;
};
interface MenuProps {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?(open: boolean): void;
    dir?: Direction;
    modal?: boolean;
}
declare const Menu: React.FC<ScopedProps<MenuProps>>;
type PopperAnchorProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperAnchor>;
interface MenuAnchorProps extends PopperAnchorProps {
}
declare const MenuAnchor: React.ForwardRefExoticComponent<MenuAnchorProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<HTMLElement | import("react-native").View>>;
interface MenuPortalProps {
    children?: React.ReactNode;
    /**
     * Specify a container element to portal the content into.
     */
    host?: PortalProps['host'];
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const MenuPortal: React.FC<ScopedProps<MenuPortalProps>>;
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
    forceMount?: true;
}
declare const MenuContent: React.ForwardRefExoticComponent<MenuContentProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
interface MenuRootContentTypeProps extends Omit<MenuContentImplProps, keyof MenuContentImplPrivateProps> {
}
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
};
interface MenuContentImplProps extends MenuContentImplPrivateProps, Omit<PopperContentProps, 'dir' | 'onPlaced'> {
    /**
     * Event handler called when auto-focusing on close.
     * Can be prevented.
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
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Stack>;
interface MenuGroupProps extends PrimitiveDivProps {
}
declare const MenuGroup: React.ForwardRefExoticComponent<MenuGroupProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
interface MenuLabelProps extends PrimitiveDivProps {
}
declare const MenuLabel: React.ForwardRefExoticComponent<MenuLabelProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
interface MenuItemProps extends Omit<MenuItemImplProps, 'onSelect'> {
    onSelect?: (event: Event) => void;
}
declare const MenuItem: React.ForwardRefExoticComponent<MenuItemProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
interface MenuItemImplProps extends PrimitiveDivProps {
    disabled?: boolean;
    textValue?: string;
}
type CheckedState = boolean | 'indeterminate';
interface MenuCheckboxItemProps extends MenuItemProps {
    checked?: CheckedState;
    onCheckedChange?: (checked: boolean) => void;
}
declare const MenuCheckboxItem: React.ForwardRefExoticComponent<MenuCheckboxItemProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
interface MenuRadioGroupProps extends MenuGroupProps {
    value?: string;
    onValueChange?: (value: string) => void;
}
declare const MenuRadioGroup: React.ForwardRefExoticComponent<MenuRadioGroupProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
interface MenuRadioItemProps extends MenuItemProps {
    value: string;
}
declare const MenuRadioItem: React.ForwardRefExoticComponent<MenuRadioItemProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Stack>;
interface MenuItemIndicatorProps extends PrimitiveSpanProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const MenuItemIndicator: React.ForwardRefExoticComponent<MenuItemIndicatorProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
interface MenuSeparatorProps extends PrimitiveDivProps {
}
declare const MenuSeparator: React.ForwardRefExoticComponent<MenuSeparatorProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
type PopperArrowProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperArrow>;
interface MenuArrowProps extends PopperArrowProps {
}
declare const MenuArrow: React.ForwardRefExoticComponent<MenuArrowProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
interface MenuSubProps {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?(open: boolean): void;
}
declare const MenuSub: React.FC<ScopedProps<MenuSubProps>>;
interface MenuSubTriggerProps extends MenuItemImplProps {
}
declare const MenuSubTrigger: React.ForwardRefExoticComponent<MenuSubTriggerProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
interface MenuSubContentProps extends Omit<MenuContentImplProps, keyof MenuContentImplPrivateProps | 'onCloseAutoFocus' | 'onEntryFocus' | 'side' | 'align'> {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const MenuSubContent: React.ForwardRefExoticComponent<MenuSubContentProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
declare const Root: React.FC<ScopedProps<MenuProps>>;
declare const Anchor: React.ForwardRefExoticComponent<MenuAnchorProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<HTMLElement | import("react-native").View>>;
declare const Portal: React.FC<ScopedProps<MenuPortalProps>>;
declare const Content: React.ForwardRefExoticComponent<MenuContentProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
declare const Group: React.ForwardRefExoticComponent<MenuGroupProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
declare const Label: React.ForwardRefExoticComponent<MenuLabelProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
declare const Item: React.ForwardRefExoticComponent<MenuItemProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
declare const CheckboxItem: React.ForwardRefExoticComponent<MenuCheckboxItemProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
declare const RadioGroup: React.ForwardRefExoticComponent<MenuRadioGroupProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
declare const RadioItem: React.ForwardRefExoticComponent<MenuRadioItemProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
declare const ItemIndicator: React.ForwardRefExoticComponent<MenuItemIndicatorProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
declare const Separator: React.ForwardRefExoticComponent<MenuSeparatorProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
declare const Arrow: React.ForwardRefExoticComponent<MenuArrowProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
declare const Sub: React.FC<ScopedProps<MenuSubProps>>;
declare const SubTrigger: React.ForwardRefExoticComponent<MenuSubTriggerProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
declare const SubContent: React.ForwardRefExoticComponent<MenuSubContentProps & {
    __scopeMenu?: string | undefined;
} & React.RefAttributes<TamaguiElement>>;
export { Menu, MenuAnchor, MenuPortal, MenuContent, MenuGroup, MenuLabel, MenuItem, MenuCheckboxItem, MenuRadioGroup, MenuRadioItem, MenuItemIndicator, MenuSeparator, MenuArrow, MenuSub, MenuSubTrigger, MenuSubContent, Root, Anchor, Portal, Content, Group, Label, Item, CheckboxItem, RadioGroup, RadioItem, ItemIndicator, Separator, Arrow, Sub, SubTrigger, SubContent, };
export type { MenuProps, MenuAnchorProps, MenuPortalProps, MenuContentProps, MenuGroupProps, MenuLabelProps, MenuItemProps, MenuCheckboxItemProps, MenuRadioGroupProps, MenuRadioItemProps, MenuItemIndicatorProps, MenuSeparatorProps, MenuArrowProps, MenuSubProps, MenuSubTriggerProps, MenuSubContentProps, };
//# sourceMappingURL=Menu.d.ts.map