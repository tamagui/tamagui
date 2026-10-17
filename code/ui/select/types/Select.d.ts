import type { GetProps } from '@tamagui/core';
import * as React from 'react';
import { SelectContent } from './SelectContent';
import type { SelectProps, SelectScopedProps, SelectValueForMode } from './types';
export type SelectValue<Value extends string = string, Multiple extends boolean | undefined = false> = SelectValueForMode<Value, Multiple>;
export declare const SelectValueFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {}, import("@tamagui/core").StaticConfigPublic>;
export type SelectValueExtraProps = SelectScopedProps<{
    placeholder?: React.ReactNode;
}>;
export type SelectValueProps = GetProps<typeof SelectValueFrame> & SelectValueExtraProps;
export declare const SelectValue: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "placeholder" | "scope"> & {
    placeholder?: React.ReactNode;
} & {
    scope?: import("./types").SelectScopes;
}, import("@tamagui/core").TextStylePropsBase, Omit<{}, "placeholder" | "scope">, import("@tamagui/core").StaticConfigPublic>;
export declare const SelectIcon: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export declare const SelectItemIndicatorFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export type SelectItemIndicatorProps = SelectScopedProps<GetProps<typeof SelectItemIndicatorFrame>>;
export declare const SelectItemIndicator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & {
    scope?: string;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, import("@tamagui/core").StaticConfigPublic>;
export declare const SelectIndicatorFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export type SelectIndicatorProps = GetProps<typeof SelectIndicatorFrame>;
export declare const SelectIndicator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & {
    scope?: import("./types").SelectScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, import("@tamagui/core").StaticConfigPublic>;
export declare const SelectGroupFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export declare const SelectGroup: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & {
    scope?: import("./types").SelectScopes;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, import("@tamagui/core").StaticConfigPublic>;
export declare const SelectLabelFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {}, import("@tamagui/core").StaticConfigPublic>;
export type SelectLabelProps = SelectScopedProps<GetProps<typeof SelectLabelFrame>>;
export declare const SelectLabel: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "scope"> & {
    scope?: import("./types").SelectScopes;
}, import("@tamagui/core").TextStylePropsBase, Omit<{}, "scope">, import("@tamagui/core").StaticConfigPublic>;
export declare const SelectSeparator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export declare function SelectRoot<Value extends string = string, Multiple extends boolean | undefined = false>(props: SelectScopedProps<SelectProps<Value, Multiple>>): React.JSX.Element;
export declare const Select: import("@tamagui/helpers").Combined<typeof SelectRoot, {
    Root: typeof SelectRoot;
    Adapt: import("@tamagui/helpers").Combined<(props: import("@tamagui/adapt").AdaptProps) => React.JSX.Element, {
        Contents: typeof import("@tamagui/adapt").AdaptContents;
    }>;
    Content: typeof SelectContent;
    Group: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, import("@tamagui/core").StaticConfigPublic>;
    Icon: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Item: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope" | keyof import("./SelectItem").SelectItemExtraProps> & import("./SelectItem").SelectItemExtraProps & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope" | keyof import("./SelectItem").SelectItemExtraProps>, import("@tamagui/core").StaticConfigPublic>;
    ItemIndicator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & {
        scope?: string;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, import("@tamagui/core").StaticConfigPublic>;
    ItemText: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "scope"> & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").TextStylePropsBase, Omit<{}, "scope">, import("@tamagui/core").StaticConfigPublic>;
    Label: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "scope"> & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").TextStylePropsBase, Omit<{}, "scope">, import("@tamagui/core").StaticConfigPublic>;
    ScrollDownButton: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, import("@tamagui/core").StaticConfigPublic>;
    ScrollUpButton: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, import("@tamagui/core").StaticConfigPublic>;
    Separator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    Trigger: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, import("@tamagui/core").StaticConfigPublic>;
    Value: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, Omit<import("@tamagui/core").RNTamaguiTextNonStyleProps, "placeholder" | "scope"> & {
        placeholder?: React.ReactNode;
    } & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").TextStylePropsBase, Omit<{}, "placeholder" | "scope">, import("@tamagui/core").StaticConfigPublic>;
    Viewport: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "disableScroll" | "scope" | "size"> & {
        size?: string | boolean;
        disableScroll?: boolean;
    } & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "disableScroll" | "scope" | "size">, import("@tamagui/core").StaticConfigPublic>;
    Indicator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "scope"> & {
        scope?: import("./types").SelectScopes;
    }, import("@tamagui/core").StackStyleBase, Omit<{}, "scope">, import("@tamagui/core").StaticConfigPublic>;
    FocusScope: (props: import("@tamagui/focus-scope/types/types").ScopedProps<import("@tamagui/focus-scope").FocusScopeControllerProps>) => React.JSX.Element;
}>;
//# sourceMappingURL=Select.d.ts.map