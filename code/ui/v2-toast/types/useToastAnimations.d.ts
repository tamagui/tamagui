/**
 * Hook for cross-animation-driver toast drag animations.
 *
 * Animation strategy (all cross-driver):
 * - AnimatePresence => enter/exit styles
 * - transition prop => non-interactive styles (stacking, scale, opacity)
 * - useAnimatedNumber/Style => interactive styles (drag gestures only)
 *
 * This hook handles ONLY the drag gesture animations.
 * Uses the same pattern as Sheet for universal animation support.
 */
import type { Animated } from 'react-native';
export interface UseToastAnimationsOptions {
    /**
     * Called when exit animation completes
     */
    onExitComplete?: () => void;
    /**
     * When true, animations complete instantly (accessibility)
     */
    reducedMotion?: boolean;
}
export interface ToastAnimationValues {
    /** set drag offset directly (no animation, for gesture moves) */
    setDragOffset: (x: number, y: number) => void;
    /** spring back to origin after cancelled drag */
    springBack: (onComplete?: () => void) => void;
    /** animate out in a direction after successful swipe */
    animateOut: (direction: 'left' | 'right' | 'up' | 'down', onComplete?: () => void) => void;
    /** stop any running animations */
    stop: () => void;
    /** the animated style to spread on the AnimatedView */
    animatedStyle: any;
    /** the animated view component from the driver */
    AnimatedView: typeof Animated.View;
}
export declare function useToastAnimations(options?: UseToastAnimationsOptions): ToastAnimationValues;
//# sourceMappingURL=useToastAnimations.d.ts.map