type Cleanup = () => void;
type AsyncEffectCallback = (signal: AbortSignal, ...deps: any[]) => Promise<Cleanup | void> | void;
export declare function useAsyncEffect(cb: AsyncEffectCallback, deps?: any[]): void;
export declare function useAsyncLayoutEffect(cb: AsyncEffectCallback, deps?: any[]): void;
export declare function useAsyncEffectOfType(type: Function, cb: AsyncEffectCallback, deps?: any[]): void;
export {};

//# sourceMappingURL=useAsyncEffect.d.ts.map