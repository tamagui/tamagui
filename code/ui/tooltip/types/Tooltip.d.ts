import '@tamagui/polyfill-dev';
import type { SizeTokens, TamaguiElement } from '@tamagui/core';
import type { PopoverAnchorProps, PopoverContentProps, PopoverTriggerProps } from '@tamagui/popover';
import type { PopperProps } from '@tamagui/popper';
import * as React from 'react';
export type TooltipScopes = string;
type ScopedProps<P> = Omit<P, 'scope'> & {
    scope?: TooltipScopes;
};
export type TooltipContentProps = ScopedProps<PopoverContentProps>;
export type TooltipProps = ScopedProps<PopperProps & {
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
}>;
type Delay = number | Partial<{
    open: number;
    close: number;
}>;
export declare const TooltipGroup: ({ children, delay, preventAnimation, timeoutMs, }: {
    children?: any;
    delay: Delay;
    preventAnimation?: boolean;
    timeoutMs?: number;
}) => import("react/jsx-runtime").JSX.Element;
export declare const closeOpenTooltips: () => void;
export declare const Tooltip: React.ForwardRefExoticComponent<Omit<PopperProps & {
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
}, "scope"> & {
    scope?: TooltipScopes;
} & React.RefAttributes<unknown>> & {
    Anchor: React.ForwardRefExoticComponent<Omit<PopoverAnchorProps, "scope"> & {
        scope?: TooltipScopes;
    } & React.RefAttributes<unknown>>;
    Arrow: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        inset?: number | SizeTokens | {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
        } | null | undefined;
        fullscreen?: boolean | undefined;
    }>> & import("@tamagui/popper").PopperArrowExtraProps & React.RefAttributes<TamaguiElement>>;
    Content: React.ForwardRefExoticComponent<Omit<import("@tamagui/popover").PopoverContentTypeProps, "scope"> & {
        scope?: TooltipScopes;
    } & React.RefAttributes<TamaguiElement>>;
    Trigger: React.ForwardRefExoticComponent<Omit<PopoverTriggerProps, "scope"> & {
        scope?: TooltipScopes;
    } & React.RefAttributes<unknown>>;
};
export {};
//# sourceMappingURL=Tooltip.d.ts.map