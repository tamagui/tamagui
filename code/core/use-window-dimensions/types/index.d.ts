/**
 * SSR safe useWindowDimensions
 */
type Size = {
    width: number;
    height: number;
};
export declare function configureInitialWindowDimensions(next: Size): void;
export declare function useWindowDimensions({ serverValue, }?: {
    serverValue?: Size;
}): Size;
export {};
//# sourceMappingURL=index.d.ts.map