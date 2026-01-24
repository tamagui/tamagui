import type { WorkletsState } from "./types";
export interface WorkletsAccessor {
	readonly isEnabled: boolean;
	readonly state: WorkletsState;
	set(updates: Partial<WorkletsState>): void;
}
export declare function getWorklets(): WorkletsAccessor;

//# sourceMappingURL=workletsState.d.ts.map