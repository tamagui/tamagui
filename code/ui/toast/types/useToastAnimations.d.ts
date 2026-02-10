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
 *
 * NOTE: For CSS driver, we use a ref-based approach with direct DOM manipulation
 * because CSS driver's useAnimatedNumberStyle doesn't reactively update.
 * For Motion/Reanimated drivers, we use the AnimatedView + motionValue pattern.
 */
import * as React from 'react';
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
    /**
     * Primary swipe axis — determines which animated value is tracked for style updates.
     * 'horizontal' tracks translateX, 'vertical' tracks translateY.
     */
    swipeAxis?: 'horizontal' | 'vertical';
}
export interface ToastAnimationValues {
    /** set drag offset directly (no animation, for gesture moves) */
    setDragOffset: (x: number, y: number) => void;
    /** spring back to origin after cancelled drag */
    springBack: (onComplete?: () => void) => void;
    /** animate out in a direction after successful swipe, with optional velocity for smooth continuation */
    animateOut: (direction: 'left' | 'right' | 'up' | 'down', velocity?: number, onComplete?: () => void) => void;
    /** stop any running animations */
    stop: () => void;
    /** the animated style to spread on the AnimatedView (for motion/reanimated drivers) */
    animatedStyle: any;
    /** the animated view component from the driver */
    AnimatedView: typeof Animated.View;
    /** ref to attach to the drag wrapper element (for CSS driver direct DOM updates) */
    dragRef: React.RefObject<HTMLDivElement | null>;
}
export declare function useToastAnimations(options?: UseToastAnimationsOptions): ToastAnimationValues;
//# sourceMappingURL=useToastAnimations.d.ts.map