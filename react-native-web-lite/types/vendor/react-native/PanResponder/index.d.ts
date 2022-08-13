declare type PressEvent = any;
export declare type GestureState = {
    stateID: number;
    moveX: number;
    moveY: number;
    x0: number;
    y0: number;
    dx: number;
    dy: number;
    vx: number;
    vy: number;
    numberActiveTouches: number;
    _accountsForMovesUpTo: number;
};
declare type ActiveCallback = (event: PressEvent, gestureState: GestureState) => boolean;
declare type PassiveCallback = (event: PressEvent, gestureState: GestureState) => any;
declare type PanResponderConfig = {
    onMoveShouldSetPanResponder?: ActiveCallback | null;
    onMoveShouldSetPanResponderCapture?: ActiveCallback | null;
    onStartShouldSetPanResponder?: ActiveCallback | null;
    onStartShouldSetPanResponderCapture?: ActiveCallback | null;
    onPanResponderGrant?: (PassiveCallback | ActiveCallback) | null;
    onPanResponderReject?: PassiveCallback | null;
    onPanResponderStart?: PassiveCallback | null;
    onPanResponderEnd?: PassiveCallback | null;
    onPanResponderRelease?: PassiveCallback | null;
    onPanResponderMove?: PassiveCallback | null;
    onPanResponderTerminate?: PassiveCallback | null;
    onPanResponderTerminationRequest?: ActiveCallback | null;
    onShouldBlockNativeResponder?: ActiveCallback | null;
};
declare const PanResponder: {
    _initializeGestureState(gestureState: GestureState): void;
    _updateGestureStateOnMove(gestureState: GestureState, touchHistory: PressEvent['touchHistory']): void;
    create(config: PanResponderConfig): {
        getInteractionHandle: () => number | null;
        panHandlers: {
            onClickCapture: (event: any) => void;
            onMoveShouldSetResponder: (event: PressEvent) => boolean;
            onMoveShouldSetResponderCapture: (event: PressEvent) => boolean;
            onResponderEnd: (event: PressEvent) => void;
            onResponderGrant: (event: PressEvent) => boolean;
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
export declare type PanResponderInstance = any;
export default PanResponder;
//# sourceMappingURL=index.d.ts.map