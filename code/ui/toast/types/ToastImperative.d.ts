import React from 'react';
import type { NativePlatform, NativeValue } from '@tamagui/core';
import type { CreateNativeToastOptions, NativeToastRef } from './types';
export interface ToastImperativeOptions extends Omit<CreateNativeToastOptions, 'message'> {
    /**
     * Will show a native toast if is true or is set to the current platform. On iOS, it wraps `SPIndicator` and `SPAlert`. On Android, it wraps `ToastAndroid`. On web, it wraps Notification API. Mobile's native features are handled by `burnt`.
     */
    native?: NativeValue;
}
/**
 * Override this in your application to get custom toast fields.
 *
 * e.g.
 * ```ts
 * declare module '@tamagui/toast' {
 *   interface CustomData {
 *     preset: 'error' | 'success'
 *     isUrgent: true
 *   }
 * }
 *```
 * You will get auto-completion:
 * ```ts
 * toast.show("Message", { preset: 'error', isUrgent: true })
 * ```
 */
export interface CustomData {
    [key: string]: any;
}
type ShowOptions = CreateNativeToastOptions & CustomData & {
    /**
     * Used when need custom data
     * @deprecated Use `customData` instead
     */
    additionalInfo?: CustomData;
    /**
     * Used when need custom data
     */
    customData?: CustomData;
    /**
     * Overrides the native option on `ToastImperativeProvider`
     */
    native?: NativeValue;
    /**
     * Which viewport to send this toast to. This is only intended to be used with custom toasts and you should wire it up when creating the toast.
     */
    viewportName?: string | 'default';
};
type ToastData = {
    title: string;
    id: string;
} & ShowOptions & {
    isHandledNatively: boolean;
} & CustomData;
interface ToastContextI {
    nativeToast: NativeToastRef | null;
    /**
     * Call it to show a new toast. If you're using native toasts, you can pass native options using \`burntOptions\` or \`notificationOptions\` depending on the native platform (mobile/web).
     */
    show: (title: string, options?: ShowOptions) => boolean;
    /**
     * Call it to hide the currently displayed toast.
     *
     * _NOTE_: does not work on Android native toasts
     *
     * _NOTE_: hides the last toast on web notification toasts
     */
    hide: () => void;
    options?: ToastImperativeOptions;
}
export declare const useToastController: () => ToastContextI;
export declare const useToastState: () => ToastData | null;
/** @deprecated use `useToastController` and `useToastState` instead to avoid performance pitfalls */
export declare const useToast: () => {
    currentToast: ToastData | null;
    nativeToast: NativeToastRef | null;
    /**
     * Call it to show a new toast. If you're using native toasts, you can pass native options using \`burntOptions\` or \`notificationOptions\` depending on the native platform (mobile/web).
     */
    show: (title: string, options?: ShowOptions) => boolean;
    /**
     * Call it to hide the currently displayed toast.
     *
     * _NOTE_: does not work on Android native toasts
     *
     * _NOTE_: hides the last toast on web notification toasts
     */
    hide: () => void;
    options?: ToastImperativeOptions;
};
interface ToastImperativeProviderProps {
    children: React.ReactNode;
    /**
     * Used to provide defaults to imperative API. Options can be overwritten when calling `show()`.
     */
    options: ToastImperativeOptions;
}
export declare const ToastImperativeProvider: ({ children, options, }: ToastImperativeProviderProps) => import("react/jsx-runtime").JSX.Element;
export type { ToastImperativeProviderProps, NativePlatform, NativeValue };
//# sourceMappingURL=ToastImperative.d.ts.map