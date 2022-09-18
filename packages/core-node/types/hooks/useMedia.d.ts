import { MediaQueries, MediaQueryKey, MediaQueryObject, MediaQueryState, TamaguiInternalConfig } from '../types';
export declare const mediaState: MediaQueryState;
export declare function addMediaQueryListener(key: MediaQueryKey, cb: any): () => void;
export declare function removeMediaQueryListener(key: MediaQueryKey, cb: any): void;
export declare const mediaQueryConfig: MediaQueries;
export declare const getMedia: () => MediaQueryState;
export declare const configureMedia: (config: TamaguiInternalConfig) => void;
export declare function useMediaQueryListeners(config: TamaguiInternalConfig): void;
export declare function useMedia(): {
    [key in MediaQueryKey]: boolean;
};
export declare function mediaObjectToString(query: string | MediaQueryObject): string;
//# sourceMappingURL=useMedia.d.ts.map