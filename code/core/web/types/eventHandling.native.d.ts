/**
 * Native event handling - uses RNGH when available, falls back to responder system
 */
import type { StaticConfig, TamaguiComponentStateRef } from './types';
export declare function getWebEvents(): {};
export declare function useEvents(events: any, viewProps: any, stateRef: {
    current: TamaguiComponentStateRef;
}, staticConfig: StaticConfig, isHOC?: boolean, isInsideNativeMenu?: boolean, debugName?: string | null): any;
export declare function wrapWithGestureDetector(content: any, gesture: any, stateRef: {
    current: TamaguiComponentStateRef;
}, isHOC?: boolean, isCompositeComponent?: boolean): any;
//# sourceMappingURL=eventHandling.native.d.ts.map