import type { ReactNode } from "react";
export type NativePortalProps = {
	hostName?: string;
	children: ReactNode;
};
export type NativePortalHostProps = {
	name: string;
};
export type NativePortalProviderProps = {
	children: ReactNode;
};
/**
* Renders children into a teleport Portal when available.
* Returns null when teleport is not set up (allows fallback handling by caller).
*/
export declare function NativePortal({ hostName, children }: NativePortalProps): ReactNode;
/**
* Renders a teleport PortalHost when available.
* Returns null when teleport is not set up.
*/
export declare function NativePortalHost({ name }: NativePortalHostProps): ReactNode;
/**
* Wraps children with teleport PortalProvider when available.
* Returns children as-is when teleport is not set up.
*/
export declare function NativePortalProvider({ children }: NativePortalProviderProps): ReactNode;

//# sourceMappingURL=components.d.ts.map