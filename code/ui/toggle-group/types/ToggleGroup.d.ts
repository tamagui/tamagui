import type { GroupProps } from '@tamagui/group';
import { RovingFocusGroup } from '@tamagui/roving-focus';
import type { GetProps, SizeTokens, TamaguiElement } from '@tamagui/web';
import React from 'react';
import { ToggleFrame } from './Toggle';
type ToggleGroupItemProps = GetProps<typeof ToggleFrame> & {
    value: string;
    id?: string;
    disabled?: boolean;
    size?: SizeTokens;
    /**
     * Used to disable passing styles down to children.
     */
    disablePassStyles?: boolean;
};
type ScopedProps<P> = P & {
    __scopeToggleGroup?: string;
};
interface ToggleGroupSingleProps extends ToggleGroupImplSingleProps {
    type: 'single';
}
interface ToggleGroupMultipleProps extends ToggleGroupImplMultipleProps {
    type: 'multiple';
}
type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;
declare const ToggleGroup: React.ForwardRefExoticComponent<ScopedProps<ToggleGroupProps> & React.RefAttributes<TamaguiElement>> & {
    Item: import("@tamagui/web").TamaguiComponent<ScopedProps<ToggleGroupItemProps>, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & TamaguiElement, import("@tamagui/web").StackStyleBase, {
        color?: import("@tamagui/web").ColorTokens | undefined;
        elevation?: number | SizeTokens | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        padded?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
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
declare const ToggleGroupImplElementFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/spacer").SpaceProps & {
    orientation?: "horizontal" | "vertical";
    scrollable?: boolean;
    showScrollIndicator?: boolean;
    disabled?: boolean;
    disablePassBorderRadius?: boolean | "bottom" | "end" | "start" | "top";
    forceUseItem?: boolean;
} & {
    __scopeGroup?: import("@tamagui/create-context").Scope;
}, import("@tamagui/web").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
    unstyled?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
type ToggleGroupImplProps = GetProps<typeof ToggleGroupImplElementFrame> & GroupProps & {
    rovingFocus?: boolean;
    dir?: RovingFocusGroupProps['dir'];
    loop?: RovingFocusGroupProps['loop'];
    sizeAdjust?: number;
};
export { ToggleGroup };
export type { ToggleGroupItemProps, ToggleGroupMultipleProps, ToggleGroupProps, ToggleGroupSingleProps, };
//# sourceMappingURL=ToggleGroup.d.ts.map