import { RovingFocusGroup } from '@tamagui/roving-focus';
import type { GetProps, TamaguiElement } from '@tamagui/web';
import React from 'react';
import type { ToggleProps } from './Toggle';
import { ToggleFrame } from './Toggle';
type ToggleGroupItemExtraProps = {
    activeStyle?: ToggleProps['activeStyle'];
    activeTheme?: ToggleProps['activeTheme'];
    value: string;
    id?: string;
    disabled?: boolean;
};
type ToggleGroupItemProps = GetProps<typeof ToggleFrame> & ToggleGroupItemExtraProps;
type ScopedProps<P> = P & {
    __scopeToggleGroup?: string;
};
interface ToggleGroupSingleProps extends ToggleGroupImplSingleProps {
    type: 'single';
}
interface ToggleGroupMultipleProps extends ToggleGroupImplMultipleProps {
    type: 'multiple';
}
interface ToggleGroupGeneralProps extends ToggleGroupImplProps {
    type: 'single' | 'multiple';
    value?: string | string[];
    defaultValue?: string | string[];
    onValueChange?(value: any): void;
    disableDeactivation?: boolean;
}
type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps | ToggleGroupGeneralProps;
declare const ToggleGroup: import("@tamagui/helpers").Combined<import("@tamagui/compose-refs").RefComponent<TamaguiElement, ScopedProps<ToggleGroupProps>>, {
    Item: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, Omit<import("@tamagui/web").StackNonStyleProps, "__scopeToggleGroup" | keyof ToggleGroupItemExtraProps> & ToggleGroupItemExtraProps & {
        __scopeToggleGroup?: string;
    }, import("@tamagui/web").StackStyleBase, Omit<{
        active?: boolean | undefined;
        defaultActiveStyle?: boolean | undefined;
    }, "__scopeToggleGroup" | keyof ToggleGroupItemExtraProps>, import("@tamagui/web").StaticConfigPublic>;
}>;
interface ToggleGroupImplSingleProps extends ToggleGroupImplProps {
    /** The controlled stateful value of the item that is pressed. */
    value?: string;
    /** The value of the item that is pressed when initially rendered. */
    defaultValue?: string;
    /** The callback that fires when the value of the toggle group changes. */
    onValueChange?(value: string): void;
    /** Won't let the user turn the active item off. */
    disableDeactivation?: boolean;
}
interface ToggleGroupImplMultipleProps extends ToggleGroupImplProps {
    /** The controlled stateful value of the items that are pressed. */
    value?: string[];
    /** The value of the items that are pressed when initially rendered. */
    defaultValue?: string[];
    /** The callback that fires when the state of the toggle group changes. */
    onValueChange?(value: string[]): void;
    disableDeactivation?: boolean;
}
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup>;
declare const ToggleGroupFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {}, import("@tamagui/web").StaticConfigPublic>;
type ToggleGroupImplExtraProps = {
    orientation?: 'horizontal' | 'vertical';
    rovingFocus?: boolean;
    dir?: RovingFocusGroupProps['dir'];
    loop?: RovingFocusGroupProps['loop'];
    color?: string;
};
type ToggleGroupImplProps = GetProps<typeof ToggleGroupFrame> & ToggleGroupImplExtraProps;
export { ToggleGroup };
export type { ToggleGroupItemProps, ToggleGroupMultipleProps, ToggleGroupProps, ToggleGroupSingleProps, };
//# sourceMappingURL=ToggleGroup.d.ts.map