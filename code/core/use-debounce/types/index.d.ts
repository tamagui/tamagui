type DebounceSettings = {
    leading?: boolean;
};
export declare function debounce<A extends Function>(func: A, wait?: number, leading?: boolean): A & {
    cancel: () => void;
};
export declare function useDebounce<A extends (...args: any) => any | undefined | null, DebouncedFn extends A & {
    cancel: () => void;
}>(fn: A, wait: number, options?: DebounceSettings, mountArgs?: any[]): DebouncedFn;
/**
 * Returns a value once it stops changing after "amt" time.
 * Note: you may need to memo or this will keep re-rendering
 */
export declare function useDebounceValue<A>(val: A, amt?: number): A;
export {};
//# sourceMappingURL=index.d.ts.map