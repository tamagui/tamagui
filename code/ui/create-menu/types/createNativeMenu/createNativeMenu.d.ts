/**
 * createNativeMenu - provides native menu implementation for React Native
 *
 * On Web: Returns empty stub components (withNativeMenu will use the web components instead)
 * On Native: Uses Zeego for native menus (Credit to nandorojo/Zeego)
 */
import type { FC } from 'react';
import React from 'react';
import type { ContextMenuPreviewProps, MenuArrowProps, MenuCheckboxItemProps, MenuContentProps, MenuGroupProps, MenuItemImageProps, MenuItemIndicatorProps, MenuItemProps, MenuItemSubtitleProps, MenuItemTitleProps, MenuLabelProps, MenuProps, MenuSeparatorProps, MenuSubContentProps, MenuSubProps, MenuSubTriggerProps, MenuTriggerProps } from './createNativeMenuTypes';
export declare const createNativeMenu: (MenuType: "ContextMenu" | "Menu") => {
    Menu: FC<MenuProps> & {
        Trigger: FC<MenuTriggerProps>;
        Content: FC<MenuContentProps>;
        Item: FC<MenuItemProps>;
        ItemTitle: FC<MenuItemTitleProps>;
        ItemSubtitle: FC<MenuItemSubtitleProps>;
        SubTrigger: FC<MenuSubTriggerProps>;
        Group: FC<MenuGroupProps>;
        ItemIcon: FC<import("./createNativeMenuTypes").MenuItemCommonProps>;
        Separator: FC<MenuSeparatorProps>;
        CheckboxItem: FC<MenuCheckboxItemProps>;
        ItemIndicator: FC<MenuItemIndicatorProps>;
        ItemImage: FC<MenuItemImageProps>;
        Label: FC<MenuLabelProps>;
        Arrow: FC<MenuArrowProps>;
        Sub: FC<MenuSubProps>;
        SubContent: FC<MenuSubContentProps>;
        Preview: FC<ContextMenuPreviewProps>;
    };
} | {
    Menu: FC<MenuProps> & {
        Trigger: any;
        Content: any;
        Item: any;
        ItemTitle: any;
        ItemSubtitle: any;
        ItemIcon: any;
        ItemImage: any;
        CheckboxItem: FC<any>;
        ItemIndicator: any;
        Group: any;
        Label: any;
        Separator: any;
        Sub: any;
        SubTrigger: any;
        SubContent: any;
        Portal: FC<{
            children: React.ReactNode;
        }>;
        RadioGroup: FC<{
            children: React.ReactNode;
            value?: string;
            onValueChange?: (value: string) => void;
        }>;
        RadioItem: FC<{
            children: React.ReactNode;
            value: string;
        }>;
        Arrow: FC<{}>;
        Preview: FC<any>;
        Auxiliary: FC<any>;
    };
};
//# sourceMappingURL=createNativeMenu.d.ts.map