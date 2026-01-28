/**
 * Web implementation of drag gesture handling with animation driver integration.
 * Uses pointer events for smooth drag tracking, animation driver for transforms.
 */
import * as React from 'react';
import type { SwipeDirection } from './ToastProvider';
export interface UseAnimatedDragGestureOptions {
    direction: SwipeDirection;
    threshold: number;
    disabled?: boolean;
    /** called during drag with offset values */
    onDragMove: (x: number, y: number) => void;
    /** called when drag starts */
    onDragStart?: () => void;
    /** called when drag ends with successful dismiss - animate out in this direction */
    onDismiss: (exitDirection: 'left' | 'right' | 'up' | 'down') => void;
    /** called when drag ends without dismiss - spring back */
    onCancel: () => void;
}
export declare function useAnimatedDragGesture(options: UseAnimatedDragGestureOptions): {
    isDragging: boolean;
    gestureHandlers: {
        onPointerDown: (event: React.PointerEvent) => void;
        onPointerMove: (event: React.PointerEvent) => void;
        onPointerUp: (event: React.PointerEvent) => void;
        onPointerCancel: (event: React.PointerEvent) => void;
    };
};
//# sourceMappingURL=useAnimatedDragGesture.d.ts.map