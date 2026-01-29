import type { GestureState } from "./types";
export type PressGestureConfig = {
	onPressIn?: (e: any) => void;
	onPressOut?: (e: any) => void;
	onPress?: (e: any) => void;
	onLongPress?: (e: any) => void;
	delayLongPress?: number;
	hitSlop?: any;
};
export interface GestureHandlerAccessor {
	readonly isEnabled: boolean;
	readonly state: GestureState;
	set(updates: Partial<GestureState>): void;
	disable(): void;
	createPressGesture(config: PressGestureConfig): any;
}
export declare function getGestureHandler(): GestureHandlerAccessor;

//# sourceMappingURL=gestureState.d.ts.map