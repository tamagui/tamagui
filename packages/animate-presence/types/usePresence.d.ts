import { AnimatePresenceContextProps } from './AnimatePresenceContext';
export declare type SafeToRemove = () => void;
declare type AlreadyPresent = [undefined];
declare type Entering = [true];
declare type Leaving = [false, SafeToRemove];
export declare function useEntering(): Entering | Leaving | AlreadyPresent;
export declare function useIsEntering(): boolean | undefined;
export declare function isEntering(context: AnimatePresenceContextProps | null): boolean | undefined;
export {};
//# sourceMappingURL=usePresence.d.ts.map