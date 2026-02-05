import type { ZeegoState } from "./types";
export interface ZeegoAccessor {
	readonly isEnabled: boolean;
	readonly state: ZeegoState;
	set(newState: ZeegoState): void;
}
export declare function getZeego(): ZeegoAccessor;

//# sourceMappingURL=zeegoState.d.ts.map