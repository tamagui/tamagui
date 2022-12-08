import { MatchMedia, MediaQueryList } from '../types';
export declare const matchMedia: (((query: string) => globalThis.MediaQueryList) & typeof globalThis.matchMedia) | typeof matchMediaFallback;
declare function matchMediaFallback(query: string): MediaQueryList;
export declare function setupMatchMedia(nativeMatchMedia: MatchMedia): void;
export {};
//# sourceMappingURL=matchMedia.d.ts.map