import '@tamagui/polyfill-dev';
import { SizeTokens } from '@tamagui/core';
import { PopperProps } from '@tamagui/popper';
import * as React from 'react';
export type TooltipProps = PopperProps & {
    open?: boolean;
    unstyled?: boolean;
    children?: React.ReactNode;
    onOpenChange?: (open: boolean) => void;
    focus?: {
        enabled?: boolean;
        keyboardOnly?: boolean;
    };
    groupId?: string;
    restMs?: number;
    delay?: number | {
        open?: number;
        close?: number;
    };
};
type Delay = number | Partial<{
    open: number;
    close: number;
}>;
export declare const TooltipGroup: ({ children, delay }: {
    children?: any;
    delay: Delay;
}) => JSX.Element;
export declare const Tooltip: React.ForwardRefExoticComponent<PopperProps & {
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
    children?: React.ReactNode;
    onOpenChange?: ((open: boolean) => void) | undefined;
    focus?: {
        enabled?: boolean | undefined;
        keyboardOnly?: boolean | undefined;
    } | undefined;
    groupId?: string | undefined;
    restMs?: number | undefined;
    delay?: number | {
        open?: number | undefined;
        close?: number | undefined;
    } | undefined;
} & {
    __scopeTooltip?: string | undefined;
} & React.RefAttributes<unknown>> & {
    Anchor: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & {
        __scopeTooltip?: string | undefined;
    } & React.RefAttributes<unknown>>;
    Arrow: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "fullscreen"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>> & {
        offset?: number | undefined;
        size?: SizeTokens | undefined;
    } & {
        __scopeTooltip?: string | undefined;
    } & React.RefAttributes<unknown>>;
    Content: React.ForwardRefExoticComponent<import("@tamagui/popover").PopoverContentTypeProps & {
        __scopeTooltip?: string | undefined;
    } & React.RefAttributes<unknown>>;
    Trigger: React.ForwardRefExoticComponent<import("@tamagui/core").StackNonStyleProps & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase>> & {
        __scopeTooltip?: string | undefined;
    } & React.RefAttributes<unknown>>;
};
export {};
//# sourceMappingURL=Tooltip.d.ts.map