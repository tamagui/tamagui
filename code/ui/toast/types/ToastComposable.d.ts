import type { GetProps, TamaguiElement } from '@tamagui/core';
import * as React from 'react';
import type { SwipeDirection } from './ToastProvider';
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
declare const ToastViewportFrame: React.FunctionComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & {
    ref?: React.Ref<TamaguiElement> | undefined;
}> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic];
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
declare function ToastList({ renderItem }: ToastListProps): import("react/jsx-runtime").JSX.Element;
export type ToastItemProps = GetProps<typeof ToastItemFrame> & {
    toast: ToastT;
    index: number;
    children: React.ReactNode;
};
declare function ToastIcon(props: {
    children?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function useToasts(): {
    toasts: ToastT[];
    expanded: boolean;
    position: ToastPosition;
    closeButton: boolean;
};
export declare function useToastItem(): ToastItemContextValue;
export declare const Toast: ((props: ToastRootProps & import("@tamagui/core").RefProp<TamaguiElement>) => React.ReactNode) & {
    displayName?: string;
    propTypes?: any;
} & {
    Viewport: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {}>, "label" | "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | keyof import("@tamagui/core").StackStyleBase | "offset" | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | "hotkey" | "portalToRoot" | "portalZIndex"> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & {
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
    }, (HTMLElement & import("@tamagui/core").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {}>> & {
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
    }, import("@tamagui/core").StackStyleBase, {}, import("@tamagui/core").StaticConfigPublic>;
    List: typeof ToastList;
    Item: import("@tamagui/core").TamaguiComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
    }>, "toast" | "$native" | "$web" | "$android" | "$ios" | "$tv" | "$androidtv" | "$tvos" | import("@tamagui/core").GroupMediaKeys | "elevation" | keyof import("@tamagui/core").StackStyleBase | keyof import("@tamagui/core").RNTamaguiViewNonStyleProps | keyof import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | import("@tamagui/core").Size | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> | "index"> & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | import("@tamagui/core").Size | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | import("@tamagui/core").Size | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
    }>> & {
        toast: ToastT;
        index: number;
        children: React.ReactNode;
    }, (HTMLElement & import("@tamagui/core").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStyleBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | import("@tamagui/core").Size | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase> & {
        elevation?: number | import("@tamagui/core").Size | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStyleBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
    }>> & {
        toast: ToastT;
        index: number;
        children: React.ReactNode;
    }, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Title: React.FunctionComponent<Omit<import("@tamagui/core").TextNonStyleProps, "size" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        size?: import("@tamagui/core").FontSize | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        size?: import("@tamagui/core").FontSize | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/core").FontSize | undefined;
    }>> & {
        ref?: React.Ref<import("@tamagui/core").TamaguiTextElement> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/core").FontSize | undefined;
    }, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
            size?: import("@tamagui/core").FontSize | undefined;
        }, import("@tamagui/core").StaticConfigPublic];
    };
    Description: React.FunctionComponent<Omit<import("@tamagui/core").TextNonStyleProps, "size" | keyof import("@tamagui/core").TextStylePropsBase> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        size?: import("@tamagui/core").FontSize | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase> & {
        size?: import("@tamagui/core").FontSize | undefined;
    } & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").TextStylePropsBase>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/core").FontSize | undefined;
    }>> & {
        ref?: React.Ref<import("@tamagui/core").TamaguiTextElement> | undefined;
    }> & import("@tamagui/core").StaticComponentObject<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
        size?: import("@tamagui/core").FontSize | undefined;
    }, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig"> & {
        __tama: [import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiTextElement, import("@tamagui/core").TextNonStyleProps, import("@tamagui/core").TextStylePropsBase, {
            size?: import("@tamagui/core").FontSize | undefined;
        }, import("@tamagui/core").StaticConfigPublic];
    };
    Close: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
    }>, (HTMLElement & import("@tamagui/core").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Action: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
    }>, (HTMLElement & import("@tamagui/core").TamaguiElementMethods) | import("react-native").View, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, import("@tamagui/core").StackStyleBase, {
        elevation?: number | import("@tamagui/core").Size | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
    Icon: typeof ToastIcon;
};
export type { ToastT, ExternalToast };
//# sourceMappingURL=ToastComposable.d.ts.map