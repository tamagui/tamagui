export declare const isWeb: boolean;
export declare const isSSR: boolean;
export declare const useIsomorphicLayoutEffect: (effect: () => void | (() => void), deps?: any[]) => void;
declare type WindowSize = [number, number];
export declare function useWindowSize({ adjust, }?: {
    adjust?: (x: WindowSize) => WindowSize;
}): WindowSize;
export {};
//# sourceMappingURL=index.d.ts.map