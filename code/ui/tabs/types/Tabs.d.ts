import { type RovingFocusGroupProps } from '@tamagui/roving-focus';
import type { GetProps, StylePiece, TamaguiElement } from '@tamagui/web';
import * as React from 'react';
import type { LayoutRectangle } from '@tamagui/react-native-types';
export declare const TabsFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
export declare const TabsListFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeGroup" | keyof import("@tamagui/group").GroupExtraProps> & import("@tamagui/group").GroupExtraProps & {
    __scopeGroup?: import("@tamagui/create-context").Scope;
}, import("@tamagui/web").StackStyleBase, Omit<{}, "__scopeGroup" | keyof import("@tamagui/group").GroupExtraProps>, import("@tamagui/web").StaticConfigPublic>;
export declare const TabsTabFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    disabled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const TabsContentFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
type TabsScopeProps = {
    __scopeTabs?: string;
};
type TabsFrameProps = GetProps<typeof TabsFrame>;
type TabsExtraProps<Tab = string> = TabsScopeProps & {
    /** The value for the selected tab, if controlled */
    value?: string;
    /** The value of the tab to select by default, if uncontrolled */
    defaultValue?: Tab;
    /** A function called when a new tab is selected */
    onValueChange?: (value: Tab) => void;
    /**
     * The orientation the tabs are laid out.
     * Mainly so arrow navigation is done accordingly (left & right vs. up & down).
     * @defaultValue horizontal
     */
    orientation?: RovingFocusGroupProps['orientation'];
    /** The direction of navigation between tab triggers. */
    dir?: RovingFocusGroupProps['dir'];
    /**
     * Whether a tab is activated automatically or manually. Automatic activation is only
     * supported on web; native tabs always activate manually.
     * @defaultValue automatic
     */
    activationMode?: 'automatic' | 'manual';
};
export type TabsProps<Tab = string> = TabsFrameProps & TabsExtraProps<Tab>;
type TabsListExtraProps = TabsScopeProps & {
    /** Whether keyboard navigation loops after the first or last trigger. */
    loop?: boolean;
    /** Disables every trigger in the list. */
    disabled?: boolean;
};
export type TabsListProps = GetProps<typeof TabsListFrame> & TabsListExtraProps;
export type InteractionType = 'select' | 'focus' | 'hover';
export type TabLayout = LayoutRectangle;
export type TabsTriggerLayout = LayoutRectangle;
type TabsTabExtraProps = TabsScopeProps & {
    /** The value selected when this trigger is activated. */
    value: string;
    /** Reports the measured trigger rectangle for custom indicators. */
    onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
    /** Custom styles to apply while this trigger is selected. */
    activeStyle?: StylePiece;
    /** Theme to apply while this trigger is selected. */
    activeTheme?: string | null;
};
export type TabsTabProps = React.ComponentPropsWithoutRef<typeof TabsTabFrame> & TabsTabExtraProps;
type TabsContentExtraProps = TabsScopeProps & {
    /** The value that selects this content. */
    value: string;
    /** Mounts the content even when its value is not selected. */
    forceMount?: boolean;
};
export type TabsContentProps = GetProps<typeof TabsContentFrame> & TabsContentExtraProps;
export declare const TabsList: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeGroup" | keyof import("@tamagui/group").GroupExtraProps> & import("@tamagui/group").GroupExtraProps & {
    __scopeGroup?: import("@tamagui/create-context").Scope;
}, "__scopeTabs" | "disabled" | "loop"> & TabsScopeProps & {
    /** Whether keyboard navigation loops after the first or last trigger. */
    loop?: boolean;
    /** Disables every trigger in the list. */
    disabled?: boolean;
}, import("@tamagui/web").StackStyleBase, Omit<Omit<{}, "__scopeGroup" | keyof import("@tamagui/group").GroupExtraProps>, "__scopeTabs" | "disabled" | "loop">, import("@tamagui/web").StaticConfigPublic>;
export declare const TabsTab: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeTabs" | "activeStyle" | "activeTheme" | "onInteraction" | "value"> & TabsScopeProps & {
    /** The value selected when this trigger is activated. */
    value: string;
    /** Reports the measured trigger rectangle for custom indicators. */
    onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
    /** Custom styles to apply while this trigger is selected. */
    activeStyle?: StylePiece;
    /** Theme to apply while this trigger is selected. */
    activeTheme?: string | null;
}, import("@tamagui/web").StackStyleBase, Omit<{
    disabled?: boolean | undefined;
}, "__scopeTabs" | "activeStyle" | "activeTheme" | "onInteraction" | "value">, import("@tamagui/web").StaticConfigPublic>;
export declare const TabsContent: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeTabs" | "forceMount" | "value"> & TabsScopeProps & {
    /** The value that selects this content. */
    value: string;
    /** Mounts the content even when its value is not selected. */
    forceMount?: boolean;
}, import("@tamagui/web").StackStyleBase, Omit<{}, "__scopeTabs" | "forceMount" | "value">, import("@tamagui/web").StaticConfigPublic>;
export declare const Tabs: import("@tamagui/helpers").Combined<import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeTabs" | "activationMode" | "defaultValue" | "dir" | "onValueChange" | "orientation" | "value"> & TabsScopeProps & {
    /** The value for the selected tab, if controlled */
    value?: string;
    /** The value of the tab to select by default, if uncontrolled */
    defaultValue?: string | undefined;
    /** A function called when a new tab is selected */
    onValueChange?: ((value: string) => void) | undefined;
    /**
     * The orientation the tabs are laid out.
     * Mainly so arrow navigation is done accordingly (left & right vs. up & down).
     * @defaultValue horizontal
     */
    orientation?: RovingFocusGroupProps['orientation'];
    /** The direction of navigation between tab triggers. */
    dir?: RovingFocusGroupProps['dir'];
    /**
     * Whether a tab is activated automatically or manually. Automatic activation is only
     * supported on web; native tabs always activate manually.
     * @defaultValue automatic
     */
    activationMode?: 'automatic' | 'manual';
}, import("@tamagui/web").StackStyleBase, Omit<{}, "__scopeTabs" | "activationMode" | "defaultValue" | "dir" | "onValueChange" | "orientation" | "value">, import("@tamagui/web").StaticConfigPublic>, {
    Frame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
    List: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeGroup" | keyof import("@tamagui/group").GroupExtraProps> & import("@tamagui/group").GroupExtraProps & {
        __scopeGroup?: import("@tamagui/create-context").Scope;
    }, "__scopeTabs" | "disabled" | "loop"> & TabsScopeProps & {
        /** Whether keyboard navigation loops after the first or last trigger. */
        loop?: boolean;
        /** Disables every trigger in the list. */
        disabled?: boolean;
    }, import("@tamagui/web").StackStyleBase, Omit<Omit<{}, "__scopeGroup" | keyof import("@tamagui/group").GroupExtraProps>, "__scopeTabs" | "disabled" | "loop">, import("@tamagui/web").StaticConfigPublic>;
    Tab: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeTabs" | "activeStyle" | "activeTheme" | "onInteraction" | "value"> & TabsScopeProps & {
        /** The value selected when this trigger is activated. */
        value: string;
        /** Reports the measured trigger rectangle for custom indicators. */
        onInteraction?: (type: InteractionType, layout: TabLayout | null) => void;
        /** Custom styles to apply while this trigger is selected. */
        activeStyle?: StylePiece;
        /** Theme to apply while this trigger is selected. */
        activeTheme?: string | null;
    }, import("@tamagui/web").StackStyleBase, Omit<{
        disabled?: boolean | undefined;
    }, "__scopeTabs" | "activeStyle" | "activeTheme" | "onInteraction" | "value">, import("@tamagui/web").StaticConfigPublic>;
    Content: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeTabs" | "forceMount" | "value"> & TabsScopeProps & {
        /** The value that selects this content. */
        value: string;
        /** Mounts the content even when its value is not selected. */
        forceMount?: boolean;
    }, import("@tamagui/web").StackStyleBase, Omit<{}, "__scopeTabs" | "forceMount" | "value">, import("@tamagui/web").StaticConfigPublic>;
}>;
export {};
//# sourceMappingURL=Tabs.d.ts.map