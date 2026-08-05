import type { ComponentContextI, DebugProp, TamaguiInternalConfig, UseMediaState, WidthHeight } from '../types';
export declare const configureMedia: (config: TamaguiInternalConfig) => void;
export declare function setupMediaListeners(): void;
export declare function updateMediaListeners(): void;
type MediaState = {
    enabled?: boolean;
    keys?: Set<string> | null;
};
export declare function setMediaShouldUpdate(ref: any, enabled?: boolean, keys?: MediaState['keys'], optimizeForFirstRender?: boolean): void;
export declare function useMedia(componentContext?: ComponentContextI, debug?: DebugProp, uid?: object): UseMediaState;
export declare function _disableMediaTouch(val: boolean): void;
export declare function getMediaState(mediaGroups: Set<string>, layout: WidthHeight): Record<string, boolean>;
export declare function mediaKeyToQuery(key: string): string;
export declare function mediaKeyMatch(key: string, dimensions: {
    width: number;
    height: number;
}): boolean;
export {};
//# sourceMappingURL=useMedia.d.ts.map