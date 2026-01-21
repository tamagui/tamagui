export type NativePortalState = {
	enabled: boolean;
	type: "teleport" | "legacy" | null;
};
export declare function setNativePortalState(newState: NativePortalState);
export declare function getNativePortalState(): NativePortalState;

//# sourceMappingURL=state.d.ts.map