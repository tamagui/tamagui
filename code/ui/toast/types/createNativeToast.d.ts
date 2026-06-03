import type { CreateNativeToastsFn, HideNativeToastsFn } from './types';
export declare const createNativeToast: CreateNativeToastsFn;
export declare const hideNativeToast: HideNativeToastsFn;
/**
 * Request notification permission from the browser.
 * Must be called from a user gesture (click/tap handler).
 */
export declare function requestNotificationPermission(): Promise<NotificationPermission | null>;
//# sourceMappingURL=createNativeToast.d.ts.map