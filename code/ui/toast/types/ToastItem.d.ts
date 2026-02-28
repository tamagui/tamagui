import * as React from 'react';
import type { ToasterPosition } from './Toaster';
import type { ToastT } from './ToastState';
import type { SwipeDirection } from './ToastProvider';
export interface ToastItemProps {
    toast: ToastT;
    index: number;
    expanded: boolean;
    interacting: boolean;
    position: ToasterPosition;
    visibleToasts: number;
    removeToast: (toast: ToastT) => void;
    triggerDismissCooldown: () => void;
    heights: Record<string | number, number>;
    setToastHeight: (toastId: string | number, height: number) => void;
    removeToastHeight: (toastId: string | number) => void;
    heightBeforeMe: number;
    frontToastHeight: number;
    duration: number;
    gap: number;
    swipeDirection: SwipeDirection;
    swipeThreshold: number;
    closeButton?: boolean;
    icons?: {
        success?: React.ReactNode;
        error?: React.ReactNode;
        warning?: React.ReactNode;
        info?: React.ReactNode;
        loading?: React.ReactNode;
        close?: React.ReactNode;
    };
    /** When true, disables animations for accessibility */
    reducedMotion?: boolean;
}
export declare const ToastItem: React.NamedExoticComponent<ToastItemProps>;
//# sourceMappingURL=ToastItem.d.ts.map