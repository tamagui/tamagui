import type { ComponentContextI, IsMediaType, MediaQueries, MediaQueryObject, MediaQueryState, TamaguiInternalConfig, UseMediaState } from '../types';
export declare let mediaState: MediaQueryState;
export declare const mediaQueryConfig: MediaQueries;
export declare const getMedia: () => MediaQueryState;
export declare const mediaKeys: Set<string>;
export declare const isMediaKey: (key: string) => IsMediaType;
export declare const getMediaKeyImportance: (key: string) => number;
export declare const configureMedia: (config: TamaguiInternalConfig) => void;
export declare function setupMediaListeners(): void;
type MediaKeysState = {
    [key: string]: any;
};
type UpdateState = {
    enabled?: boolean;
    keys?: string[];
    prev: MediaKeysState;
    touched?: Set<string>;
};
export declare function setMediaShouldUpdate(ref: any, props: Partial<UpdateState>): WeakMap<any, UpdateState>;
export declare function useMedia(uidIn?: any, componentContext?: ComponentContextI): UseMediaState;
export declare const getMediaImportanceIfMoreImportant: (mediaKey: string, key: string, importancesUsed: Record<string, number>, isSizeMedia: boolean) => number | null;
export declare function mediaObjectToString(query: string | MediaQueryObject, key?: string): string;
export declare function mediaKeyToQuery(key: string): string;
export declare function mediaKeyMatch(key: string, dimensions: {
    width: number;
    height: number;
}): boolean;
export {};
//# sourceMappingURL=useMedia.d.ts.map