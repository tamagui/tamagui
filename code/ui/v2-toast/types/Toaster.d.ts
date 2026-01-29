import type { TamaguiElement } from '@tamagui/core';
import * as React from 'react';
import type { SwipeDirection } from './ToastProvider';
import type { ExternalToast } from './ToastState';
import type { BurntToastOptions } from './types';
export type ToasterPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export interface HeightT {
    toastId: string | number;
    height: number;
    position?: ToasterPosition;
}
export interface ToasterProps {
    /**
     * Position of the toasts on screen
     * @default 'bottom-right'
     */
    position?: ToasterPosition;
    /**
     * Width of toast container in pixels
     * @default 356
     */
    width?: number;
    /**
     * Expand toasts on hover to show all
     * @default false
     */
    expand?: boolean;
    /**
     * Number of toasts visible at once
     * @default 4
     */
    visibleToasts?: number;
    /**
     * Gap between toasts in pixels
     * @default 14
     */
    gap?: number;
    /**
     * Default duration for toasts in ms
     * @default 4000
     */
    duration?: number;
    /**
     * Offset from screen edge in pixels
     * @default 24
     */
    offset?: number | {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    /**
     * Hotkey to focus toast viewport
     * @default ['altKey', 'KeyT']
     */
    hotkey?: string[];
    /**
     * Direction(s) toasts can be swiped to dismiss
     * @default 'right'
     */
    swipeDirection?: SwipeDirection;
    /**
     * Distance in pixels swipe must pass to dismiss
     * @default 50
     */
    swipeThreshold?: number;
    /**
     * Show close button on toasts
     * @default false
     */
    closeButton?: boolean;
    /**
     * Theme for toasts (auto-detected if not set)
     */
    theme?: 'light' | 'dark' | 'system';
    /**
     * Custom icons for toast types
     */
    icons?: {
        success?: React.ReactNode;
        error?: React.ReactNode;
        warning?: React.ReactNode;
        info?: React.ReactNode;
        loading?: React.ReactNode;
        close?: React.ReactNode;
    };
    /**
     * Default toast options
     */
    toastOptions?: ExternalToast;
    /**
     * Container aria label for screen readers
     * @default 'Notifications'
     */
    containerAriaLabel?: string;
    /**
     * Disable native toast on mobile (uses burnt package)
     * @default false
     */
    disableNative?: boolean;
    /**
     * Options for burnt native toasts on mobile
     */
    burntOptions?: Omit<BurntToastOptions, 'title' | 'message' | 'duration'>;
    /**
     * Options for web Notification API
     */
    notificationOptions?: NotificationOptions;
    /**
     * Custom className for the container
     */
    className?: string;
    /**
     * Custom style for the container
     */
    style?: React.CSSProperties;
}
export declare const Toaster: React.ForwardRefExoticComponent<ToasterProps & React.RefAttributes<TamaguiElement>>;
//# sourceMappingURL=Toaster.d.ts.map