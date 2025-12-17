import { Dismissable as DismissableLayer } from '@tamagui/dismissable';
import { FocusScope } from '@tamagui/focus-scope';
import type { PopperContentProps } from '@tamagui/popper';
import * as PopperPrimitive from '@tamagui/popper';
import type { RovingFocusGroupProps } from '@tamagui/roving-focus';
import type { TamaguiComponent, TextProps } from '@tamagui/web';
import { type Stack, type ViewProps } from '@tamagui/web';
import type { TamaguiElement } from '@tamagui/web/types';
import * as React from 'react';
import type { Image, ImageProps } from 'react-native';
type Direction = 'ltr' | 'rtl';
type ScopedProps<P> = P & {
    scope?: string;
};
interface MenuBaseProps extends PopperPrimitive.PopperProps {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?(open: boolean): void;
    dir?: Direction;
    modal?: boolean;
    native?: boolean;
}
type PopperAnchorProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperAnchor>;
interface MenuAnchorProps extends PopperAnchorProps {
}
interface MenuPortalProps {
    children?: React.ReactNode;
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
    zIndex?: number;
}
/**
 * We purposefully don't union MenuRootContent and MenuSubContent props here because
 * they have conflicting prop types. We agreed that we would allow MenuSubContent to
 * accept props that it would just ignore.
 */
