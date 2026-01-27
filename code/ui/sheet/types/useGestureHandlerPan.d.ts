import { type RefObject } from 'react';
import type { ScrollBridge } from './types';
interface GesturePanConfig {
    positions: number[];
    frameSize: number;
    setPosition: (pos: number) => void;
    animateTo: (pos: number, animationOverride?: any) => void;
    stopSpring: () => void;
    scrollBridge: ScrollBridge;
    setIsDragging: (val: boolean) => void;
    getCurrentPosition: () => number;
    resisted: (val: number, minY: number) => number;
    disableDrag?: boolean;
    isShowingInnerSheet?: boolean;
    setAnimatedPosition: (val: number) => void;
    scrollGestureRef?: RefObject<any> | null;
    isKeyboardVisibleRef?: RefObject<boolean>;
    onDismissKeyboard?: () => void;
    pauseKeyboardHandler?: RefObject<boolean>;
    screenSize?: number;
}
interface GesturePanResult {
    panGesture: any | null;
    panGestureRef: RefObject<any>;
    gestureHandlerEnabled: boolean;
}
/**
 * Hook that creates a Gesture.Pan() handler for use with react-native-gesture-handler.
 * This provides native-quality gesture coordination between Sheet and ScrollView.
 *
 * Uses state-based decision pattern (like gorhom/bottom-sheet and react-native-actions-sheet):
 * - Both pan and scroll gestures run simultaneously
 * - In onChange, we decide whether to process pan or let scroll handle it
 * - scrollBridge.setScrollEnabled toggles scroll on/off as needed
 *
 * Decision matrix:
 * 1. Sheet not fully open + swiping up -> pan handles (disable scroll)
 * 2. Sheet fully open + swiping up -> scroll handles (blockPan)
 * 3. Sheet not fully open + swiping down -> pan handles (unless scrolled)
 * 4. Sheet fully open + swiping down + scrollY=0 -> pan handles
 * 5. Sheet fully open + swiping down + scrollY>0 -> scroll handles (blockPan)
 *
 * Returns null for the gesture if RNGH is not available or drag is disabled.
 */
export declare function useGestureHandlerPan(config: GesturePanConfig): GesturePanResult;
export {};
//# sourceMappingURL=useGestureHandlerPan.d.ts.map