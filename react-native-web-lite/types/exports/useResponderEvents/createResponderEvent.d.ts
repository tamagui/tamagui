import { TouchEvent } from './ResponderEventTypes';
import { ResponderTouchHistoryStore, TouchHistory } from './ResponderTouchHistoryStore';
export declare type ResponderEvent = {
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
export default function createResponderEvent(domEvent: any, responderTouchHistoryStore: ResponderTouchHistoryStore): ResponderEvent;
//# sourceMappingURL=createResponderEvent.d.ts.map