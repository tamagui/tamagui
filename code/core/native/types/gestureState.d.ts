import type { GestureState } from "./types";
export interface GestureHandlerAccessor {
	readonly isEnabled: boolean;
	readonly state: GestureState;
	set(updates: Partial<GestureState>): void;
}
export declare function getGestureHandler(): GestureHandlerAccessor;

//# sourceMappingURL=gestureState.d.ts.map