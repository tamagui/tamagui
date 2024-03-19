import type { FC } from 'react';
import { ContextMenuPreviewProps, MenuArrowProps, MenuCheckboxItemProps, MenuContentProps, MenuGroupProps, MenuItemImageProps, MenuItemIndicatorProps, MenuItemProps, MenuItemSubtitleProps, MenuItemTitleProps, MenuLabelProps, MenuProps, MenuSeparatorProps, MenuSubContentProps, MenuSubProps, MenuSubTriggerProps, MenuTriggerProps } from './createNativeMenuTypes';
export declare const createNativeMenu: (MenuType: 'ContextMenu' | 'DropdownMenu') => {
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
};
//# sourceMappingURL=createNativeMenu.d.ts.map