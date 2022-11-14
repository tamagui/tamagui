import { MediaQueries, MediaQueryKey, MediaQueryObject, MediaQueryState, TamaguiInternalConfig } from '../types';
export declare const mediaState: MediaQueryState;
declare type MediaListener = (next: boolean) => void;
export declare function addMediaQueryListener(key: MediaQueryKey, cb: MediaListener): () => void;
export declare function removeMediaQueryListener(key: MediaQueryKey, cb: MediaListener): void;
export declare const mediaQueryConfig: MediaQueries;
export declare const getMedia: () => MediaQueryState;
export declare const getInitialMediaState: () => MediaQueryState;
export declare const getMediaKeyImportance: (key: string) => number;
export declare const configureMedia: (config: TamaguiInternalConfig) => void;
export declare function useMediaListeners(config: TamaguiInternalConfig): void;
export declare function useMedia(debug?: boolean): {
    [key in MediaQueryKey]: boolean;
};
/**
 * Useful for more complex components that need access to the currently active props,
 * accounting for the currently active media queries.
 *
 * Use sparingly, is will loop props and trigger re-render on all media queries.
 *
 * */
export declare function useMediaPropsActive<A extends Object>(props: A): {
    [Key in keyof A extends `$${string}` ? never : keyof A]?: A[Key];
};
export declare function mergeMediaByImportance(onto: Record<string, any>, key: string, value: any, importancesUsed: Record<string, number>): boolean;
export declare function mediaObjectToString(query: string | MediaQueryObject): string;
export {};
//# sourceMappingURL=useMedia.d.ts.map