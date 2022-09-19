import { ResponseSync } from '../ResponseSync.js';
/**
 * Fetch a URL for use in a client component Suspense boundary.
 */
export declare function fetchSync(url: string, options?: RequestInit): ResponseSync;
/**
 * Preload a URL for use in  a client component Suspense boundary.
 * Useful for placing higher in the tree to avoid waterfalls.
 */
export declare function preload(url: string, options?: RequestInit): void;
//# sourceMappingURL=fetchSync.d.ts.map