/**
 * Shared toast auto-dismiss timer logic.
 * Used by both web and native ToastItemInner implementations.
 */
import type { ToastT } from './ToastState';
export interface UseToastTimerOptions {
    toast: ToastT;
    duration: number;
    toastType: string;
    expanded: boolean;
    interacting: boolean;
    removeToast: (toast: ToastT) => void;
}
export declare function useToastTimer(options: UseToastTimerOptions): {
    startTimer: () => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
};
//# sourceMappingURL=useToastTimer.d.ts.map