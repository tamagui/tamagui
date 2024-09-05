/**
 * Copyright (c) Nicolas Gallagher
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { ResponderTouchHistoryStore, TouchHistory } from './ResponderTouchHistoryStore';
export type ResponderEvent = {
    bubbles: boolean;
    cancelable: boolean;
    currentTarget: any;
    defaultPrevented: boolean | null;
    dispatchConfig: {
        registrationName?: string;
        phasedRegistrationNames?: {
            bubbled: string;
            captured: string;
        };
    };
    eventPhase: number | null;
    isDefaultPrevented: () => boolean;
    isPropagationStopped: () => boolean;
    isTrusted: boolean | null;
    preventDefault: () => void;
    stopPropagation: () => void;
    nativeEvent: TouchEvent;
    persist: () => void;
    target: any | null;
    timeStamp: number;
    touchHistory: TouchHistory;
};
/**
 * Converts a native DOM event to a ResponderEvent.
 * Mouse events are transformed into fake touch events.
 */
export default function createResponderEvent(domEvent: any, responderTouchHistoryStore: ResponderTouchHistoryStore): ResponderEvent;
//# sourceMappingURL=createResponderEvent.d.ts.map