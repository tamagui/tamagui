/**
 * Native implementation of drag gesture handling for toast swipe-to-dismiss.
 * Uses react-native-gesture-handler when available, falls back to PanResponder.
 */
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
    gestureHandlers: import("react-native").GestureResponderHandlers;
    resetDrag: () => void;
};
//# sourceMappingURL=useDragGesture.native.d.ts.map