interface MenuContentProps extends MenuRootContentTypeProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
interface MenuRootContentTypeProps extends Omit<MenuContentImplProps, keyof MenuContentImplPrivateProps> {
}
type MenuContentImplElement = React.ElementRef<typeof PopperPrimitive.PopperContent>;
type FocusScopeProps = React.ComponentPropsWithoutRef<typeof FocusScope>;
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>;
type MenuContentImplPrivateProps = {
    onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'];
    onDismiss?: DismissableLayerProps['onDismiss'];
    disableOutsidePointerEvents?: DismissableLayerProps['disableOutsidePointerEvents'];
    /**
     * Whether scrolling outside the `MenuContent` should be prevented
     * (default: `false`)
     */
    disableOutsideScroll?: boolean;
    /**
     * Whether focus should be trapped within the `MenuContent`
     * (default: false)
     */
    trapFocus?: FocusScopeProps['trapped'];
};
interface MenuContentImplProps extends MenuContentImplPrivateProps, Omit<PopperContentProps, 'dir' | 'onPlaced'> {
    /**
     * Event handler called when auto-focusing on close.
     * Can be prevented.
     */
    onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'];
    /**
     * Whether keyboard navigation should loop around
     * @defaultValue false
     */
    loop?: RovingFocusGroupProps['loop'];
    onEntryFocus?: RovingFocusGroupProps['onEntryFocus'];
    onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown'];
    onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside'];
    onFocusOutside?: DismissableLayerProps['onFocusOutside'];
    onInteractOutside?: DismissableLayerProps['onInteractOutside'];
}
interface MenuGroupProps extends ViewProps {
}
interface MenuLabelProps extends ViewProps {
}
interface MenuItemProps extends Omit<MenuItemImplProps, 'onSelect'> {
    onSelect?: (event: Event) => void;
    unstyled?: boolean;
}
interface MenuItemImplProps extends ViewProps {
    disabled?: boolean;
    textValue?: string;
    unstyled?: boolean;
}
interface MenuItemTitleProps extends TextProps {
}
interface MenuItemSubTitleProps extends TextProps {
}
type MenuItemIconProps = ViewProps;
type CheckedState = boolean | 'indeterminate';
interface MenuCheckboxItemProps extends MenuItemProps {
    checked?: CheckedState;
    onCheckedChange?: (checked: boolean) => void;
}
interface MenuRadioGroupProps extends MenuGroupProps {
    value?: string;
    onValueChange?: (value: string) => void;
}
interface MenuRadioItemProps extends MenuItemProps {
    value: string;
}
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Stack>;
interface MenuItemIndicatorProps extends PrimitiveSpanProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
interface MenuSeparatorProps extends ViewProps {
}
type PopperArrowProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperArrow>;
interface MenuArrowProps extends PopperArrowProps {
    unstyled?: boolean;
}
export interface MenuSubProps extends PopperPrimitive.PopperProps {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?(open: boolean): void;
}
interface MenuSubTriggerProps extends MenuItemImplProps {
}
export type MenuSubContentElement = MenuContentImplElement;
export interface MenuSubContentProps extends Omit<MenuContentImplProps, keyof MenuContentImplPrivateProps | 'onCloseAutoFocus' | 'onEntryFocus' | 'side' | 'align'> {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
export type CreateBaseMenuProps = {
    Item?: TamaguiComponent;
    MenuGroup?: TamaguiComponent;
    Title?: TamaguiComponent;
    SubTitle?: TamaguiComponent;
    Image?: React.ElementType;
    Icon?: TamaguiComponent;
    Indicator?: TamaguiComponent;
    Separator?: TamaguiComponent;
    Label?: TamaguiComponent;
};
export declare function createBaseMenu({ Item: _Item, Title: _Title, SubTitle: _SubTitle, Image: _Image, Icon: _Icon, Indicator: _Indicator, Separator: _Separator, MenuGroup: _MenuGroup, Label: _Label, }: CreateBaseMenuProps): {
    Menu: {
        (props: ScopedProps<MenuBaseProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    } & {
        Anchor: {
            (props: MenuAnchorProps): import("react/jsx-runtime").JSX.Element;
            displayName: string;
        };
        Portal: {
            (props: ScopedProps<MenuPortalProps>): import("react/jsx-runtime").JSX.Element | null;
            displayName: string;
        };
        Content: React.ForwardRefExoticComponent<MenuContentProps & {
            scope?: string;
        } & React.RefAttributes<HTMLElement | import("react-native").View>>;
        Group: TamaguiComponent;
        Label: TamaguiComponent;
        Item: React.ForwardRefExoticComponent<MenuItemProps & {
            scope?: string;
        } & React.RefAttributes<TamaguiElement>>;
        CheckboxItem: React.ForwardRefExoticComponent<MenuCheckboxItemProps & {
            scope?: string;
        } & React.RefAttributes<TamaguiElement>>;
        RadioGroup: TamaguiComponent<Omit<any, "scope" | keyof MenuRadioGroupProps> & MenuRadioGroupProps & {
            scope?: string;
        }, any, MenuRadioGroupProps & {
            scope?: string;
        }, {}, {}, {}>;
        RadioItem: React.ForwardRefExoticComponent<MenuRadioItemProps & {
            scope?: string;
        } & React.RefAttributes<TamaguiElement>>;
        ItemIndicator: TamaguiComponent<Omit<any, "scope" | keyof MenuItemIndicatorProps> & MenuItemIndicatorProps & {
            scope?: string;
        }, any, MenuItemIndicatorProps & {
            scope?: string;
        }, {}, {}, {}>;
        Separator: TamaguiComponent;
        Arrow: React.ForwardRefExoticComponent<MenuArrowProps & React.RefAttributes<TamaguiElement>>;
        Sub: React.FC<ScopedProps<MenuSubProps>>;
        SubTrigger: React.ForwardRefExoticComponent<MenuSubTriggerProps & {
            scope?: string;
        } & React.RefAttributes<TamaguiElement>>;
        SubContent: React.ForwardRefExoticComponent<MenuSubContentProps & {
            scope?: string;
        } & React.RefAttributes<HTMLElement | import("react-native").View>>;
        ItemTitle: TamaguiComponent<any, any, {} & void, {}, {}, {}>;
        ItemSubtitle: TamaguiComponent<any, any, {} & void, {}, {}, {}>;
        ItemImage: React.ForwardRefExoticComponent<ImageProps & React.RefAttributes<Image>>;
        ItemIcon: TamaguiComponent;
    };
};
export type { MenuAnchorProps, MenuArrowProps, MenuCheckboxItemProps, MenuContentProps, MenuGroupProps, MenuItemIconProps, MenuItemIndicatorProps, MenuItemProps, MenuItemSubTitleProps, MenuItemTitleProps, MenuLabelProps, MenuPortalProps, MenuBaseProps as MenuProps, MenuRadioGroupProps, MenuRadioItemProps, MenuSeparatorProps, MenuSubTriggerProps, };
//# sourceMappingURL=createBaseMenu.d.ts.map