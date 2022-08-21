/// <reference types="node" />
declare const requestIdleCallback: (((callback: IdleRequestCallback, options?: IdleRequestOptions | undefined) => number) & typeof globalThis.requestIdleCallback) | ((cb: Function, options?: Object) => NodeJS.Timeout);
declare const cancelIdleCallback: ((handle: number) => void) & typeof globalThis.cancelIdleCallback;
export default requestIdleCallback;
export { cancelIdleCallback };
//# sourceMappingURL=index.d.ts.map