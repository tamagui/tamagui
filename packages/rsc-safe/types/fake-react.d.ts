/// <reference types="react" />
import { createContext as _createContext } from './createContext';
export declare const useRef: <T>(value: T) => {
    current: T;
};
export declare const useState: <T>(value: T) => [T, (value: T) => void];
export declare const useEffect: (callback: () => void, deps?: any[]) => any;
export declare const useMemo: <T, D>(callback: () => T, deps: import("react").DependencyList) => T;
export declare const useContext: <T>(context: import("react").Context<T>) => T;
export declare const createContext: typeof _createContext;
export declare const useSyncExternalStore: (a: any, b: any, c: any) => {};
//# sourceMappingURL=fake-react.d.ts.map