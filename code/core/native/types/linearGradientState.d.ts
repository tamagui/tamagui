import type { LinearGradientState } from "./types";
export interface LinearGradientAccessor {
	readonly isEnabled: boolean;
	readonly state: LinearGradientState;
	set(newState: LinearGradientState): void;
}
export declare function getLinearGradient(): LinearGradientAccessor;

//# sourceMappingURL=linearGradientState.d.ts.map