declare const _requestIdleCallback: (cb: Function, options?: object) => NodeJS.Timeout;
export declare const requestIdleCallback: typeof _requestIdleCallback | (((callback: IdleRequestCallback, options?: IdleRequestOptions) => number) & typeof globalThis.requestIdleCallback);
export declare const cancelIdleCallback: ((handle: number) => void) & typeof globalThis.cancelIdleCallback;
export {};
//# sourceMappingURL=index.d.ts.map