export interface WorkletsState {
	enabled: boolean;
	Worklets: any;
	useRunOnJS: any;
	useWorklet: any;
	createWorkletContextValue: any;
}
export declare function isWorkletsEnabled(): boolean;
export declare function getWorkletsState(): WorkletsState;
export declare function setWorkletsState(updates: Partial<WorkletsState>): void;

//# sourceMappingURL=workletsState.d.ts.map