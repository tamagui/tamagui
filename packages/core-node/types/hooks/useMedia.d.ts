import { MediaQueries, MediaQueryKey, MediaQueryObject, MediaQueryState, TamaguiInternalConfig } from '../types';
export declare const mediaState: MediaQueryState;
declare type MediaListener = (next: boolean) => void;
export declare function addMediaQueryListener(key: MediaQueryKey, cb: MediaListener): () => void;
export declare function removeMediaQueryListener(key: MediaQueryKey, cb: MediaListener): void;
export declare const mediaQueryConfig: MediaQueries;
export declare const getMedia: () => MediaQueryState;
export declare const configureMedia: (config: TamaguiInternalConfig) => void;
export declare const getInitialMediaState: () => MediaQueryState | null;
export declare function useMediaQueryListeners(config: TamaguiInternalConfig): void;
export declare function useMedia(): {
    [key in MediaQueryKey]: boolean;
};
export declare function mediaObjectToString(query: string | MediaQueryObject): string;
export {};
//# sourceMappingURL=useMedia.d.ts.map