/**
 * Re-export gesture state from @tamagui/native.
 * Sheet uses this for backward compatibility with existing code.
 */
import { type GestureState } from '@tamagui/native';
export type { GestureState as GestureHandlerState } from '@tamagui/native';
export declare function isGestureHandlerEnabled(): boolean;
export declare function getGestureHandlerState(): GestureState;
export declare function setGestureHandlerState(updates: Partial<GestureState>): void;
export declare const setGestureState: typeof setGestureHandlerState;
//# sourceMappingURL=gestureState.d.ts.map