import { QueryKey } from '../types.js';
/**
 * Wrap the fetch promise in a way that React Suspense understands.
 * Essentially, keep throwing something until you have legit data.
 */
export declare function wrapPromise<T>(promise: Promise<T>): {
    read: () => T;
};
declare type Await<T> = T extends Promise<infer V> ? V : never;
export declare const suspendFunction: <Fn extends () => Promise<unknown>>(key: QueryKey, fn: Fn) => Await<ReturnType<Fn>>;
export declare const preloadFunction: (key: QueryKey, fn: () => Promise<unknown>) => unknown;
export {};
//# sourceMappingURL=suspense.d.ts.map