import { type MenuProps, type MenuSubProps, createMenu } from '@tamagui/menu';
import type { Menu as MenuTypes } from '@tamagui/menu';
import * as React from 'react';
import { Button } from 'tamagui';
type Direction = 'ltr' | 'rtl';
export declare const DROPDOWN_MENU_CONTEXT = "DropdownMenuContext";
type ScopedProps<P> = P & {
    __scopeDropdownMenu?: string;
};
interface DropdownMenuProps extends MenuProps {
    children?: React.ReactNode;
    dir?: Direction;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    modal?: boolean;
}
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Button>;
interface DropdownMenuTriggerProps extends PrimitiveButtonProps {
    onKeydown?(event: React.KeyboardEvent): void;
}
type MenuPortalProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Portal>;
interface DropdownMenuPortalProps extends MenuPortalProps {
}
type MenuContentProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Content>;
interface DropdownMenuContentProps extends Omit<MenuContentProps, 'onEntryFocus'> {
}
type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Group>;
type DropdownMenuGroupProps = MenuGroupProps & {};
type MenuLabelProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Label>;
type DropdownMenuLabelProps = MenuLabelProps & {};
type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Item>;
interface DropdownMenuItemProps extends MenuItemProps {
}
type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenuTypes.CheckboxItem>;
interface DropdownMenuCheckboxItemProps extends MenuCheckboxItemProps {
}
type MenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuTypes.RadioGroup>;
interface DropdownMenuRadioGroupProps extends MenuRadioGroupProps {
}
type MenuRadioItemProps = React.ComponentPropsWithoutRef<typeof MenuTypes.RadioItem>;
interface DropdownMenuRadioItemProps extends MenuRadioItemProps {
}
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<typeof MenuTypes.ItemIndicator>;
interface DropdownMenuItemIndicatorProps extends MenuItemIndicatorProps {
}
type MenuArrowProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Arrow>;
type DropdownMenuArrowProps = MenuArrowProps & {};
interface DropdownMenuSubProps extends MenuSubProps {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
}
type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenuTypes.SubTrigger>;
interface DropdownMenuSubTriggerProps extends MenuSubTriggerProps {
}
type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof MenuTypes.SubContent>;
interface DropdownMenuSubContentProps extends MenuSubContentProps {
}
export declare function createNonNativeDropdownMenu(params: Parameters<typeof createMenu>[0]): {
    (props: ScopedProps<DropdownMenuProps>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
} & {
    Root: {
        (props: ScopedProps<DropdownMenuProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Trigger: any;
    Portal: {
        (props: ScopedProps<DropdownMenuPortalProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Content: React.ForwardRefExoticComponent<Omit<ScopedProps<DropdownMenuContentProps>, "ref"> & React.RefAttributes<any>>;
    Group: any;
    Label: any;
    Item: any;
    CheckboxItem: any;
    RadioGroup: React.ForwardRefExoticComponent<DropdownMenuRadioGroupProps & {
        __scopeDropdownMenu?: string;
    } & React.RefAttributes<any>>;
    RadioItem: any;
    ItemIndicator: any;
    Separator: any;
    Arrow: React.ForwardRefExoticComponent<any>;
    Sub: {
        (props: ScopedProps<DropdownMenuSubProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    SubTrigger: any;
    SubContent: React.ForwardRefExoticComponent<DropdownMenuSubContentProps & {
        __scopeDropdownMenu?: string;
    } & React.RefAttributes<any>>;
    ItemTitle: any;
    ItemSubtitle: any;
    ItemImage: any;
    ItemIcon: any;
};
export type { DropdownMenuProps, DropdownMenuTriggerProps, DropdownMenuPortalProps, DropdownMenuContentProps, DropdownMenuGroupProps, DropdownMenuLabelProps, DropdownMenuItemProps, DropdownMenuCheckboxItemProps, DropdownMenuRadioGroupProps, DropdownMenuRadioItemProps, DropdownMenuItemIndicatorProps, DropdownMenuArrowProps, DropdownMenuSubProps, DropdownMenuSubTriggerProps, DropdownMenuSubContentProps, };
//# sourceMappingURL=createNonNativeDropdownMenu.d.ts.map