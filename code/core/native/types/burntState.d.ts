import type { BurntState } from "./types.js";
export interface BurntAccessor {
	readonly isEnabled: boolean;
	readonly state: BurntState;
	set(newState: BurntState): void;
}
export declare function getBurnt(): BurntAccessor;

//# sourceMappingURL=burntState.d.ts.map