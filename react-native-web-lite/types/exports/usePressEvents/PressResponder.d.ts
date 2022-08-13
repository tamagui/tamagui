/// <reference types="node" />
declare type ClickEvent = any;
declare type KeyboardEvent = any;
declare type ResponderEvent = any;
export declare type PressResponderConfig = {
    cancelable?: boolean | null;
    disabled?: boolean | null;
    delayLongPress?: number | null;
    delayPressStart?: number | null;
    delayPressEnd?: number | null;
    onLongPress?: ((event: ResponderEvent) => void) | null;
    onPress?: ((event: ClickEvent) => void) | null;
    onPressChange?: ((event: ResponderEvent) => void) | null;
    onPressStart?: ((event: ResponderEvent) => void) | null;
    onPressMove?: ((event: ResponderEvent) => void) | null;
    onPressEnd?: ((event: ResponderEvent) => void) | null;
};
export declare type EventHandlers = {
    onClick: (event: ClickEvent) => void;
    onContextMenu: (event: ClickEvent) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onResponderGrant: (event: ResponderEvent) => void;
    onResponderMove: (event: ResponderEvent) => void;
    onResponderRelease: (event: ResponderEvent) => void;
    onResponderTerminate: (event: ResponderEvent) => void;
    onResponderTerminationRequest: (event: ResponderEvent) => boolean;
    onStartShouldSetResponder: (event: ResponderEvent) => boolean;
};
declare type TouchState = 'NOT_RESPONDER' | 'RESPONDER_INACTIVE_PRESS_START' | 'RESPONDER_ACTIVE_PRESS_START' | 'RESPONDER_ACTIVE_LONG_PRESS_START' | 'ERROR';
declare type TouchSignal = 'DELAY' | 'RESPONDER_GRANT' | 'RESPONDER_RELEASE' | 'RESPONDER_TERMINATED' | 'LONG_PRESS_DETECTED';
declare type TimeoutID = NodeJS.Timer | null;
export default class PressResponder {
    _config: PressResponderConfig;
    _eventHandlers?: EventHandlers | null;
    _isPointerTouch?: boolean;
    _longPressDelayTimeout?: TimeoutID;
    _longPressDispatched?: boolean;
    _pressDelayTimeout?: TimeoutID;
    _pressOutDelayTimeout?: TimeoutID;
    _selectionTerminated?: boolean;
    _touchActivatePosition?: {
        pageX: number;
        pageY: number;
    } | null;
    _touchState: TouchState;
    constructor(config: PressResponderConfig);
    configure(config: PressResponderConfig): void;
    reset(): void;
    getEventHandlers(): EventHandlers;
    _createEventHandlers(): EventHandlers;
    _receiveSignal(signal: TouchSignal, event: ResponderEvent): void;
    _performTransitionSideEffects(prevState: TouchState, nextState: TouchState, signal: TouchSignal, event: ResponderEvent): void;
    _activate(event: ResponderEvent): void;
    _deactivate(event: ResponderEvent): void;
    _handleLongPress(event: ResponderEvent): void;
    _cancelLongPressDelayTimeout(): void;
    _cancelPressDelayTimeout(): void;
    _cancelPressOutDelayTimeout(): void;
}
export {};
//# sourceMappingURL=PressResponder.d.ts.map