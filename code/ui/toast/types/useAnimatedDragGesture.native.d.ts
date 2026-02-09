/**
 * Native implementation of drag gesture handling with animation driver integration.
 * Uses PanResponder for gesture tracking, animation driver for transforms.
 */
import type { SwipeDirection } from './ToastProvider';
export interface UseAnimatedDragGestureOptions {
    direction: SwipeDirection;
    threshold: number;
    disabled?: boolean;
    /** when collapsed, allow drag in all directions with resistance except exit direction */
    expanded?: boolean;
    /** called during drag with offset values */
    onDragMove: (x: number, y: number) => void;
    /** called when drag starts */
    onDragStart?: () => void;
    /** called when drag ends with successful dismiss - includes exit direction and velocity */
    onDismiss: (exitDirection: 'left' | 'right' | 'up' | 'down', velocity: number) => void;
    /** called when drag ends without dismiss - spring back */
    onCancel: () => void;
}
export declare function useAnimatedDragGesture(options: UseAnimatedDragGestureOptions): {
    isDragging: boolean;
    gestureHandlers: import("react-native").GestureResponderHandlers;
};
//# sourceMappingURL=useAnimatedDragGesture.native.d.ts.map