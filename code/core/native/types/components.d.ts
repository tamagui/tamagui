import type { ReactNode } from "react";
import type { NativePortalProps, NativePortalHostProps, NativePortalProviderProps } from "./types";
export type { NativePortalProps, NativePortalHostProps, NativePortalProviderProps };
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