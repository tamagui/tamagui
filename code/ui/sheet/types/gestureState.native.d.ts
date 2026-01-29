import type { PanGesture } from 'react-native-gesture-handler';
export type GestureHandlerState = {
    enabled: boolean;
    GestureDetector: any | null;
    Gesture: any | null;
};
export declare function setGestureHandlerState(newState: GestureHandlerState): void;
export declare function getGestureHandlerState(): GestureHandlerState;
export declare function isGestureHandlerEnabled(): boolean;
export declare function createPanGesture(): PanGesture | null;
export declare function getGestureDetector(): any | null;
//# sourceMappingURL=gestureState.native.d.ts.map