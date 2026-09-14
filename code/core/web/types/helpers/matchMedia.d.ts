import type { MatchMedia, MediaQueryList } from '../types';
export declare const matchMedia: typeof matchMediaFallback | (((query: string) => globalThis.MediaQueryList) & typeof globalThis.matchMedia);
declare function matchMediaFallback(_: string): MediaQueryList;
export declare function setupMatchMedia(_: MatchMedia): void;
export {};
//# sourceMappingURL=matchMedia.d.ts.map