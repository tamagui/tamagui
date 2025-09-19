import type { ComponentContextI, DebugProp, GetStyleState, IsMediaType, MediaQueries, MediaQueryObject, MediaQueryState, TamaguiInternalConfig, UseMediaState, WidthHeight } from '../types';
export declare let mediaState: MediaQueryState;
export declare const mediaQueryConfig: MediaQueries;
export declare const getMedia: () => MediaQueryState;
export declare const mediaKeys: Set<string>;
export declare const isMediaKey: (key: string) => boolean;
export declare const getMediaKey: (key: string) => IsMediaType;
export declare const getMediaKeyImportance: (key: string) => number;
export declare const configureMedia: (config: TamaguiInternalConfig) => void;
export declare function setupMediaListeners(): void;
export declare function updateMediaListeners(): void;
type MediaState = {
    enabled?: boolean;
    keys?: Set<string> | null;
};
export declare function setMediaShouldUpdate(ref: any, enabled?: boolean, keys?: MediaState['keys']): void;
export declare function useMedia(componentContext?: ComponentContextI, debug?: DebugProp): UseMediaState;
export declare function _disableMediaTouch(val: boolean): void;
export declare function getMediaState(mediaGroups: Set<string>, layout: WidthHeight): Record<string, boolean>;
export declare const getMediaImportanceIfMoreImportant: (mediaKey: string, key: string, styleState: GetStyleState, isSizeMedia: boolean) => number | null;
export declare function mediaObjectToString(query: string | MediaQueryObject, key?: string): string;
export declare function mediaKeyToQuery(key: string): string;
export declare function mediaKeyMatch(key: string, dimensions: {
    width: number;
    height: number;
}): boolean;
export {};
//# sourceMappingURL=useMedia.d.ts.map