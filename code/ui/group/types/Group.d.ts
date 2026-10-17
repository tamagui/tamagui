import type { GetProps } from '@tamagui/core';
import type { Scope } from '@tamagui/create-context';
import React from 'react';
type ScopedProps<P> = P & {
    __scopeGroup?: Scope;
};
declare const createGroupScope: import("@tamagui/create-context").CreateScope;
export declare const GroupFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
export type GroupExtraProps = {
    orientation?: 'horizontal' | 'vertical';
    disabled?: boolean;
};
export type GroupProps = GetProps<typeof GroupFrame> & GroupExtraProps;
export type GroupItemProps = {
    children: React.ReactNode;
    /**
     * forces the item to be a starting, center or ending item and gets the respective styles
     */
    forcePlacement?: 'first' | 'center' | 'last';
};
declare function GroupItem(props: ScopedProps<GroupItemProps & Record<string, any>>): any;
export declare const useGroupItem: (childrenProps: {
    disabled?: boolean;
}, forcePlacement?: GroupItemProps['forcePlacement'], __scopeGroup?: Scope) => {
    disabled: boolean | undefined;
    borderTopLeftRadius?: number | undefined;
    borderTopRightRadius?: number | undefined;
    borderTopWidth?: number | undefined;
    borderBottomLeftRadius?: number | undefined;
    borderBottomRightRadius?: number | undefined;
} | {
    disabled: boolean | undefined;
    borderTopLeftRadius?: number | undefined;
    borderBottomLeftRadius?: number | undefined;
    borderLeftWidth?: number | undefined;
    borderTopRightRadius?: number | undefined;
    borderBottomRightRadius?: number | undefined;
};
export declare const Group: import("@tamagui/helpers").Combined<import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeGroup" | keyof GroupExtraProps> & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "__scopeGroup" | keyof GroupExtraProps>, import("@tamagui/core").StaticConfigPublic>, {
    Item: typeof GroupItem;
}>;
export declare const YGroup: import("@tamagui/helpers").Combined<import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeGroup" | keyof GroupExtraProps> & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "__scopeGroup" | keyof GroupExtraProps>, import("@tamagui/core").StaticConfigPublic>, {
    Item: typeof GroupItem;
}>;
export declare const XGroup: import("@tamagui/helpers").Combined<import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "__scopeGroup" | keyof GroupExtraProps> & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@tamagui/core").StackStyleBase, Omit<{}, "__scopeGroup" | keyof GroupExtraProps>, import("@tamagui/core").StaticConfigPublic>, {
    Item: typeof GroupItem;
}>;
export { createGroupScope };
//# sourceMappingURL=Group.d.ts.map