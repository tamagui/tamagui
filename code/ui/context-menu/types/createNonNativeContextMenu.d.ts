import { Stack } from '@tamagui/core';
import { Menu, type MenuItemIconProps, type MenuItemImageProps, type MenuProps, type MenuSubProps, type createMenu } from '@tamagui/menu';
import * as React from 'react';
type Direction = 'ltr' | 'rtl';
type ScopedProps<P> = P & {
    __scopeContextMenu?: string;
};
interface ContextMenuProps extends MenuProps {
    children?: React.ReactNode;
    onOpenChange?(open: boolean): void;
    dir?: Direction;
    modal?: boolean;
}
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Stack>;
interface ContextMenuTriggerProps extends PrimitiveSpanProps {
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
    Trigger: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, import("@tamagui/core").StackStyleBase, {}, {}>;
    Portal: {
        (props: ScopedProps<ContextMenuPortalProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Content: React.ForwardRefExoticComponent<Omit<ScopedProps<ContextMenuContentProps>, "ref"> & React.RefAttributes<any>>;
    Group: any;
    Label: any;
    Item: any;
    CheckboxItem: any;
    RadioGroup: React.ForwardRefExoticComponent<any>;
    RadioItem: any;
    ItemIndicator: import("@tamagui/core").TamaguiComponent<Omit<any, "__scopeContextMenu"> & ContextMenuItemIndicatorProps & {
        __scopeContextMenu?: string;
    }, any, any, any, any, any>;
    Separator: any;
    Arrow: any;
    Sub: React.FC<ScopedProps<ContextMenuSubProps>>;
    SubTrigger: import("@tamagui/core").TamaguiComponent<any, import("@tamagui/core").TamaguiElement, any, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | import("@tamagui/core").SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    SubContent: React.ForwardRefExoticComponent<ContextMenuSubContentProps & {
        children?: React.ReactNode | undefined;
    } & {
        __scopeContextMenu?: string;
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
export type { ContextMenuProps, ContextMenuTriggerProps, ContextMenuPortalProps, ContextMenuContentProps, ContextMenuGroupProps, ContextMenuItemProps, ContextMenuCheckboxItemProps, ContextMenuRadioGroupProps, ContextMenuRadioItemProps, ContextMenuItemIndicatorProps, ContextMenuSeparatorProps, ContextMenuArrowProps, ContextMenuSubProps, ContextMenuSubTriggerProps, ContextMenuSubContentProps, ContextMenuItemImageProps, ContextMenuItemIconProps, };
//# sourceMappingURL=createNonNativeContextMenu.d.ts.map