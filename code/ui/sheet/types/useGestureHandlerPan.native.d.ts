import type { PanGesture } from 'react-native-gesture-handler';
import type { ScrollBridge } from './types';
interface GesturePanConfig {
    positions: number[];
    frameSize: number;
    setPosition: (pos: number) => void;
    animateTo: (pos: number) => void;
    stopSpring: () => void;
    scrollBridge: ScrollBridge;
    setIsDragging: (val: boolean) => void;
    getCurrentPosition: () => number;
    resisted: (val: number, minY: number) => number;
    hasScrollView: boolean;
    disableDrag?: boolean;
    isShowingInnerSheet?: boolean;
}
interface GesturePanResult {
    panGesture: PanGesture | null;
    panGestureRef: React.RefObject<PanGesture | null>;
    gestureHandlerEnabled: boolean;
}
/**
 * Hook that creates a Gesture.Pan() handler for use with react-native-gesture-handler.
 * This provides native-quality gesture coordination between Sheet and ScrollView.
 *
 * Based on patterns from react-native-actions-sheet and gorhom/bottom-sheet.
 *
 * @platform native - This hook only returns a gesture on native platforms.
 * On web, it returns null for the gesture.
 */
export declare function useGestureHandlerPan(config: GesturePanConfig): GesturePanResult;
export {};
//# sourceMappingURL=useGestureHandlerPan.native.d.ts.map