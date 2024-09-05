import type { NativeValue, TamaguiElement } from '@tamagui/core';
import * as React from 'react';
import type { ToastImperativeOptions } from './ToastImperative';
import type { BurntToastOptions } from './types';
declare const Collection: {
    readonly Provider: React.FC<{
        children?: React.ReactNode;
        __scopeCollection: string;
    }>;
    readonly Slot: React.ForwardRefExoticComponent<import("@tamagui/collection").CollectionProps & {
        __scopeCollection?: string | undefined;
    } & React.RefAttributes<TamaguiElement>>;
    readonly ItemSlot: React.ForwardRefExoticComponent<{
        children: React.ReactNode;
    } & {
        __scopeCollection?: string | undefined;
    } & React.RefAttributes<TamaguiElement>>;
}, useCollection: (__scopeCollection: any) => () => {
    ref: React.RefObject<TamaguiElement>;
}[];
export type SwipeDirection = 'vertical' | 'up' | 'down' | 'horizontal' | 'left' | 'right';
type ToastProviderContextValue = {
    id: string;
    label: string;
    duration: number;
    swipeDirection: SwipeDirection;
    swipeThreshold: number;
    toastCount: number;
    viewports: Record<string, TamaguiElement | null>;
    onViewportChange(name: string, viewport: TamaguiElement): void;
    onToastAdd(): void;
    onToastRemove(): void;
    isFocusedToastEscapeKeyDownRef: React.MutableRefObject<boolean>;
    isClosePausedRef: React.MutableRefObject<boolean>;
    options: ToastImperativeOptions;
};
type ScopedProps<P> = P & {
    __scopeToast?: string;
};
declare const useToastProviderContext: (scope?: string) => ToastProviderContextValue;
interface ToastProviderProps {
    children?: React.ReactNode;
    /**
     * An author-localized label for each toast. Used to help screen reader users
     * associate the interruption with a toast.
     * @defaultValue 'Notification'
     */
    label?: string;
    /**
     * Time in milliseconds that each toast should remain visible for.
     * @defaultValue 5000
     */
    duration?: number;
    /**
     * Direction of pointer swipe that should close the toast.
     * @defaultValue 'right'
     */
    swipeDirection?: SwipeDirection;
    /**
     * Distance in pixels that the swipe must pass before a close is triggered.
     * @defaultValue 50
     */
    swipeThreshold?: number;
    /**
     * @defaultValue unique generated identifier
     */
    id?: string;
    /**
     * Will show a native toast if is true or is set to the current platform. On iOS, it wraps `SPIndicator` and `SPAlert`. On Android, it wraps `ToastAndroid`. On web, it wraps Notification API. Mobile's native features are handled by `burnt`.
     * Only works with the imperative `useToast` hook.
     */
    native?: NativeValue;
    /**
     * Options for the burnt package if you're using native toasts on mobile
     */
    burntOptions?: Omit<BurntToastOptions, 'title' | 'message' | 'duration'>;
    /**
     * Options for the notification API if you're using native toasts on web
     */
    notificationOptions?: NotificationOptions;
}
declare const ToastProvider: React.FC<ToastProviderProps>;
export declare function ReprogapateToastProvider(props: {
    children: React.ReactNode;
    context: ToastProviderContextValue;
}): import("react/jsx-runtime").JSX.Element;
export { Collection, ToastProvider, useCollection, useToastProviderContext };
export type { ScopedProps, ToastProviderProps };
//# sourceMappingURL=ToastProvider.d.ts.map