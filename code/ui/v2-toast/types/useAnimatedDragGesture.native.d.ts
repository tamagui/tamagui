/**
 * Native implementation of drag gesture handling with animation driver integration.
 * Uses PanResponder for gesture tracking, animation driver for transforms.
 */
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
    gestureHandlers: import("react-native").GestureResponderHandlers;
};
//# sourceMappingURL=useAnimatedDragGesture.native.d.ts.map