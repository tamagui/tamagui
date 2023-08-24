import type { MediaQueries, MediaQueryKey, MediaQueryObject, MediaQueryState, TamaguiInternalConfig } from '../types';
export declare let mediaState: MediaQueryState;
export declare const mediaQueryConfig: MediaQueries;
export declare const getMedia: () => MediaQueryState;
export declare const mediaKeys: Set<string>;
export declare const isMediaKey: (key: string) => boolean;
export declare const getInitialMediaState: () => MediaQueryState;
export declare const getMediaKeyImportance: (key: string) => number;
export declare const configureMedia: (config: TamaguiInternalConfig) => void;
export declare function setupMediaListeners(): void;
export declare function useMediaListeners(config: TamaguiInternalConfig): void;
type UseMediaState = {
    [key in MediaQueryKey]: boolean;
};
type UpdateState = {
    enabled: boolean;
    keys: MediaQueryKey[];
};
export declare function setMediaShouldUpdate(ref: any, props: UpdateState): WeakMap<any, UpdateState>;
export declare function useMedia(uid?: any): UseMediaState;
/**
 *
 * @deprecated use useProps instead which is the same but also expands shorthands (which you can disable)
 *
 * Useful for more complex components that need access to the currently active props,
 * accounting for the currently active media queries.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries.
 *
 * */
export declare function useMediaPropsActive<A extends Object>(props: A, opts?: {
    expandShorthands?: boolean;
}): {
    [Key in keyof A extends `$${string}` ? never : keyof A]?: A[Key];
};
export declare const getMediaImportanceIfMoreImportant: (mediaKey: string, key: string, importancesUsed: Record<string, number>, isSizeMedia: boolean) => number | null;
export declare function mergeMediaByImportance(onto: Record<string, any>, mediaKey: string, key: string, value: any, importancesUsed: Record<string, number>, isSizeMedia: boolean, importanceBump?: number): boolean;
export declare function mediaObjectToString(query: string | MediaQueryObject, key?: string): string;
export declare function mediaKeyToQuery(key: string): string;
export declare function mediaKeyMatch(key: string, dimensions: {
    width: number;
    height: number;
}): boolean;
export {};
//# sourceMappingURL=useMedia.d.ts.map