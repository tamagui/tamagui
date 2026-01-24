/**
 * Native event handling - uses RNGH when available, falls back to usePressability
 */
import type { TamaguiComponentStateRef } from './types';
export declare function getWebEvents(): {};
export declare function usePressHandling(events: any, viewProps: any, stateRef: {
    current: TamaguiComponentStateRef;
}): any;
export declare function wrapWithGestureDetector(content: any, gesture: any, stateRef: {
    current: TamaguiComponentStateRef;
}): any;
//# sourceMappingURL=eventHandling.native.d.ts.map