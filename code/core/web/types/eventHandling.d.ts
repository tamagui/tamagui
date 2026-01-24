/**
 * Web event handling - maps RN-style events to DOM events
 */
import type { TamaguiComponentEvents } from './interfaces/TamaguiComponentEvents';
type EventKeys = keyof TamaguiComponentEvents;
type EventLikeObject = {
    [key in EventKeys]?: any;
};
export declare function getWebEvents<E extends EventLikeObject>(events: E, webStyle?: boolean): {
    [x: string]: any;
    onMouseEnter: any;
    onMouseLeave: any;
    onMouseDown: any;
    onMouseUp: any;
    onTouchStart: any;
    onTouchEnd: any;
    onFocus: any;
    onBlur: any;
};
export declare function wrapWithGestureDetector(content: any, _gesture: any, _stateRef: {
    current: any;
}): any;
export declare function usePressHandling(_events: any, _viewProps: any, _stateRef: {
    current: any;
}): null;
export {};
//# sourceMappingURL=eventHandling.d.ts.map