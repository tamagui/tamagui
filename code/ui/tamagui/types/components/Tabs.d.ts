import { type ComponentSize } from '@tamagui/core';
export type TabsSize = ComponentSize | boolean;
export declare const TabsFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeTabs" | "activationMode" | "defaultValue" | "dir" | "onValueChange" | "orientation" | "value"> & {
    __scopeTabs?: string;
} & {
    value?: string;
    defaultValue?: string | undefined;
    onValueChange?: ((value: string) => void) | undefined;
    orientation?: import("@tamagui/roving-focus").RovingFocusGroupProps['orientation'];
    dir?: import("@tamagui/roving-focus").RovingFocusGroupProps['dir'];
    activationMode?: 'automatic' | 'manual';
}, import("@tamagui/core").StackStyleBase, {
    size?: TabsSize | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const TabsList: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeGroup" | keyof import("@tamagui/group").GroupExtraProps> & import("@tamagui/group").GroupExtraProps & {
    __scopeGroup?: import("@tamagui/create-context").Scope;
}, "__scopeTabs" | "disabled" | "loop"> & {
    __scopeTabs?: string;
} & {
    loop?: boolean;
    disabled?: boolean;
}, import("@tamagui/core").StackStyleBase, Omit<Omit<{}, "__scopeGroup" | keyof import("@tamagui/group").GroupExtraProps>, "__scopeTabs" | "disabled" | "loop">, import("@tamagui/core").StaticConfigPublic>;
export declare const TabsTab: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeTabs" | "activeStyle" | "activeTheme" | "onInteraction" | "value"> & {
    __scopeTabs?: string;
} & {
    value: string;
    onInteraction?: (type: import("@tamagui/tabs").InteractionType, layout: import("@tamagui/tabs").TabLayout | null) => void;
    activeStyle?: import("@tamagui/core").StylePiece;
    activeTheme?: string | null;
}, import("@tamagui/core").StackStyleBase, {
    disabled?: boolean | undefined;
    size?: TabsSize | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const TabsContent: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeTabs" | "forceMount" | "value"> & {
    __scopeTabs?: string;
} & {
    value: string;
    forceMount?: boolean;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "__scopeTabs" | "forceMount" | "value">, import("@tamagui/core").StaticConfigPublic>;
export declare const Tabs: import("@tamagui/core").Combined<import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeTabs" | "activationMode" | "defaultValue" | "dir" | "onValueChange" | "orientation" | "value"> & {
    __scopeTabs?: string;
} & {
    value?: string;
    defaultValue?: string | undefined;
    onValueChange?: ((value: string) => void) | undefined;
    orientation?: import("@tamagui/roving-focus").RovingFocusGroupProps['orientation'];
    dir?: import("@tamagui/roving-focus").RovingFocusGroupProps['dir'];
    activationMode?: 'automatic' | 'manual';
}, import("@tamagui/core").StackStyleBase, {
    size?: TabsSize | undefined;
}, import("@tamagui/core").StaticConfigPublic>, {
    List: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeGroup" | keyof import("@tamagui/group").GroupExtraProps> & import("@tamagui/group").GroupExtraProps & {
        __scopeGroup?: import("@tamagui/create-context").Scope;
    }, "__scopeTabs" | "disabled" | "loop"> & {
        __scopeTabs?: string;
    } & {
        loop?: boolean;
        disabled?: boolean;
    }, import("@tamagui/core").StackStyleBase, Omit<Omit<{}, "__scopeGroup" | keyof import("@tamagui/group").GroupExtraProps>, "__scopeTabs" | "disabled" | "loop">, import("@tamagui/core").StaticConfigPublic>;
    Tab: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeTabs" | "activeStyle" | "activeTheme" | "onInteraction" | "value"> & {
        __scopeTabs?: string;
    } & {
        value: string;
        onInteraction?: (type: import("@tamagui/tabs").InteractionType, layout: import("@tamagui/tabs").TabLayout | null) => void;
        activeStyle?: import("@tamagui/core").StylePiece;
        activeTheme?: string | null;
    }, import("@tamagui/core").StackStyleBase, {
        disabled?: boolean | undefined;
        size?: TabsSize | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Content: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeTabs" | "forceMount" | "value"> & {
        __scopeTabs?: string;
    } & {
        value: string;
        forceMount?: boolean;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "__scopeTabs" | "forceMount" | "value">, import("@tamagui/core").StaticConfigPublic>;
}>;
//# sourceMappingURL=Tabs.d.ts.map