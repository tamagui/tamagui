import type { GestureState } from "./types";
export interface Insets {
	top?: number;
	left?: number;
	bottom?: number;
	right?: number;
}
export type PressGestureConfig = {
	debugName?: string | null;
	onPressIn?: (e: any) => void;
	onPressOut?: (e: any) => void;
	onPress?: (e: any) => void;
	onLongPress?: (e: any) => void;
	delayLongPress?: number;
	hitSlop?: number | Insets | null;
};
export interface GestureHandlerAccessor {
	readonly isEnabled: boolean;
	readonly state: GestureState;
	set(updates: Partial<GestureState>): void;
	disable(): void;
	createPressGesture(config: PressGestureConfig): any;
}
export type ExternalPressOwnershipToken = object;
export declare function claimExternalPressOwnership(debugName?: string | null): ExternalPressOwnershipToken;
export declare function releaseExternalPressOwnership(token: ExternalPressOwnershipToken | null | undefined, debugName?: string | null): void;
export declare function getGestureHandler(): GestureHandlerAccessor;

//# sourceMappingURL=gestureState.d.ts.map