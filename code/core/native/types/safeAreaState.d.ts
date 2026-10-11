import type { SafeAreaState, SafeAreaInsets, SafeAreaFrame } from "./types";
export interface SafeAreaAccessor {
	readonly didSetup: boolean;
	readonly isEnabled: boolean;
	readonly state: SafeAreaState;
	set(updates: Partial<SafeAreaState>): void;
	subscribe(listener: () => void): () => void;
	/** get the current insets snapshot */
	getInsets(): SafeAreaInsets;
	/** get the current frame snapshot */
	getFrame(): SafeAreaFrame;
}
export declare function getSafeArea(): SafeAreaAccessor;
export declare function hasSafeAreaSetup(): boolean;

//# sourceMappingURL=safeAreaState.d.ts.map