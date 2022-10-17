/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
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
declare enum States {
    DELAY = 0,
    ERROR = 1,
    LONG_PRESS_DETECTED = 2,
    NOT_RESPONDER = 3,
    RESPONDER_ACTIVE_LONG_PRESS_START = 4,
    RESPONDER_ACTIVE_PRESS_START = 5,
    RESPONDER_INACTIVE_PRESS_START = 6,
    RESPONDER_GRANT = 7,
    RESPONDER_RELEASE = 8,
    RESPONDER_TERMINATED = 9
}
declare type TouchState = States.NOT_RESPONDER | States.RESPONDER_INACTIVE_PRESS_START | States.RESPONDER_ACTIVE_PRESS_START | States.RESPONDER_ACTIVE_LONG_PRESS_START | States.ERROR;
declare type TouchSignal = States.DELAY | States.RESPONDER_GRANT | States.RESPONDER_RELEASE | States.RESPONDER_TERMINATED | States.LONG_PRESS_DETECTED;
declare type TimeoutID = NodeJS.Timer | null;
export declare class PressResponder {
    _config: PressResponderConfig;
    _eventHandlers?: EventHandlers | null;
    _isPointerTouch?: boolean;
    _longPDT?: TimeoutID;
    _longPressDispatched?: boolean;
    _pDT?: TimeoutID;
    _pODT?: TimeoutID;
    _selectionTerminated?: boolean;
    _touchActivatePosition?: {
        pageX: number;
        pageY: number;
    } | null;
    _touchState: TouchState;
    constructor(config: PressResponderConfig);
    configure(config: PressResponderConfig): void;
    /**
     * Resets any pending timers. This should be called on unmount.
     */
    reset(): void;
    /**
     * Returns a set of props to spread into the interactive element.
     */
    getEventHandlers(): EventHandlers;
    _createHandlers(): EventHandlers;
    /**
     * Receives a state machine signal, performs side effects of the transition
     * and stores the new state. Validates the transition as well.
     */
    _receiveSignal(signal: TouchSignal, event: ResponderEvent): void;
    /**
     * Performs a transition between touchable states and identify any activations
     * or deactivations (and callback invocations).
     */
    _sideEff(prevState: TouchState, nextState: TouchState, signal: TouchSignal, event: ResponderEvent): void;
    _activate(event: ResponderEvent): void;
    _deactivate(event: ResponderEvent): void;
    _handleLongPress(event: ResponderEvent): void;
    _cancelLongPDT(): void;
    _cancelPDT(): void;
    _cancelPODT(): void;
}
export {};
//# sourceMappingURL=PressResponder.d.ts.map