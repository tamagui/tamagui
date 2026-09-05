export { mediaKeyMatch } from '../helpers/mediaState';
import type { ComponentContextI, DebugProp, TamaguiInternalConfig, UseMediaState, WidthHeight } from '../types';
export declare const configureMedia: (config: TamaguiInternalConfig) => void;
export declare function setupMediaListeners(): void;
/**
 * instrumentation for the media render-count fixture. `notified` counts
 * subscriber callbacks actually invoked, which is a different number from
 * committed React renders: a woken callback re-reads its snapshot and usually
 * bails out, and the native fast path can commit a style without a render.
 */
export declare const _mediaListenerStats: {
    publishes: number;
    notified: number;
};
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
//# sourceMappingURL=useMedia.d.ts.map