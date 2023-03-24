import { Scope } from '@tamagui/create-context';
import React from 'react';
import { CreateNativeToastOptions, ToastNativePlatform, ToastNativeValue } from './types';
interface ToastImperativeOptions extends Omit<CreateNativeToastOptions, "message"> {
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
     * Overrides the native option on `createToast()`
     */
    native?: ToastNativeValue;
}
type ScopedProps<P> = P & {
    __scopeToast?: Scope;
};
type ToastData = {
    title: string;
    id: string;
} & CreateNativeToastOptions & {
    isHandledNatively: boolean;
};
declare const useToast: () => {
    /**
     * The currently displaying toast
     */
    currentToast: ToastData | null;
    /**
     * Call it to show a new toast. If you're using native toasts, you can pass native options using \`burntOptions\` or \`notificationOptions\` depending on the native platform (mobile/web).
     */
    show: (title: string, options?: ShowToastOptions) => boolean;
    /**
     * Call it to hide the currently displayed toast.
     *
     * _NOTE_: does not work on Android native toasts
     *
     * _NOTE_: hides the last toast on web notification toasts
     */
    hide: () => void;
};
interface ToastImperativeProviderProps {
    children: React.ReactNode;
    /**
     * Used to provide defaults to imperative API. Options can be overwritten when calling `show()`.
     */
    options: ToastImperativeOptions;
}
declare const ToastImperativeProvider: ({ children, options, __scopeToast, }: ScopedProps<ToastImperativeProviderProps>) => JSX.Element;
export { ToastImperativeProvider, useToast };
export type { ToastImperativeProviderProps, ToastNativePlatform, ToastNativeValue };
//# sourceMappingURL=ToastImperative.d.ts.map