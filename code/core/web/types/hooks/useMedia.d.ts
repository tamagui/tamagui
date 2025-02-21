import type { ComponentContextI, DebugProp, IsMediaType, LayoutEvent, MediaQueries, MediaQueryObject, MediaQueryState, TamaguiInternalConfig, UseMediaState } from '../types';
export declare let mediaState: MediaQueryState;
export declare const mediaQueryConfig: MediaQueries;
export declare const getMedia: () => MediaQueryState;
export declare const mediaKeys: Set<string>;
export declare const isMediaKey: (key: string) => IsMediaType;
export declare const getMediaKeyImportance: (key: string) => number;
export declare const configureMedia: (config: TamaguiInternalConfig) => void;
export declare function setupMediaListeners(): void;
export declare function updateMediaListeners(): void;
type MediaState = {
    enabled?: boolean;
    keys?: Set<string> | null;
};
export declare function setMediaShouldUpdate(ref: any, enabled?: boolean, keys?: MediaState['keys']): void;
export declare function useMedia(cc?: ComponentContextI, debug?: DebugProp): UseMediaState;
export declare function _disableMediaTouch(val: boolean): void;
export declare function getMediaState(mediaGroups: Set<string>, layout: LayoutEvent['nativeEvent']['layout']): Record<string, boolean>;
export declare const getMediaImportanceIfMoreImportant: (mediaKey: string, key: string, importancesUsed: Record<string, number>, isSizeMedia: boolean) => number | null;
export declare function mediaObjectToString(query: string | MediaQueryObject, key?: string): string;
export declare function mediaKeyToQuery(key: string): string;
export declare function mediaKeyMatch(key: string, dimensions: {
    width: number;
    height: number;
}): boolean;
//# sourceMappingURL=useMedia.d.ts.map