/**
 * Native event handling - uses RNGH when available, falls back to usePressability.
 * On TV platforms (Apple TV / Android TV), RNGH gestures are bypassed because TV
 * remote button presses don't go through the touch event system. Instead, the native
 * responder system (usePressability) is used, and RN 0.84+ TV-specific events
 * (onPressEnter / onPressLeave) are mapped to Tamagui's press callbacks.
 */
import type { StaticConfig, TamaguiComponentStateRef } from './types';
export declare function getWebEvents(): {};
export declare function useEvents(events: any, viewProps: any, stateRef: {
    current: TamaguiComponentStateRef;
}, staticConfig: StaticConfig, isHOC?: boolean, isInsideNativeMenu?: boolean): any;
export declare function wrapWithGestureDetector(content: any, gesture: any, stateRef: {
    current: TamaguiComponentStateRef;
}, isHOC?: boolean): any;
//# sourceMappingURL=eventHandling.native.d.ts.map