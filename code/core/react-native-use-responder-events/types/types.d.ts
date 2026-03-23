/**
 * Copyright (c) Nicolas Gallagher
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export type Touch = {
    force: number;
    identifier: number;
    locationX: any;
    locationY: any;
    pageX: number;
    pageY: number;
    target: any;
    timestamp: number;
};
export type TouchEvent = {
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    changedTouches: Array<Touch>;
    force: number;
    identifier: number;
    locationX: any;
    locationY: any;
    pageX: number;
    pageY: number;
    target: any;
    timestamp: number;
    touches: Array<Touch>;
};
export declare const BLUR = "blur";
export declare const CONTEXT_MENU = "contextmenu";
export declare const FOCUS_OUT = "focusout";
export declare const MOUSE_DOWN = "mousedown";
export declare const MOUSE_MOVE = "mousemove";
export declare const MOUSE_UP = "mouseup";
export declare const MOUSE_CANCEL = "dragstart";
export declare const TOUCH_START = "touchstart";
export declare const TOUCH_MOVE = "touchmove";
export declare const TOUCH_END = "touchend";
export declare const TOUCH_CANCEL = "touchcancel";
export declare const SCROLL = "scroll";
export declare const SELECT = "select";
export declare const SELECTION_CHANGE = "selectionchange";
export declare function isStartish(eventType: unknown): boolean;
export declare function isMoveish(eventType: unknown): boolean;
export declare function isEndish(eventType: unknown): boolean;
export declare function isCancelish(eventType: unknown): boolean;
export declare function isScroll(eventType: unknown): boolean;
export declare function isSelectionChange(eventType: unknown): boolean;
//# sourceMappingURL=types.d.ts.map