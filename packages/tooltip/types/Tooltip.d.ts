import '@tamagui/polyfill-dev';
import type { SizeTokens } from '@tamagui/core';
import type { PopperProps } from '@tamagui/popper';
import * as React from 'react';
export type TooltipProps = PopperProps & {
    open?: boolean;
    unstyled?: boolean;
    children?: React.ReactNode;
    onOpenChange?: (open: boolean) => void;
    focus?: {
        enabled?: boolean;
        visibleOnly?: boolean;
    };
    groupId?: string;
    restMs?: number;
    delay?: number | {
        open?: number;
        close?: number;
    };
    disableAutoCloseOnScroll?: boolean;
};
type Delay = number | Partial<{
    open: number;
    close: number;
}>;
export declare const TooltipGroup: ({ children, delay }: {
    children?: any;
    delay: Delay;
}) => import("react/jsx-runtime").JSX.Element;
export declare const Tooltip: React.ForwardRefExoticComponent<PopperProps & {
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
    children?: React.ReactNode;
    onOpenChange?: ((open: boolean) => void) | undefined;
    focus?: {
        enabled?: boolean | undefined;
        visibleOnly?: boolean | undefined;
    } | undefined;
    groupId?: string | undefined;
    restMs?: number | undefined;
    delay?: number | {
        open?: number | undefined;
        close?: number | undefined;
    } | undefined;
    disableAutoCloseOnScroll?: boolean | undefined;
} & {
    __scopeTooltip?: string | undefined;
} & React.RefAttributes<unknown>> & {
    Anchor: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen" | "inset"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
    }>> & {
        __scopeTooltip?: string | undefined;
    } & React.RefAttributes<unknown>>;
    Arrow: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen" | "inset"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        inset?: number | SizeTokens | {
            top?: number | undefined;
            bottom?: number | undefined;
            left?: number | undefined;
            right?: number | undefined;
        } | undefined;
    }>> & import("@tamagui/popper").PopperArrowExtraProps & {
        __scopeTooltip?: string | undefined;
    } & React.RefAttributes<unknown>>;
    Content: React.ForwardRefExoticComponent<import("@tamagui/popover").PopoverContentTypeProps & {
        __scopeTooltip?: string | undefined;
    } & React.RefAttributes<unknown>>;
    Trigger: React.ForwardRefExoticComponent<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & {
        __scopeTooltip?: string | undefined;
    } & React.RefAttributes<unknown>>;
};
export {};
//# sourceMappingURL=Tooltip.d.ts.map