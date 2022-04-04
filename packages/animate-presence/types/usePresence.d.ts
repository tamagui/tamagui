import { AnimatePresenceContextProps } from './AnimatePresenceContext';
export declare type SafeToRemove = () => void;
declare type AlwaysPresent = [true, null];
declare type Present = [true];
declare type NotPresent = [false, SafeToRemove];
export declare function usePresence(): AlwaysPresent | Present | NotPresent;
export declare function useIsPresent(): boolean;
export declare function isPresent(context: AnimatePresenceContextProps | null): boolean;
export {};
//# sourceMappingURL=usePresence.d.ts.map