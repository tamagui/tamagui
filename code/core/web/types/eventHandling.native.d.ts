/**
 * Native event handling - uses RNGH when available, falls back to usePressability
 */
import type { StaticConfig, TamaguiComponentStateRef } from './types';
export declare function getWebEvents(): {};
export declare function useEvents(events: any, viewProps: any, stateRef: {
    current: TamaguiComponentStateRef;
}, staticConfig: StaticConfig, isHOC?: boolean): any;
export declare function wrapWithGestureDetector(content: any, gesture: any, stateRef: {
    current: TamaguiComponentStateRef;
}, isHOC?: boolean): any;
//# sourceMappingURL=eventHandling.native.d.ts.map