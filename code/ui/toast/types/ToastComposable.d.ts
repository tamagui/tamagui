import type { GetProps, TamaguiElement } from '@tamagui/core';
import * as React from 'react';
import type { SwipeDirection } from './ToastProvider';
import type { ExternalToast, ToastT } from './ToastState';
import type { BurntToastOptions } from './types';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
interface ToastItemContextValue {
    toast: ToastT;
    handleClose: () => void;
}
export interface ToastIcons {
    success?: React.ReactNode;
    error?: React.ReactNode;
    warning?: React.ReactNode;
    info?: React.ReactNode;
    loading?: React.ReactNode;
    close?: React.ReactNode;
}
export interface ToastRootProps {
    children: React.ReactNode;
    /**
     * Position of the toasts on screen
     * @default 'bottom-right'
     */
    position?: ToastPosition;
    /**
     * Default duration for toasts in ms
     * @default 4000
     */
    duration?: number;
    /**
     * Gap between toasts in pixels
     * @default 14
     */
    gap?: number;
    /**
     * Number of toasts visible at once
     * @default 4
     */
    visibleToasts?: number;
    /**
     * Direction toasts can be swiped to dismiss
     * @default 'auto'
     */
    swipeDirection?: SwipeDirection;
    /**
     * Distance in pixels swipe must pass to dismiss
     * @default 50
     */
    swipeThreshold?: number;
    /**
     * Show close button on toasts
     * @default false
     */
    closeButton?: boolean;
    /**
     * When true, toasts are always expanded (fanned out) instead of stacked.
     * @default false
     */
    expand?: boolean;
    /**
     * Theme for toasts
     */
    theme?: 'light' | 'dark' | 'system';
    /**
     * Force reduced motion mode
     */
    reducedMotion?: boolean;
    /**
     * When true, uses burnt native OS toasts on mobile instead of RN views.
     * @default false
     */
    native?: boolean;
    /**
     * Options for burnt native toasts on mobile
     */
    burntOptions?: Omit<BurntToastOptions, 'title' | 'message' | 'duration'>;
    /**
     * Options for web Notification API when native is true on web
     */
    notificationOptions?: NotificationOptions;
    /**
     * Custom icons for toast types
     */
    icons?: ToastIcons;
}
declare const ToastViewportFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export interface ToastViewportProps extends GetProps<typeof ToastViewportFrame> {
    /**
     * Offset from screen edge
     * @default 24
     */
    offset?: number | {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    /**
     * Hotkey to focus viewport
     */
    hotkey?: string[];
    /**
     * Aria label
     * @default 'Notifications'
     */
    label?: string;
    /**
     * Portal to root
     * @default true
     */
    portalToRoot?: boolean;
    /**
     * z-index for the portal container when portalToRoot is true
     * @default Number.MAX_SAFE_INTEGER
     */
    portalZIndex?: number;
}
export interface ToastItemRenderProps {
    toast: ToastT;
    index: number;
    handleClose: () => void;
}
export interface ToastListProps {
    /**
     * Custom render function for each toast item
     */
    renderItem?: (props: ToastItemRenderProps) => React.ReactNode;
}
declare function ToastList({ renderItem }: ToastListProps): import("react/jsx-runtime").JSX.Element;
declare const ToastItemFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export interface ToastItemProps extends GetProps<typeof ToastItemFrame> {
    toast: ToastT;
    index: number;
    children: React.ReactNode;
}
declare function ToastIcon(props: {
    children?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function useToasts(): {
    toasts: ToastT[];
    expanded: boolean;
    position: ToastPosition;
};
export declare function useToastItem(): ToastItemContextValue;
export declare const Toast: React.ForwardRefExoticComponent<ToastRootProps & React.RefAttributes<TamaguiElement>> & {
    Viewport: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, keyof ToastViewportProps> & ToastViewportProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & ToastViewportProps, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    List: typeof ToastList;
    Item: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof ToastItemProps> & ToastItemProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & ToastItemProps, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Title: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Description: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/core").FontSizeTokens | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Close: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Action: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Icon: typeof ToastIcon;
};
export type { ToastT, ExternalToast };
//# sourceMappingURL=ToastComposable.d.ts.map