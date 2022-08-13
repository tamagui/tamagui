declare type State = {
    isTouching: boolean;
    lastMomentumScrollBeginTime: number;
    lastMomentumScrollEndTime: number;
    observedScrollSinceBecomingResponder: boolean;
    becameResponderWhileAnimating: boolean;
};
declare type Event = Object;
declare const ScrollResponder: {
    Mixin: {
        scrollResponderMixinGetInitialState: () => State;
        scrollResponderHandleScrollShouldSetResponder: () => boolean;
        scrollResponderHandleStartShouldSetResponder: () => boolean;
        scrollResponderHandleStartShouldSetResponderCapture: (e: Event) => boolean;
        scrollResponderHandleResponderReject: () => void;
        scrollResponderHandleTerminationRequest: () => boolean;
        scrollResponderHandleTouchEnd: (e: Event) => void;
        scrollResponderHandleResponderRelease: (e: Event) => void;
        scrollResponderHandleScroll: (e: Event) => void;
        scrollResponderHandleResponderGrant: (e: Event) => void;
        scrollResponderHandleScrollBeginDrag: (e: Event) => void;
        scrollResponderHandleScrollEndDrag: (e: Event) => void;
        scrollResponderHandleMomentumScrollBegin: (e: Event) => void;
        scrollResponderHandleMomentumScrollEnd: (e: Event) => void;
        scrollResponderHandleTouchStart: (e: Event) => void;
        scrollResponderHandleTouchMove: (e: Event) => void;
        scrollResponderIsAnimating: () => boolean;
        scrollResponderGetScrollableNode: () => any;
        scrollResponderScrollTo: (x?: number | {
            x?: number | undefined;
            y?: number | undefined;
            animated?: boolean | undefined;
        } | undefined, y?: number, animated?: boolean) => void;
        scrollResponderZoomTo: (rect: {
            x: number;
            y: number;
            width: number;
            height: number;
            animated?: boolean | undefined;
        }, animated?: boolean) => void;
        scrollResponderFlashScrollIndicators: () => void;
        scrollResponderScrollNativeHandleToKeyboard: (nodeHandle: any, additionalOffset?: number, preventNegativeScrollOffset?: boolean) => void;
        scrollResponderInputMeasureAndScrollToKeyboard: (left: number, top: number, width: number, height: number) => void;
        scrollResponderTextInputFocusError: (e: Event) => void;
        UNSAFE_componentWillMount: () => void;
        scrollResponderKeyboardWillShow: (e: Event) => void;
        scrollResponderKeyboardWillHide: (e: Event) => void;
        scrollResponderKeyboardDidShow: (e: Event) => void;
        scrollResponderKeyboardDidHide: (e: Event) => void;
    };
};
export default ScrollResponder;
//# sourceMappingURL=index.d.ts.map