import type { UnagiRequest } from './UnagiRequest/UnagiRequest.server.js';
export declare const META_ENV_SSR = false;
declare type ServerGetter<T> = (request: UnagiRequest) => T;
export declare function useEnvContext<T>(serverGetter: ServerGetter<T>, clientFallback?: any): T;
export {};
//# sourceMappingURL=ssrInterop.d.ts.map