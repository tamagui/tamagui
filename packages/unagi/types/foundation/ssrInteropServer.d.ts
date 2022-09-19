/**
 * See ssrInterop for context!
 */
import type { UnagiRequest } from './UnagiRequest/UnagiRequest.server.js';
declare type ServerGetter<T> = (request: UnagiRequest) => T;
export declare const META_ENV_SSR: boolean;
export declare function useEnvContext<T>(serverGetter: ServerGetter<T>, clientFallback?: any): T;
export {};
//# sourceMappingURL=ssrInteropServer.d.ts.map