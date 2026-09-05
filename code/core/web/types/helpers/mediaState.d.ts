import type { MediaQueries, MediaQueryState } from '../types';
export declare let mediaState: MediaQueryState;
export declare const setMediaState: (next: MediaQueryState) => void;
export declare const mediaQueryConfig: MediaQueries;
export declare const getMedia: () => MediaQueryState;
export declare const mediaKeys: Set<string>;
export declare function mediaKeyMatch(key: string, dimensions: {
    width: number;
    height: number;
}): boolean;
//# sourceMappingURL=mediaState.d.ts.map