import type { GroupProps } from '@tamagui/group';
import { RovingFocusGroup } from '@tamagui/roving-focus';
import type { GetProps, SizeTokens } from '@tamagui/web';
import React from 'react';
import { ToggleFrame } from './Toggle';
type ToggleGroupItemExtraProps = {
    value: string;
    id?: string;
    disabled?: boolean;
    size?: SizeTokens;
    /**
     * Used to disable passing styles down to children.
     */
    disablePassStyles?: boolean;
};
type ToggleGroupItemProps = GetProps<typeof ToggleFrame> & ToggleGroupItemExtraProps;
interface ToggleGroupSingleProps extends ToggleGroupImplSingleProps {
    type: 'single';
}
interface ToggleGroupMultipleProps extends ToggleGroupImplMultipleProps {
    type: 'multiple';
}
type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;
declare const ToggleGroup: React.ForwardRefExoticComponent<(Omit<ToggleGroupSingleProps & {
    __scopeToggleGroup?: string;
}, "ref"> | Omit<ToggleGroupMultipleProps & {
    __scopeToggleGroup?: string;
}, "ref">) & React.RefAttributes<HTMLElement>> & {
    Item: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof ToggleGroupItemExtraProps | "__scopeToggleGroup"> & ToggleGroupItemExtraProps & {
        __scopeToggleGroup?: string;
    }, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & ToggleGroupItemExtraProps & {
        __scopeToggleGroup?: string;
    }, import("@tamagui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
};
interface ToggleGroupImplSingleProps extends ToggleGroupImplProps {
    /**
     * The controlled stateful value of the item that is pressed.
     */
    value?: string;
    /**
     * The value of the item that is pressed when initially rendered. Use
     * `defaultValue` if you do not need to control the state of a toggle group.
     */
    defaultValue?: string;
    /**
     * The callback that fires when the value of the toggle group changes.
     */
    onValueChange?(value: string): void;
    /**
     * Won't let the user turn the active item off.
     */
    disableDeactivation?: boolean;
}
interface ToggleGroupImplMultipleProps extends ToggleGroupImplProps {
    /**
     * The controlled stateful value of the items that are pressed.
     */
    value?: string[];
    /**
     * The value of the items that are pressed when initially rendered. Use
     * `defaultValue` if you do not need to control the state of a toggle group.
     */
    defaultValue?: string[];
    /**
     * The callback that fires when the state of the toggle group changes.
     */
    onValueChange?(value: string[]): void;
    disableDeactivation?: never;
}
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup>;
declare const ToggleGroupImplElementFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, any, import("@tamagui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    size?: any;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
type ToggleGroupImplExtraProps = GroupProps & {
    rovingFocus?: boolean;
    dir?: RovingFocusGroupProps['dir'];
    loop?: RovingFocusGroupProps['loop'];
    sizeAdjust?: number;
};
type ToggleGroupImplProps = GetProps<typeof ToggleGroupImplElementFrame> & ToggleGroupImplExtraProps;
export { ToggleGroup };
export type { ToggleGroupItemProps, ToggleGroupMultipleProps, ToggleGroupProps, ToggleGroupSingleProps, };
//# sourceMappingURL=ToggleGroup.d.ts.map