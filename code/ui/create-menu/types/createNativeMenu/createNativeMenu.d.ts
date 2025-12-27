/**
 * createNativeMenu - provides native menu implementation for React Native
 *
 * On Web: Returns empty stub components (withNativeMenu will use the web components instead)
 * On Native: Uses Zeego for native menus (Credit to nandorojo/Zeego)
 */
import type { FC } from 'react';
import React from 'react';
import type { ContextMenuPreviewProps, MenuArrowProps, MenuCheckboxItemProps, MenuContentProps, MenuGroupProps, MenuItemIconProps, MenuItemImageProps, MenuItemIndicatorProps, MenuItemProps, MenuItemSubtitleProps, MenuItemTitleProps, MenuLabelProps, MenuProps, MenuSeparatorProps, MenuSubContentProps, MenuSubProps, MenuSubTriggerProps, MenuTriggerProps } from './createNativeMenuTypes';
export type NativeMenuComponents = {
    Menu: FC<MenuProps> & {
        Trigger: FC<MenuTriggerProps>;
        Content: FC<MenuContentProps>;
        Item: FC<MenuItemProps>;
        ItemTitle: FC<MenuItemTitleProps>;
        ItemSubtitle: FC<MenuItemSubtitleProps>;
        SubTrigger: FC<MenuSubTriggerProps>;
        Group: FC<MenuGroupProps>;
        ItemIcon: FC<MenuItemIconProps>;
        Separator: FC<MenuSeparatorProps>;
        CheckboxItem: FC<MenuCheckboxItemProps>;
        ItemIndicator: FC<MenuItemIndicatorProps>;
        ItemImage: FC<MenuItemImageProps>;
        Label: FC<MenuLabelProps>;
        Arrow: FC<MenuArrowProps>;
        Sub: FC<MenuSubProps>;
        SubContent: FC<MenuSubContentProps>;
        Preview: FC<ContextMenuPreviewProps>;
        Portal: FC<{
            children: React.ReactNode;
        }>;
        RadioGroup: FC<{
            children: React.ReactNode;
        }>;
        RadioItem: FC<{
            children: React.ReactNode;
        }>;
        Auxiliary: FC<any>;
    };
};
export declare const createNativeMenu: (MenuType: "ContextMenu" | "Menu") => NativeMenuComponents;
//# sourceMappingURL=createNativeMenu.d.ts.map