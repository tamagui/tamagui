import { PresenceContextProps } from './PresenceContext';
export declare type SafeToRemove = () => void;
declare type AlwaysPresent = [true, null];
declare type Present = [true];
declare type NotPresent = [false, SafeToRemove];
export declare function usePresence(): AlwaysPresent | Present | NotPresent;
/**
 * Similar to `usePresence`, except `useIsPresent` simply returns whether or not the component is present.
 * There is no `safeToRemove` function.
 */
export declare function useIsPresent(): boolean;
export declare function isPresent(context: PresenceContextProps | null): boolean;
export {};
//# sourceMappingURL=usePresence.d.ts.map