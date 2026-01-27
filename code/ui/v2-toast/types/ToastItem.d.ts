import * as React from 'react';
import type { HeightT, ToasterPosition } from './Toaster';
import type { ToastT } from './ToastState';
import type { SwipeDirection } from './ToastProvider';
import type { BurntToastOptions } from './types';
export interface ToastItemProps {
    toast: ToastT;
    index: number;
    expanded: boolean;
    interacting: boolean;
    position: ToasterPosition;
    visibleToasts: number;
    removeToast: (toast: ToastT) => void;
    heights: HeightT[];
    setHeights: React.Dispatch<React.SetStateAction<HeightT[]>>;
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
    disableNative?: boolean;
    burntOptions?: Omit<BurntToastOptions, 'title' | 'message' | 'duration'>;
    notificationOptions?: NotificationOptions;
    /** When true, disables animations for accessibility */
    reducedMotion?: boolean;
}
export declare const ToastItem: React.NamedExoticComponent<ToastItemProps>;
//# sourceMappingURL=ToastItem.d.ts.map