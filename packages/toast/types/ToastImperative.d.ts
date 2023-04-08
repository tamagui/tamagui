import React from 'react';
import { CreateNativeToastOptions, NativeToastRef, ToastNativePlatform, ToastNativeValue } from './types';
interface ToastImperativeOptions extends Omit<CreateNativeToastOptions, 'message'> {
    /**
     * Will show a native toast if is true or is set to the current platform. On iOS, it wraps `SPIndicator` and `SPAlert`. On Android, it wraps `ToastAndroid`. On web, it wraps Notification API. Mobile's native features are handled by `burnt`.
     */
    native?: ToastNativeValue;
}
interface ShowToastOptions extends CreateNativeToastOptions {
    /**
     * Used when need custom data
     */
    additionalInfo?: Record<string, any>;
    /**
     * Overrides the native option on `ToastImperativeProvider`
     */
    native?: ToastNativeValue;
}
type ToastData = {
    title: string;
    id: string;
} & CreateNativeToastOptions & {
    isHandledNatively: boolean;
};
interface ToastContextI {
    nativeToast: NativeToastRef | null;
    /**
     * Call it to show a new toast. If you're using native toasts, you can pass native options using \`burntOptions\` or \`notificationOptions\` depending on the native platform (mobile/web).
     */
    showToast: (title: string, options?: ShowToastOptions) => boolean;
    /**
     * Call it to hide the currently displayed toast.
     *
     * _NOTE_: does not work on Android native toasts
     *
     * _NOTE_: hides the last toast on web notification toasts
     */
    hideToast: () => void;
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
    showToast: (title: string, options?: ShowToastOptions) => boolean;
    /**
     * Call it to hide the currently displayed toast.
     *
     * _NOTE_: does not work on Android native toasts
     *
     * _NOTE_: hides the last toast on web notification toasts
     */
    hideToast: () => void;
    options?: ToastImperativeOptions | undefined;
};
interface ToastImperativeProviderProps {
    children: React.ReactNode;
    /**ToastCurrentContextI
     *
     * Used to provide defaults to imperative API. Options can be overwritten when calling `show()`.
     */
    options: ToastImperativeOptions;
}
export declare const ToastImperativeProvider: ({ children, options, }: ToastImperativeProviderProps) => JSX.Element;
export type { ToastImperativeProviderProps, ToastNativePlatform, ToastNativeValue };
//# sourceMappingURL=ToastImperative.d.ts.map