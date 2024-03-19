import type { MatchMedia, MediaQueryList } from '../types';
export declare const matchMedia: (((query: string) => globalThis.MediaQueryList) & typeof globalThis.matchMedia) | typeof matchMediaFallback;
declare function matchMediaFallback(_: string): MediaQueryList;
export declare function setupMatchMedia(_: MatchMedia): void;
export {};
//# sourceMappingURL=matchMedia.d.ts.map