/**
 * Native toast list hook — returns shared values and a flat render function.
 * No extra component layers — the render function is called directly in ToastList.
 */
import * as React from 'react';
import type { ToastT } from './ToastState';
interface NativeRenderOptions {
    toasts: ToastT[];
    expanded: boolean;
    position: string;
    visibleToasts: number;
    gap: number;
    duration: number;
    reducedMotion?: boolean;
    removeToast: (toast: ToastT) => void;
    triggerDismissCooldown: () => void;
    onTap?: () => void;
    renderContent?: (toast: ToastT, index: number) => React.ReactNode;
}
export declare function useNativeToastList(): (options: NativeRenderOptions) => React.ReactNode;
export {};
//# sourceMappingURL=useNativeToastList.native.d.ts.map