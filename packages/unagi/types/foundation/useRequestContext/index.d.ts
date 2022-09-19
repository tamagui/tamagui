declare type ScopedContext = Record<string, any>;
/**
 * Provides access to the current request context.
 * @param scope - An optional string used to scope the request context. It is recommended to
 * prevent modifying the properties added by other plugins.
 * @returns A request-scoped object that can be modified to provide and consume information
 * across different React components in the tree.
 * @example
 * ```js
 * import {useRequestContext} from '@shopify/unagi';
 * useRequestContext('my-plugin-name');
 * ```
 */
export declare function useRequestContext<T extends ScopedContext>(scope?: string): T;
export {};
//# sourceMappingURL=index.d.ts.map