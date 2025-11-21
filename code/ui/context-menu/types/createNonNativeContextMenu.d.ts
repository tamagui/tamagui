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
    Trigger: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").StackProps, keyof ContextMenuTriggerProps | "scope"> & ContextMenuTriggerProps & {
        scope?: string;
    }, TamaguiElement, import("@tamagui/web").StackNonStyleProps & ContextMenuTriggerProps & {
        scope?: string;
    }, import("@tamagui/web").StackStyleBase, {}, {}>;
    Portal: {
        (props: ScopedProps<ContextMenuPortalProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Content: React.ForwardRefExoticComponent<Omit<ScopedProps<ContextMenuContentProps>, "ref"> & React.RefAttributes<any>>;
    Group: any;
    Label: any;
    Item: React.ForwardRefExoticComponent<ContextMenuItemProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>>;
    CheckboxItem: React.ForwardRefExoticComponent<ContextMenuCheckboxItemProps & {
        scope?: string;
    } & React.RefAttributes<TamaguiElement>>;
    RadioGroup: React.ForwardRefExoticComponent<any>;
    RadioItem: React.ForwardRefExoticComponent<any>;
    ItemIndicator: import("@tamagui/web").TamaguiComponent<Omit<any, "scope"> & ContextMenuItemIndicatorProps & {
        scope?: string;
    }, any, any, any, any, any>;
    Separator: any;
    Arrow: React.ForwardRefExoticComponent<ContextMenuArrowProps & React.RefAttributes<TamaguiElement>>;
    Sub: React.FC<ScopedProps<ContextMenuSubProps>>;
    SubTrigger: import("@tamagui/web").TamaguiComponent<any, TamaguiElement, any, import("@tamagui/web").StackStyleBase, {}, {}>;
    SubContent: React.ForwardRefExoticComponent<ContextMenuSubContentProps & {
        children?: React.ReactNode | undefined;
    } & {
        scope?: string;
    } & React.RefAttributes<any>>;
    ItemTitle: any;
    ItemSubtitle: any;
    ItemIcon: any;
    ItemImage: any;
    Preview: {
        (): null;
        displayName: string;
    };
};
export type { ContextMenuArrowProps, ContextMenuCheckboxItemProps, ContextMenuContentProps, ContextMenuGroupProps, ContextMenuItemIconProps, ContextMenuItemImageProps, ContextMenuItemIndicatorProps, ContextMenuItemProps, ContextMenuPortalProps, ContextMenuProps, ContextMenuRadioGroupProps, ContextMenuRadioItemProps, ContextMenuSeparatorProps, ContextMenuSubContentProps, ContextMenuSubProps, ContextMenuSubTriggerProps, ContextMenuTriggerProps, };
//# sourceMappingURL=createNonNativeContextMenu.d.ts.map