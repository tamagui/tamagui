import { Button } from '@tamagui/button';
import * as MenuPrimitive from '@tamagui/menu';
import * as React from 'react';
type Direction = 'ltr' | 'rtl';
type ScopedProps<P> = P & {
    __scopeDropdownMenu?: string;
};
interface DropdownMenuProps {
    children?: React.ReactNode;
    dir?: Direction;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    modal?: boolean;
}
declare const DropdownMenu: React.FC<DropdownMenuProps>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Button>;
interface DropdownMenuTriggerProps extends PrimitiveButtonProps {
}
declare const DropdownMenuTrigger: React.ForwardRefExoticComponent<DropdownMenuTriggerProps & {
    __scopeDropdownMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuPortalProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Portal>;
interface DropdownMenuPortalProps extends MenuPortalProps {
}
declare const DropdownMenuPortal: React.FC<ScopedProps<DropdownMenuPortalProps>>;
type MenuContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>;
interface DropdownMenuContentProps extends Omit<MenuContentProps, 'onEntryFocus'> {
}
declare const DropdownMenuContent: React.ForwardRefExoticComponent<DropdownMenuContentProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>;
interface DropdownMenuGroupProps extends MenuGroupProps {
}
declare const DropdownMenuGroup: React.ForwardRefExoticComponent<DropdownMenuGroupProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuLabelProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Label>;
interface DropdownMenuLabelProps extends MenuLabelProps {
}
declare const DropdownMenuLabel: React.ForwardRefExoticComponent<DropdownMenuLabelProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>;
interface DropdownMenuItemProps extends MenuItemProps {
}
declare const DropdownMenuItem: React.ForwardRefExoticComponent<DropdownMenuItemProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>;
interface DropdownMenuCheckboxItemProps extends MenuCheckboxItemProps {
}
declare const DropdownMenuCheckboxItem: React.ForwardRefExoticComponent<DropdownMenuCheckboxItemProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>;
interface DropdownMenuRadioGroupProps extends MenuRadioGroupProps {
}
declare const DropdownMenuRadioGroup: React.ForwardRefExoticComponent<DropdownMenuRadioGroupProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuRadioItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>;
interface DropdownMenuRadioItemProps extends MenuRadioItemProps {
}
declare const DropdownMenuRadioItem: React.ForwardRefExoticComponent<DropdownMenuRadioItemProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.ItemIndicator>;
interface DropdownMenuItemIndicatorProps extends MenuItemIndicatorProps {
}
declare const DropdownMenuItemIndicator: React.ForwardRefExoticComponent<DropdownMenuItemIndicatorProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>;
interface DropdownMenuSeparatorProps extends MenuSeparatorProps {
}
declare const DropdownMenuSeparator: React.ForwardRefExoticComponent<DropdownMenuSeparatorProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuArrowProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>;
interface DropdownMenuArrowProps extends MenuArrowProps {
}
declare const DropdownMenuArrow: React.ForwardRefExoticComponent<DropdownMenuArrowProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
interface DropdownMenuSubProps {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
}
declare const DropdownMenuSub: React.FC<DropdownMenuSubProps>;
type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger>;
interface DropdownMenuSubTriggerProps extends MenuSubTriggerProps {
}
declare const DropdownMenuSubTrigger: React.ForwardRefExoticComponent<DropdownMenuSubTriggerProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent>;
interface DropdownMenuSubContentProps extends MenuSubContentProps {
}
declare const DropdownMenuSubContent: React.ForwardRefExoticComponent<DropdownMenuSubContentProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const Root: React.FC<DropdownMenuProps>;
declare const Trigger: React.ForwardRefExoticComponent<DropdownMenuTriggerProps & {
    __scopeDropdownMenu?: string | undefined;
} & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const Portal: React.FC<ScopedProps<DropdownMenuPortalProps>>;
declare const Content: React.ForwardRefExoticComponent<DropdownMenuContentProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const Group: React.ForwardRefExoticComponent<DropdownMenuGroupProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const Label: React.ForwardRefExoticComponent<DropdownMenuLabelProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const Item: React.ForwardRefExoticComponent<DropdownMenuItemProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const CheckboxItem: React.ForwardRefExoticComponent<DropdownMenuCheckboxItemProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const RadioGroup: React.ForwardRefExoticComponent<DropdownMenuRadioGroupProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const RadioItem: React.ForwardRefExoticComponent<DropdownMenuRadioItemProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const ItemIndicator: React.ForwardRefExoticComponent<DropdownMenuItemIndicatorProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const Separator: React.ForwardRefExoticComponent<DropdownMenuSeparatorProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const Arrow: React.ForwardRefExoticComponent<DropdownMenuArrowProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const Sub: React.FC<DropdownMenuSubProps>;
declare const SubTrigger: React.ForwardRefExoticComponent<DropdownMenuSubTriggerProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
declare const SubContent: React.ForwardRefExoticComponent<DropdownMenuSubContentProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>>;
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItemIndicator, DropdownMenuSeparator, DropdownMenuArrow, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, Root, Trigger, Portal, Content, Group, Label, Item, CheckboxItem, RadioGroup, RadioItem, ItemIndicator, Separator, Arrow, Sub, SubTrigger, SubContent, };
export type { DropdownMenuProps, DropdownMenuTriggerProps, DropdownMenuPortalProps, DropdownMenuContentProps, DropdownMenuGroupProps, DropdownMenuLabelProps, DropdownMenuItemProps, DropdownMenuCheckboxItemProps, DropdownMenuRadioGroupProps, DropdownMenuRadioItemProps, DropdownMenuItemIndicatorProps, DropdownMenuSeparatorProps, DropdownMenuArrowProps, DropdownMenuSubProps, DropdownMenuSubTriggerProps, DropdownMenuSubContentProps, };
//# sourceMappingURL=DropdownMenu.d.ts.map