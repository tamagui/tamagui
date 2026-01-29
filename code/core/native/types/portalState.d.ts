import type { NativePortalState } from "./types";
export interface PortalAccessor {
	readonly isEnabled: boolean;
	readonly state: NativePortalState;
	set(newState: NativePortalState): void;
}
export declare function getPortal(): PortalAccessor;

//# sourceMappingURL=portalState.d.ts.map