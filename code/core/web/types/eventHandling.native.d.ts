/**
 * Native event handling - uses RNGH when available, falls back to usePressability.
 * On TV platforms (Apple TV / Android TV), RNGH gestures are bypassed because TV
 * remote button presses don't go through the touch event system. Instead, the native
 * responder system (usePressability) handles all press events on TV.
 * TV focus navigation (onFocus/onBlur) is enabled by explicitly setting
 * focusable={true} (required by both tvOS and Android TV) and, for Android TV only,
 * collapsable={false} (prevents Android from flattening views out of the native
 * hierarchy). collapsable is intentionally NOT set on tvOS because it is an
 * Android-only prop at the native Fabric level — setting it on iOS/tvOS causes
 * the Fabric setter to be undefined, crashing with "TypeError: undefined is not
 * a function" at app launch.
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