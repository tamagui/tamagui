import type { PresenceContextProps, UsePresenceResult } from "@tamagui/web";
export declare function usePresence(): UsePresenceResult;
/**
* Similar to `usePresence`, except `useIsPresent` simply returns whether or not the component is present.
* There is no `safeToRemove` function.
*/
export declare function useIsPresent(): boolean;
export declare function isPresent(context: PresenceContextProps | null): boolean;

//# sourceMappingURL=usePresence.d.ts.map