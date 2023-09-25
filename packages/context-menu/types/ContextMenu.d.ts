import { Stack } from '@tamagui/core';
import { MenuArrow, MenuCheckboxItem, MenuContent, MenuGroup, MenuItem, MenuItemIndicator, MenuLabel, MenuPortal, MenuRadioGroup, MenuRadioItem, MenuSeparator, MenuSubContent, MenuSubTrigger } from '@tamagui/menu';
import * as React from 'react';
type Direction = 'ltr' | 'rtl';
type ScopedProps<P> = P & {
    __scopeContextMenu?: string;
};
interface ContextMenuProps {
    children?: React.ReactNode;
    onOpenChange?(open: boolean): void;
    dir?: Direction;
    modal?: boolean;
}
declare const ContextMenu: React.FC<ScopedProps<ContextMenuProps>>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Stack>;
interface ContextMenuTriggerProps extends PrimitiveSpanProps {
    disabled?: boolean;
}
declare const ContextMenuTrigger: React.ForwardRefExoticComponent<ContextMenuTriggerProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuPortalProps = React.ComponentPropsWithoutRef<typeof MenuPortal>;
interface ContextMenuPortalProps extends MenuPortalProps {
}
declare const ContextMenuPortal: React.FC<ScopedProps<ContextMenuPortalProps>>;
type MenuContentProps = React.ComponentPropsWithoutRef<typeof MenuContent>;
interface ContextMenuContentProps extends Omit<MenuContentProps, 'onEntryFocus' | 'side' | 'sideOffset' | 'align'> {
}
declare const ContextMenuContent: React.ForwardRefExoticComponent<ContextMenuContentProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuGroup>;
interface ContextMenuGroupProps extends MenuGroupProps {
}
declare const ContextMenuGroup: React.ForwardRefExoticComponent<ContextMenuGroupProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuLabelProps = React.ComponentPropsWithoutRef<typeof MenuLabel>;
interface ContextMenuLabelProps extends MenuLabelProps {
}
declare const ContextMenuLabel: React.ForwardRefExoticComponent<ContextMenuLabelProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuItem>;
interface ContextMenuItemProps extends MenuItemProps {
}
declare const ContextMenuItem: React.ForwardRefExoticComponent<ContextMenuItemProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenuCheckboxItem>;
interface ContextMenuCheckboxItemProps extends MenuCheckboxItemProps {
}
declare const ContextMenuCheckboxItem: React.ForwardRefExoticComponent<ContextMenuCheckboxItemProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuRadioGroup>;
interface ContextMenuRadioGroupProps extends MenuRadioGroupProps {
}
declare const ContextMenuRadioGroup: React.ForwardRefExoticComponent<ContextMenuRadioGroupProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuRadioItemProps = React.ComponentPropsWithoutRef<typeof MenuRadioItem>;
interface ContextMenuRadioItemProps extends MenuRadioItemProps {
}
declare const ContextMenuRadioItem: React.ForwardRefExoticComponent<ContextMenuRadioItemProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<typeof MenuItemIndicator>;
interface ContextMenuItemIndicatorProps extends MenuItemIndicatorProps {
}
declare const ContextMenuItemIndicator: React.ForwardRefExoticComponent<ContextMenuItemIndicatorProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof MenuSeparator>;
interface ContextMenuSeparatorProps extends MenuSeparatorProps {
}
declare const ContextMenuSeparator: React.ForwardRefExoticComponent<ContextMenuSeparatorProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuArrowProps = React.ComponentPropsWithoutRef<typeof MenuArrow>;
interface ContextMenuArrowProps extends MenuArrowProps {
}
declare const ContextMenuArrow: React.ForwardRefExoticComponent<ContextMenuArrowProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
interface ContextMenuSubProps {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
}
declare const ContextMenuSub: React.FC<ScopedProps<ContextMenuSubProps>>;
type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenuSubTrigger>;
interface ContextMenuSubTriggerProps extends MenuSubTriggerProps {
}
declare const ContextMenuSubTrigger: React.ForwardRefExoticComponent<ContextMenuSubTriggerProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof MenuSubContent>;
interface ContextMenuSubContentProps extends MenuSubContentProps {
}
declare const ContextMenuSubContent: React.ForwardRefExoticComponent<ContextMenuSubContentProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const Root: React.FC<ScopedProps<ContextMenuProps>>;
declare const Trigger: React.ForwardRefExoticComponent<ContextMenuTriggerProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const Portal: React.FC<ScopedProps<ContextMenuPortalProps>>;
declare const Content: React.ForwardRefExoticComponent<ContextMenuContentProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const Group: React.ForwardRefExoticComponent<ContextMenuGroupProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const Label: React.ForwardRefExoticComponent<ContextMenuLabelProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const Item: React.ForwardRefExoticComponent<ContextMenuItemProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const CheckboxItem: React.ForwardRefExoticComponent<ContextMenuCheckboxItemProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const RadioGroup: React.ForwardRefExoticComponent<ContextMenuRadioGroupProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const RadioItem: React.ForwardRefExoticComponent<ContextMenuRadioItemProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const ItemIndicator: React.ForwardRefExoticComponent<ContextMenuItemIndicatorProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const Separator: React.ForwardRefExoticComponent<ContextMenuSeparatorProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const Arrow: React.ForwardRefExoticComponent<ContextMenuArrowProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const Sub: React.FC<ScopedProps<ContextMenuSubProps>>;
declare const SubTrigger: React.ForwardRefExoticComponent<ContextMenuSubTriggerProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const SubContent: React.ForwardRefExoticComponent<ContextMenuSubContentProps & {
    __scopeContextMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
export { ContextMenu, ContextMenuTrigger, ContextMenuPortal, ContextMenuContent, ContextMenuGroup, ContextMenuLabel, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuItemIndicator, ContextMenuSeparator, ContextMenuArrow, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent, Root, Trigger, Portal, Content, Group, Label, Item, CheckboxItem, RadioGroup, RadioItem, ItemIndicator, Separator, Arrow, Sub, SubTrigger, SubContent, };
export type { ContextMenuProps, ContextMenuTriggerProps, ContextMenuPortalProps, ContextMenuContentProps, ContextMenuGroupProps, ContextMenuLabelProps, ContextMenuItemProps, ContextMenuCheckboxItemProps, ContextMenuRadioGroupProps, ContextMenuRadioItemProps, ContextMenuItemIndicatorProps, ContextMenuSeparatorProps, ContextMenuArrowProps, ContextMenuSubProps, ContextMenuSubTriggerProps, ContextMenuSubContentProps, };
//# sourceMappingURL=ContextMenu.d.ts.map