import { type ComponentSize, type GetProps } from '@tamagui/core';
export type RadioGroupSize = ComponentSize | boolean;
export declare const RadioGroupFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
}> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
}, import("@tamagui/core").StackStyleBase, Omit<{
    orientation?: "horizontal" | "vertical" | undefined;
}, keyof {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
}>, import("@tamagui/core").StaticConfigPublic>;
export declare const RadioGroupItem: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof {
    value: string;
    id?: string;
    labelledBy?: string;
    disabled?: boolean;
    activeStyle?: import("@tamagui/core").StylePiece;
    activeTheme?: string | null;
}> & {
    value: string;
    id?: string;
    labelledBy?: string;
    disabled?: boolean;
    activeStyle?: import("@tamagui/core").StylePiece;
    activeTheme?: string | null;
}, import("@tamagui/core").StackStyleBase, {
    disabled?: boolean | undefined;
    size?: RadioGroupSize | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const RadioGroupIndicator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "forceMount"> & {
    forceMount?: boolean;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "forceMount">, import("@tamagui/core").StaticConfigPublic>;
export declare const RadioGroup: import("@tamagui/core").Combined<import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
}> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
}, import("@tamagui/core").StackStyleBase, Omit<{
    orientation?: "horizontal" | "vertical" | undefined;
}, keyof {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
}>, import("@tamagui/core").StaticConfigPublic>, {
    Item: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof {
        value: string;
        id?: string;
        labelledBy?: string;
        disabled?: boolean;
        activeStyle?: import("@tamagui/core").StylePiece;
        activeTheme?: string | null;
    }> & {
        value: string;
        id?: string;
        labelledBy?: string;
        disabled?: boolean;
        activeStyle?: import("@tamagui/core").StylePiece;
        activeTheme?: string | null;
    }, import("@tamagui/core").StackStyleBase, {
        disabled?: boolean | undefined;
        size?: RadioGroupSize | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Indicator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "forceMount"> & {
        forceMount?: boolean;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "forceMount">, import("@tamagui/core").StaticConfigPublic>;
}>;
export type RadioGroupProps = GetProps<typeof RadioGroup>;
//# sourceMappingURL=RadioGroup.d.ts.map