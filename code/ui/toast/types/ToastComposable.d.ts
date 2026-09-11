import type { GetProps, TamaguiElement } from '@tamagui/style';
import * as React from 'react';
import type { SwipeDirection } from './types';
import type { ExternalToast, ToastT } from './ToastState';
import type { BurntToastOptions } from './types';
import { ToastItemFrame } from './ToastItemFrame';
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
     * Only render toasts sent to this toaster id. Untargeted toasts render in
     * roots without an id.
     */
    toasterId?: string;
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
     * Fixed toast height in pixels for native stacking calculations.
     * On web, heights are measured dynamically.
     * @default 56
     */
    toastHeight?: number;
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
declare const ToastViewportFrame: React.FunctionComponent<Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic];
};
export type ToastViewportProps = GetProps<typeof ToastViewportFrame> & {
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
};
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
declare function ToastList({ renderItem }: ToastListProps): React.JSX.Element;
export type ToastItemProps = GetProps<typeof ToastItemFrame> & {
    toast: ToastT;
    index: number;
    children: React.ReactNode;
};
declare function ToastIcon(props: {
    children?: React.ReactNode;
}): React.JSX.Element | null;
export declare function useToasts(): {
    toasts: ToastT[];
    expanded: boolean;
    position: ToastPosition;
    closeButton: boolean;
};
export declare function useToastItem(): ToastItemContextValue;
export declare const Toast: ((props: ToastRootProps & import("@tamagui/style").RefProp<TamaguiElement>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Viewport: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "hotkey" | "label" | "offset" | "portalToRoot" | "portalZIndex" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
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
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
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
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    List: typeof ToastList;
    Item: import("@tamagui/style").TamaguiComponent<Omit<import("@tamagui/style").GetFinalProps<import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}>, "index" | "toast" | keyof import("@tamagui/style").RNTamaguiViewNonStyleProps | keyof import("@tamagui/style").StackStyleBase> & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        toast: ToastT;
        index: number;
        children: React.ReactNode;
    }, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/style").RNTamaguiViewNonStyleProps, keyof import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase> & import("@tamagui/style").WithFlatVariantValues<{}> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").StackStyleBase>> & {
        toast: ToastT;
        index: number;
        children: React.ReactNode;
    }, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Title: React.FunctionComponent<Omit<import("@tamagui/style").TextNonStyleProps, "size" | keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>> & {
        ref?: React.Ref<import("@tamagui/style").TamaguiTextElement> | undefined;
    }> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").TextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
    }, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").TextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
            size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        }, import("@tamagui/style").StaticConfigPublic];
    };
    Description: React.FunctionComponent<Omit<import("@tamagui/style").TextNonStyleProps, "size" | keyof import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase> & import("@tamagui/style").WithFlatVariantValues<{
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
    }> & import("@tamagui/style").WithShorthands<import("@tamagui/style").WithThemeValues<import("@tamagui/style").TextStylePropsBase>> & {
        ref?: React.Ref<import("@tamagui/style").TamaguiTextElement> | undefined;
    }> & import("@tamagui/style").StaticComponentObject<import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").TextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
        size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
    }, import("@tamagui/style").StaticConfigPublic> & Omit<import("@tamagui/style").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/style").TamaDefer, import("@tamagui/style").TamaguiTextElement, import("@tamagui/style").TextNonStyleProps, import("@tamagui/style").TextStylePropsBase, {
            size?: import("@tamagui/get-font-sized").GetFontSizedInput | undefined;
        }, import("@tamagui/style").StaticConfigPublic];
    };
    Close: import("@tamagui/style").TamaguiComponent<import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Action: import("@tamagui/style").TamaguiComponent<import("@tamagui/style").TamaDefer, TamaguiElement, import("@tamagui/style").RNTamaguiViewNonStyleProps, import("@tamagui/style").StackStyleBase, {}, import("@tamagui/style").StaticConfigPublic>;
    Icon: typeof ToastIcon;
};
export type { ToastT, ExternalToast };
//# sourceMappingURL=ToastComposable.d.ts.map