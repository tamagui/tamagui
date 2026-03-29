/**
 * Native drag gesture handling for toast swipe-to-dismiss.
 *
 * Uses react-native-gesture-handler (RNGH) when available for proper gesture
 * coordination with ScrollView and navigation. Falls back to PanResponder.
 *
 * Pattern: same as Sheet — RNGH is accessed through @tamagui/native global
 * registry, never imported directly. The gesture is created in useMemo and
 * returns null when RNGH is not set up.
 */
import type { SwipeDirection } from './ToastProvider';
export interface UseAnimatedDragGestureOptions {
    direction: SwipeDirection;
    threshold: number;
    disabled?: boolean;
    expanded?: boolean;
    onDragMove: (x: number, y: number) => void;
    onDragStart?: () => void;
    onDismiss: (exitDirection: 'left' | 'right' | 'up' | 'down', velocity: number) => void;
    onCancel: () => void;
}
/**
 * Single hook — always calls the same hooks in the same order.
 * Creates RNGH gesture in useMemo (returns null if unavailable).
 * Creates PanResponder in useMemo (returns null if RNGH is used).
 * Consumer checks `gesture` to decide whether to wrap with GestureDetector.
 */
export declare function useAnimatedDragGesture(options: UseAnimatedDragGestureOptions): {
    isDragging: boolean;
    gestureHandlers: import("react-native").GestureResponderHandlers;
    gesture: any;
};
//# sourceMappingURL=useAnimatedDragGesture.native.d.ts.map