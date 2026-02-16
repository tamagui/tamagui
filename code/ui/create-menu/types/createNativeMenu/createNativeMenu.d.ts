/**
 * createNativeMenu - provides native menu implementation for React Native
 *
 * On Web: Returns empty stub components (withNativeMenu will use the web components instead)
 * On Native: Uses Zeego for native menus (Credit to nandorojo/Zeego)
 */
import type { FC } from 'react';
import React from 'react';
import type { ContextMenuPreviewProps, NativeMenuArrowProps, NativeMenuCheckboxItemProps, NativeMenuContentProps, NativeMenuGroupProps, NativeMenuItemIconProps, NativeMenuItemImageProps, NativeMenuItemIndicatorProps, NativeMenuItemProps, NativeMenuItemSubtitleProps, NativeMenuItemTitleProps, NativeMenuLabelProps, NativeMenuProps, NativeMenuSeparatorProps, NativeMenuSubContentProps, NativeMenuSubProps, NativeMenuSubTriggerProps, MenuTriggerProps } from './createNativeMenuTypes';
export type NativeMenuComponents = {
    Menu: FC<NativeMenuProps> & {
        Trigger: FC<MenuTriggerProps>;
        Content: FC<NativeMenuContentProps>;
        Item: FC<NativeMenuItemProps>;
        ItemTitle: FC<NativeMenuItemTitleProps>;
        ItemSubtitle: FC<NativeMenuItemSubtitleProps>;
        SubTrigger: FC<NativeMenuSubTriggerProps>;
        Group: FC<NativeMenuGroupProps>;
        ItemIcon: FC<NativeMenuItemIconProps>;
        Separator: FC<NativeMenuSeparatorProps>;
        CheckboxItem: FC<NativeMenuCheckboxItemProps>;
        ItemIndicator: FC<NativeMenuItemIndicatorProps>;
        ItemImage: FC<NativeMenuItemImageProps>;
        Label: FC<NativeMenuLabelProps>;
        Arrow: FC<NativeMenuArrowProps>;
        Sub: FC<NativeMenuSubProps>;
        SubContent: FC<NativeMenuSubContentProps>;
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