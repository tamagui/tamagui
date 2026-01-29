import type { SafeAreaState, SafeAreaInsets, SafeAreaFrame } from "./types";
export interface SafeAreaAccessor {
	readonly isEnabled: boolean;
	readonly state: SafeAreaState;
	set(updates: Partial<SafeAreaState>): void;
	/** Get initial insets (non-reactive, for style resolution) */
	getInsets(): SafeAreaInsets;
	/** Get initial frame (non-reactive) */
	getFrame(): SafeAreaFrame;
}
export declare function getSafeArea(): SafeAreaAccessor;

//# sourceMappingURL=safeAreaState.d.ts.map