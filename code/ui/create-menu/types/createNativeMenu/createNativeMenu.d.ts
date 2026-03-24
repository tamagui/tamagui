/**
 * createNativeMenu - native menu implementation for React Native
 *
 * Web: returns empty stub components (withNativeMenu uses the web components instead)
 * Native: lazily resolves Zeego at render time so importing the package doesn't warn/error
 */
import type { FC } from 'react';
import React from 'react';
import type { ContextMenuPreviewProps, NativeContextMenuAuxiliaryProps, NativeMenuArrowProps, NativeMenuCheckboxItemProps, NativeMenuContentProps, NativeMenuGroupProps, NativeMenuItemIconProps, NativeMenuItemImageProps, NativeMenuItemIndicatorProps, NativeMenuItemProps, NativeMenuItemSubtitleProps, NativeMenuItemTitleProps, NativeMenuLabelProps, NativeMenuProps, NativeMenuSeparatorProps, NativeMenuSubContentProps, NativeMenuSubProps, NativeMenuSubTriggerProps, MenuTriggerProps } from './createNativeMenuTypes';
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
        Auxiliary: FC<NativeContextMenuAuxiliaryProps>;
    };
};
export declare const createNativeMenu: (MenuType: "ContextMenu" | "Menu") => NativeMenuComponents;
//# sourceMappingURL=createNativeMenu.d.ts.map