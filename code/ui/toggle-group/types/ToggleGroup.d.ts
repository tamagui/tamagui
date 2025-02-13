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
declare const ToggleGroup: React.ForwardRefExoticComponent<ScopedProps<ToggleGroupProps> & React.RefAttributes<HTMLElement>> & {
<<<<<<< HEAD
    Item: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
=======
    Item: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "color" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "transparent" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless" | "unstyled" | "active" | "orientation"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        color?: import("@tamagui/web").ColorTokens | undefined;
>>>>>>> master
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
<<<<<<< HEAD
    }>, keyof ToggleGroupItemExtraProps | "__scopeToggleGroup"> & ToggleGroupItemExtraProps & {
        __scopeToggleGroup?: string;
    }, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & ToggleGroupItemExtraProps & {
        __scopeToggleGroup?: string;
    }, import("@tamagui/web").StackStyleBase, {
=======
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
        color?: import("@tamagui/web").ColorTokens | undefined;
>>>>>>> master
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
<<<<<<< HEAD
    }, import("@tamagui/web").StaticConfigPublic>;
=======
    } & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
        color?: import("@tamagui/web").ColorTokens | undefined;
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        transparent?: boolean | undefined;
        fullscreen?: boolean | undefined;
        circular?: boolean | undefined;
        hoverTheme?: boolean | undefined;
        pressTheme?: boolean | undefined;
        focusTheme?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: number | boolean | undefined;
        backgrounded?: boolean | undefined;
        radiused?: boolean | undefined;
        padded?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
    }>> & {
        value: string;
        id?: string;
        disabled?: boolean;
        size?: SizeTokens;
        /**
         * Used to disable passing styles down to children.
         */
        disablePassStyles?: boolean;
    } & React.RefAttributes<HTMLButtonElement>>;
>>>>>>> master
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
declare const ToggleGroupImplElementFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & import("@tamagui/group").GroupExtraProps & {
    __scopeGroup?: import("@tamagui/create-context").Scope;
}, import("@tamagui/web").StackStyleBase, {
    inset?: number | SizeTokens | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    } | null | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    unstyled?: boolean | undefined;
    size?: any;
    transparent?: boolean | undefined;
    pressTheme?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
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