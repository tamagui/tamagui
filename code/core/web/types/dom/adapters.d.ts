import type { DOMChangeEvent, DOMClickEvent, DOMImageErrorEvent, DOMImageLoadEvent, DOMInputEvent, DOMKeyEvent } from '@tamagui/dom';
/** the shape react native reports for a press */
type PressEvent = {
    nativeEvent: {
        pageX?: number;
        pageY?: number;
    };
};
/** the shape react native reports for text entry and key presses */
type TextEvent = {
    nativeEvent: {
        text?: string;
        key?: string;
    };
};
type ImageEvent = {
    nativeEvent: {
        source?: {
            width?: number;
            height?: number;
        };
    };
};
/**
 * A press carries no modifier keys, no mouse button and nothing to cancel, so
 * those fields are the values a primary-button click would have on web and the
 * two cancel methods do nothing. `compatibility.ts` records this.
 */
export declare const clickFromPress: (onClick: (event: DOMClickEvent) => void) => (event: PressEvent) => void;
export declare const changeFromText: (onChange: (event: DOMChangeEvent) => void) => (event: TextEvent) => void;
export declare const inputFromText: (onInput: (event: DOMInputEvent) => void) => (event: TextEvent) => void;
/** react native reports the key that was pressed, and reports submit as Enter */
export declare const keyFromKeyPress: (onKeyDown: (event: DOMKeyEvent) => void) => (event: TextEvent) => void;
export declare const loadFromImage: (onLoad: (event: DOMImageLoadEvent) => void) => (event: ImageEvent) => void;
export declare const errorFromImage: (onError: (event: DOMImageErrorEvent) => void) => () => void;
/**
 * Both text-entry change events come from the one react native `onChange`, so
 * they combine into a single handler rather than each wrapping the other.
 */
export declare const textEntryChange: (onChange: ((event: DOMChangeEvent) => void) | undefined, onInput: ((event: DOMInputEvent) => void) | undefined) => ((event: TextEvent) => void) | undefined;
export {};
//# sourceMappingURL=adapters.d.ts.map