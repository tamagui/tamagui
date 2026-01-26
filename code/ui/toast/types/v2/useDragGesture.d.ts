/**
 * Web implementation of drag gesture handling for toast swipe-to-dismiss.
 * Uses pointer events for smooth drag tracking.
 */
import * as React from 'react';
import type { SwipeDirection } from './ToastProvider';
export interface DragState {
    isDragging: boolean;
    offsetX: number;
    offsetY: number;
    velocityX: number;
    velocityY: number;
}
export interface UseDragGestureOptions {
    direction: SwipeDirection;
    threshold: number;
    onDragStart?: () => void;
    onDragEnd?: (dismissed: boolean) => void;
    onDragCancel?: () => void;
    disabled?: boolean;
}
export declare function useDragGesture(options: UseDragGestureOptions): {
    dragState: DragState;
    gestureHandlers: {
        onPointerDown: (event: React.PointerEvent) => void;
        onPointerMove: (event: React.PointerEvent) => void;
        onPointerUp: (event: React.PointerEvent) => void;
        onPointerCancel: () => void;
    };
    resetDrag: () => void;
};
//# sourceMappingURL=useDragGesture.d.ts.map