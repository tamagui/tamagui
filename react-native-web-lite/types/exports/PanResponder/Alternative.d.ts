declare type PressEvent = any;
export declare type GestureState = {
    stateID: number;
    x: number;
    y: number;
    initialX: number;
    initialY: number;
    deltaX: number;
    deltaY: number;
    velocityX: number;
    velocityY: number;
    numberActiveTouches: number;
    _accountsForMovesUpTo: number;
};
declare type ActiveCallback = (event: PressEvent, gestureState: GestureState) => boolean;
declare type PassiveCallback = (event: PressEvent, gestureState: GestureState) => void;
declare type PanResponderConfig = {
    readonly onMoveShouldSetResponder?: ActiveCallback | null;
    readonly onMoveShouldSetResponderCapture?: ActiveCallback | null;
    readonly onStartShouldSetResponder?: ActiveCallback | null;
    readonly onStartShouldSetResponderCapture?: ActiveCallback | null;
    readonly onPanTerminationRequest?: ActiveCallback | null;
    readonly onPanGrant?: PassiveCallback | null;
    readonly onPanReject?: PassiveCallback | null;
    readonly onPanStart?: PassiveCallback | null;
    readonly onPanMove?: PassiveCallback | null;
    readonly onPanEnd?: PassiveCallback | null;
    readonly onPanRelease?: PassiveCallback | null;
    readonly onPanTerminate?: PassiveCallback | null;
};
declare const PanResponder: {
    _initializeGestureState(gestureState: GestureState): void;
    _updateGestureStateOnMove(gestureState: GestureState, touchHistory: PressEvent['touchHistory']): void;
    create(config: PanResponderConfig): {
        getInteractionHandle: () => number | null;
        panHandlers: {
            onMoveShouldSetResponder: (event: PressEvent) => boolean;
            onMoveShouldSetResponderCapture: (event: PressEvent) => boolean;
            onResponderEnd: (event: PressEvent) => void;
            onResponderGrant: (event: PressEvent) => void;
            onResponderMove: (event: PressEvent) => void;
            onResponderReject: (event: PressEvent) => void;
            onResponderRelease: (event: PressEvent) => void;
            onResponderStart: (event: PressEvent) => void;
            onResponderTerminate: (event: PressEvent) => void;
            onResponderTerminationRequest: (event: PressEvent) => boolean;
            onStartShouldSetResponder: (event: PressEvent) => boolean;
            onStartShouldSetResponderCapture: (event: PressEvent) => boolean;
        };
    };
};
export default PanResponder;
//# sourceMappingURL=Alternative.d.ts.map