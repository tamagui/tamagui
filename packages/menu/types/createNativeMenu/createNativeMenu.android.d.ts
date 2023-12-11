import React from 'react';
import type { ContextMenuAuxliliaryProps, ContextMenuPreviewProps, MenuArrowProps, MenuCheckboxItemProps, MenuContentProps, MenuGroupProps, MenuItemImageProps, MenuItemIndicatorProps, MenuItemProps, MenuItemSubtitleProps, MenuItemTitleProps, MenuLabelProps, MenuProps, MenuSeparatorProps, MenuSubContentProps, MenuSubProps, MenuSubTriggerProps, MenuTriggerProps } from './createNativeMenuTypes';
declare const createAndroidMenu: (MenuType: 'ContextMenu' | 'DropdownMenu') => {
    Menu: React.FC<MenuProps> & {
        Trigger: React.FC<MenuTriggerProps>;
        Content: React.FC<MenuContentProps>;
        Item: React.FC<MenuItemProps>;
        ItemTitle: React.FC<MenuItemTitleProps>;
        ItemSubtitle: React.FC<MenuItemSubtitleProps>;
        SubTrigger: React.FC<MenuSubTriggerProps>;
        Group: React.FC<MenuGroupProps>;
        Separator: React.FC<MenuSeparatorProps>;
        ItemIcon: React.FC<import("./createNativeMenuTypes").MenuItemCommonProps>;
        ItemIndicator: React.FC<MenuItemIndicatorProps>;
        CheckboxItem: React.FC<MenuCheckboxItemProps>;
        ItemImage: React.FC<MenuItemImageProps>;
        Label: React.FC<MenuLabelProps>;
        Preview: React.FC<ContextMenuPreviewProps>;
        Arrow: React.FC<MenuArrowProps>;
        Sub: React.FC<MenuSubProps>;
        SubContent: React.FC<MenuSubContentProps>;
        Auxiliary: React.FC<ContextMenuAuxliliaryProps>;
    };
};
export { createAndroidMenu as createNativeMenu };
//# sourceMappingURL=createNativeMenu.android.d.ts.map