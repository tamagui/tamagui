import type { TamaguiComponent, TextProps } from '@tamagui/core';
import { Dismissable as DismissableLayer } from '@tamagui/dismissable';
import { FocusScope } from '@tamagui/focus-scope';
import * as PopperPrimitive from '@tamagui/popper';
import type { PopperContentProps } from '@tamagui/popper';
import { type PortalProps } from '@tamagui/portal';
import type { RovingFocusGroupProps } from '@tamagui/roving-focus';
import { type ThemeableStackProps } from '@tamagui/stacks';
import { type Stack } from '@tamagui/web';
import type { TamaguiElement } from '@tamagui/web/types';
import * as React from 'react';
import type { Image, ImageProps } from 'react-native';
type Direction = 'ltr' | 'rtl';
type ScopedProps<P> = P & {
    __scopeMenu?: string;
};
interface MenuProps extends PopperPrimitive.PopperProps {
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
     * Specify a container element to portal the content into.
     */
    host?: PortalProps['host'];
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
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Stack>;
interface MenuGroupProps extends PrimitiveDivProps {
}
interface MenuLabelProps extends PrimitiveDivProps {
}
interface MenuItemProps extends Omit<MenuItemImplProps, 'onSelect'> {
    onSelect?: (event: Event) => void;
    unstyled?: boolean;
}
interface MenuItemImplProps extends PrimitiveDivProps {
    disabled?: boolean;
    textValue?: string;
    unstyled?: boolean;
}
interface MenuItemTitleProps extends TextProps {
}
interface MenuItemSubTitleProps extends TextProps {
}
type MenuItemIconProps = ThemeableStackProps;
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
interface MenuSeparatorProps extends PrimitiveDivProps {
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
export declare const NativePropProvider: React.ProviderExoticComponent<Partial<{
    native: boolean;
}> & {
    children?: React.ReactNode;
    scope?: string;
}>, useNativeProp: (scope?: string) => {
    native: boolean;
};
export declare function createMenu({ Item: _Item, Title: _Title, SubTitle: _SubTitle, Image: _Image, Icon: _Icon, Indicator: _Indicator, Separator: _Separator, MenuGroup: _MenuGroup, Label: _Label, }: {
    Item?: TamaguiComponent;
    MenuGroup?: TamaguiComponent;
    Title?: TamaguiComponent;
    SubTitle?: TamaguiComponent;
    Image?: React.ElementType;
    Icon?: TamaguiComponent;
    Indicator?: TamaguiComponent;
    Separator?: TamaguiComponent;
    Label?: TamaguiComponent;
}): {
    Menu: {
        (props: ScopedProps<MenuProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    } & {
        Anchor: {
            (props: MenuAnchorProps): import("react/jsx-runtime").JSX.Element;
            displayName: string;
        };
        Portal: {
            (props: ScopedProps<MenuPortalProps>): import("react/jsx-runtime").JSX.Element;
            displayName: string;
        };
        Content: React.ForwardRefExoticComponent<MenuContentProps & {
            __scopeMenu?: string;
        } & React.RefAttributes<HTMLElement | import("react-native").View>>;
        Group: TamaguiComponent;
        Label: TamaguiComponent;
        Item: TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            transparent?: boolean | undefined;
            fullscreen?: boolean | undefined;
            circular?: boolean | undefined;
            inset?: number | import("@tamagui/core").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            backgrounded?: boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }>, "__scopeMenu" | keyof MenuItemProps> & MenuItemProps & {
            __scopeMenu?: string;
        }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & MenuItemProps & {
            __scopeMenu?: string;
        }, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            transparent?: boolean | undefined;
            fullscreen?: boolean | undefined;
            circular?: boolean | undefined;
            inset?: number | import("@tamagui/core").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            backgrounded?: boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }, import("@tamagui/core").StaticConfigPublic>;
        CheckboxItem: TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            transparent?: boolean | undefined;
            fullscreen?: boolean | undefined;
            circular?: boolean | undefined;
            inset?: number | import("@tamagui/core").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            backgrounded?: boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }>, "__scopeMenu" | keyof MenuCheckboxItemProps> & MenuCheckboxItemProps & {
            __scopeMenu?: string;
        }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & MenuCheckboxItemProps & {
            __scopeMenu?: string;
        }, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            transparent?: boolean | undefined;
            fullscreen?: boolean | undefined;
            circular?: boolean | undefined;
            inset?: number | import("@tamagui/core").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            backgrounded?: boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }, import("@tamagui/core").StaticConfigPublic>;
        RadioGroup: TamaguiComponent<Omit<any, "__scopeMenu" | keyof MenuRadioGroupProps> & MenuRadioGroupProps & {
            __scopeMenu?: string;
        }, any, MenuRadioGroupProps & {
            __scopeMenu?: string;
        }, {}, {}, {}>;
        RadioItem: TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            transparent?: boolean | undefined;
            fullscreen?: boolean | undefined;
            circular?: boolean | undefined;
            inset?: number | import("@tamagui/core").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            backgrounded?: boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }>, "__scopeMenu" | keyof MenuRadioItemProps> & MenuRadioItemProps & {
            __scopeMenu?: string;
        }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & MenuRadioItemProps & {
            __scopeMenu?: string;
        }, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            transparent?: boolean | undefined;
            fullscreen?: boolean | undefined;
            circular?: boolean | undefined;
            inset?: number | import("@tamagui/core").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | undefined;
            hoverTheme?: boolean | undefined;
            pressTheme?: boolean | undefined;
            focusTheme?: boolean | undefined;
            elevate?: boolean | undefined;
            bordered?: number | boolean | undefined;
            backgrounded?: boolean | undefined;
            radiused?: boolean | undefined;
            padded?: boolean | undefined;
            chromeless?: boolean | "all" | undefined;
        }, import("@tamagui/core").StaticConfigPublic>;
        ItemIndicator: TamaguiComponent<Omit<any, "__scopeMenu" | keyof MenuItemIndicatorProps> & MenuItemIndicatorProps & {
            __scopeMenu?: string;
        }, any, MenuItemIndicatorProps & {
            __scopeMenu?: string;
        }, {}, {}, {}>;
        Separator: TamaguiComponent;
        Arrow: TamaguiComponent<ScopedProps<MenuArrowProps>, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & (PopperPrimitive.PopperArrowExtraProps & TamaguiElement), import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            inset?: number | import("@tamagui/core").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | undefined;
            unstyled?: boolean | undefined;
        }, import("@tamagui/core").StaticConfigPublic>;
        Sub: React.FC<ScopedProps<MenuSubProps>>;
        SubTrigger: TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            inset?: number | import("@tamagui/core").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | undefined;
        }>, "__scopeMenu" | keyof MenuSubTriggerProps> & MenuSubTriggerProps & {
            __scopeMenu?: string;
        }, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & MenuSubTriggerProps & {
            __scopeMenu?: string;
        }, import("@tamagui/core").StackStyleBase, {
            elevation?: number | import("@tamagui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
            inset?: number | import("@tamagui/core").SizeTokens | {
                top?: number;
                bottom?: number;
                left?: number;
                right?: number;
            } | undefined;
        }, import("@tamagui/core").StaticConfigPublic>;
        SubContent: React.ForwardRefExoticComponent<MenuSubContentProps & {
            __scopeMenu?: string;
        } & React.RefAttributes<HTMLElement | import("react-native").View>>;
        ItemTitle: TamaguiComponent<any, any, {} & void, {}, {}, {}>;
        ItemSubtitle: TamaguiComponent<any, any, {} & void, {}, {}, {}>;
        ItemImage: React.ForwardRefExoticComponent<ImageProps & React.RefAttributes<Image>>;
        ItemIcon: TamaguiComponent<any, any, {} & void, {}, {}, {}>;
    };
};
export type { MenuProps, MenuAnchorProps, MenuPortalProps, MenuContentProps, MenuGroupProps, MenuLabelProps, MenuItemProps, MenuCheckboxItemProps, MenuRadioGroupProps, MenuRadioItemProps, MenuItemIndicatorProps, MenuSeparatorProps, MenuArrowProps, MenuSubTriggerProps, MenuItemTitleProps, MenuItemSubTitleProps, MenuItemIconProps, };
//# sourceMappingURL=createMenu.d.ts.map