import { type ComponentSize, type GetProps, type TamaguiElement } from '@tamagui/core';
export type ToggleGroupSize = ComponentSize | boolean;
export declare const ToggleGroupItem: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").StackNonStyleProps, "__scopeToggleGroup" | keyof {
    activeStyle?: import("@tamagui/toggle-group/types/Toggle").ToggleProps['activeStyle'];
    activeTheme?: import("@tamagui/toggle-group/types/Toggle").ToggleProps['activeTheme'];
    value: string;
    id?: string;
    disabled?: boolean;
}> & {
    activeStyle?: import("@tamagui/toggle-group/types/Toggle").ToggleProps['activeStyle'];
    activeTheme?: import("@tamagui/toggle-group/types/Toggle").ToggleProps['activeTheme'];
    value: string;
    id?: string;
    disabled?: boolean;
} & {
    __scopeToggleGroup?: string;
}, import("@tamagui/core").StackStyleBase, {
    active?: boolean | undefined;
    defaultActiveStyle?: boolean | undefined;
    size?: "lg" | "md" | "sm" | "xl" | "xs" | boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const ToggleGroup: import("@tamagui/core").Combined<import("@tamagui/core").RefComponent<TamaguiElement, (import("@tamagui/toggle-group").ToggleGroupProps & {
    __scopeToggleGroup?: string;
}) & import("@tamagui/core").RefProp<TamaguiElement>>, {
    Item: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, Omit<import("@tamagui/core").StackNonStyleProps, "__scopeToggleGroup" | keyof {
        activeStyle?: import("@tamagui/toggle-group/types/Toggle").ToggleProps['activeStyle'];
        activeTheme?: import("@tamagui/toggle-group/types/Toggle").ToggleProps['activeTheme'];
        value: string;
        id?: string;
        disabled?: boolean;
    }> & {
        activeStyle?: import("@tamagui/toggle-group/types/Toggle").ToggleProps['activeStyle'];
        activeTheme?: import("@tamagui/toggle-group/types/Toggle").ToggleProps['activeTheme'];
        value: string;
        id?: string;
        disabled?: boolean;
    } & {
        __scopeToggleGroup?: string;
    }, import("@tamagui/core").StackStyleBase, {
        active?: boolean | undefined;
        defaultActiveStyle?: boolean | undefined;
        size?: "lg" | "md" | "sm" | "xl" | "xs" | boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
}>;
export type ToggleGroupItemProps = GetProps<typeof ToggleGroupItem>;
//# sourceMappingURL=ToggleGroup.d.ts.map