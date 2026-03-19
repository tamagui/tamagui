import type { ToastT } from './ToastState';
import type { BurntToastOptions } from './types';
/**
 * Attempts to dispatch a toast via native platform API (Burnt on mobile, Notification on web).
 * Returns true if the toast was handled natively, false if it should fall through to in-app.
 */
export declare function dispatchNativeToast(toast: ToastT, opts: {
    duration: number;
    burntOptions?: Omit<BurntToastOptions, 'title' | 'message' | 'duration'>;
    notificationOptions?: NotificationOptions;
}): boolean;
//# sourceMappingURL=dispatchNativeToast.d.ts.map