import type React from 'react';
import type { CreateNativeToastOptions, NativeToastRef } from './types';
export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading';
export interface ToastT {
    id: string | number;
    title: React.ReactNode | (() => React.ReactNode);
    description?: React.ReactNode | (() => React.ReactNode);
    type?: ToastType;
    icon?: React.ReactNode;
    jsx?: React.ReactElement;
    dismissible?: boolean;
    duration?: number;
    promise?: PromiseT;
    action?: ToastAction;
    cancel?: ToastAction;
    closeButton?: boolean;
    onDismiss?: (toast: ToastT) => void;
    onAutoClose?: (toast: ToastT) => void;
    delete?: boolean;
    style?: React.CSSProperties;
    className?: string;
    burntOptions?: CreateNativeToastOptions['burntOptions'];
    notificationOptions?: CreateNativeToastOptions['notificationOptions'];
    /** Custom user data */
    data?: Record<string, unknown>;
}
export interface ToastAction {
    label: string;
    onClick?: (event: React.MouseEvent) => void;
}
export interface ToastToDismiss {
    id: string | number;
    dismiss: true;
}
export type ExternalToast = Omit<ToastT, 'id' | 'title' | 'type' | 'delete' | 'promise'> & {
    id?: string | number;
};
export type PromiseT<Data = any> = Promise<Data> | (() => Promise<Data>);
export interface PromiseData<Data = any> {
    loading?: React.ReactNode | (() => React.ReactNode);
    success?: React.ReactNode | ((data: Data) => React.ReactNode);
    error?: React.ReactNode | ((error: any) => React.ReactNode);
    description?: React.ReactNode | ((data: any) => React.ReactNode);
    finally?: () => void;
}
type TitleT = React.ReactNode | (() => React.ReactNode);
/**
 * Observer class that manages toast state globally.
 * Follows the pattern from Sonner for a clean, decoupled architecture.
 */
declare class Observer {
    subscribers: Array<(toast: ToastT | ToastToDismiss) => void>;
    toasts: ToastT[];
    dismissedToasts: Set<string | number>;
    /**
     * Subscribe to toast state changes.
     * Returns an unsubscribe function.
     */
    subscribe: (subscriber: (toast: ToastT | ToastToDismiss) => void) => () => void;
    /**
     * Publish a toast to all subscribers
     */
    publish: (data: ToastT) => void;
    /**
     * Add a new toast to the internal array and publish to subscribers
     */
    addToast: (data: ToastT) => void;
    /**
     * Create or update a toast
     */
    create: (data: ExternalToast & {
        title?: TitleT;
        type?: ToastType;
        promise?: PromiseT;
        jsx?: React.ReactElement;
    }) => string | number;
    /**
     * Dismiss a toast by id, or all toasts if no id provided
     */
    dismiss: (id?: string | number) => string | number | undefined;
    /**
     * Show a basic toast message
     */
    message: (title: TitleT, data?: ExternalToast) => string | number;
    /**
     * Show a success toast
     */
    success: (title: TitleT, data?: ExternalToast) => string | number;
    /**
     * Show an error toast
     */
    error: (title: TitleT, data?: ExternalToast) => string | number;
    /**
     * Show a warning toast
     */
    warning: (title: TitleT, data?: ExternalToast) => string | number;
    /**
     * Show an info toast
     */
    info: (title: TitleT, data?: ExternalToast) => string | number;
    /**
     * Show a loading toast
     */
    loading: (title: TitleT, data?: ExternalToast) => string | number;
    /**
     * Show a toast for a promise, automatically transitioning through
     * loading -> success/error states
     */
    promise: <ToastData>(promise: PromiseT<ToastData>, data?: PromiseData<ToastData>) => (string & {
        unwrap: () => Promise<ToastData>;
    }) | (number & {
        unwrap: () => Promise<ToastData>;
    }) | {
        unwrap: () => Promise<ToastData>;
    } | undefined;
    /**
     * Show a custom JSX toast
     */
    custom: (jsx: (id: string | number) => React.ReactElement, data?: ExternalToast) => string | number;
    /**
     * Get all active (non-dismissed) toasts
     */
    getActiveToasts: () => ToastT[];
    /**
     * Get full toast history
     */
    getHistory: () => ToastT[];
}
export declare const ToastState: Observer;
/**
 * Main toast API - call directly or use methods like toast.success()
 *
 * @example
 * // basic usage
 * toast('Hello world')
 *
 * // with type
 * toast.success('Saved!')
 * toast.error('Something went wrong')
 *
 * // with options
 * toast('Hello', { duration: 5000 })
 *
 * // promise toast
 * toast.promise(fetch('/api'), {
 *   loading: 'Loading...',
 *   success: 'Done!',
 *   error: 'Failed'
 * })
 *
 * // custom JSX
 * toast.custom((id) => <MyToast id={id} />)
 *
 * // dismiss
 * const id = toast('Hello')
 * toast.dismiss(id)
 * toast.dismiss() // dismiss all
 */
export declare const toast: ((title: TitleT, data?: ExternalToast) => string | number) & {
    success: (title: TitleT, data?: ExternalToast) => string | number;
    error: (title: TitleT, data?: ExternalToast) => string | number;
    warning: (title: TitleT, data?: ExternalToast) => string | number;
    info: (title: TitleT, data?: ExternalToast) => string | number;
    loading: (title: TitleT, data?: ExternalToast) => string | number;
    promise: <ToastData>(promise: PromiseT<ToastData>, data?: PromiseData<ToastData> | undefined) => (string & {
        unwrap: () => Promise<ToastData>;
    }) | (number & {
        unwrap: () => Promise<ToastData>;
    }) | {
        unwrap: () => Promise<ToastData>;
    } | undefined;
    custom: (jsx: (id: string | number) => React.ReactElement, data?: ExternalToast) => string | number;
    dismiss: (id?: string | number) => string | number | undefined;
    message: (title: TitleT, data?: ExternalToast) => string | number;
    getHistory: () => ToastT[];
    getToasts: () => ToastT[];
};
export type { NativeToastRef };
//# sourceMappingURL=ToastState.d.ts.map