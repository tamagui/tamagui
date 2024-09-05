/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
/**
 * =========================== PressResponder Tutorial ===========================
 *
 * The `PressResponder` class helps you create press interactions by analyzing the
 * geometry of elements and observing when another responder (e.g. ScrollView)
 * has stolen the touch lock. It offers hooks for your component to provide
 * interaction feedback to the user:
 *
 * - When a press has activated (e.g. highlight an element)
 * - When a press has deactivated (e.g. un-highlight an element)
 * - When a press sould trigger an action, meaning it activated and deactivated
 *   while within the geometry of the element without the lock being stolen.
 *
 * A high quality interaction isn't as simple as you might think. There should
 * be a slight delay before activation. Moving your finger beyond an element's
 * bounds should trigger deactivation, but moving the same finger back within an
 * element's bounds should trigger reactivation.
 *
 * In order to use `PressResponder`, do the following:
 *
 *     const pressResponder = new PressResponder(config);
 *
 * 2. Choose the rendered component who should collect the press events. On that
 *    element, spread `pressability.getEventHandlers()` into its props.
 *
 *    return (
 *      <View {...this.state.pressResponder.getEventHandlers()} />
 *    );
 *
 * 3. Reset `PressResponder` when your component unmounts.
 *
 *    componentWillUnmount() {
 *      this.state.pressResponder.reset();
 *    }
 *
 * ==================== Implementation Details ====================
 *
 * `PressResponder` only assumes that there exists a `HitRect` node. The `PressRect`
 * is an abstract box that is extended beyond the `HitRect`.
 *
 * # Geometry
 *
 *  ┌────────────────────────┐
 *  │  ┌──────────────────┐  │ - Presses start anywhere within `HitRect`.
 *  │  │  ┌────────────┐  │  │
 *  │  │  │ VisualRect │  │  │
 *  │  │  └────────────┘  │  │ - When pressed down for sufficient amount of time
 *  │  │    HitRect       │  │   before letting up, `VisualRect` activates.
 *  │  └──────────────────┘  │
 *  │       Out Region   o   │
 *  └────────────────────│───┘
 *                       └────── When the press is released outside the `HitRect`,
 *                               the responder is NOT eligible for a "press".
 *
 * # State Machine
 *
 * ┌───────────────┐ ◀──── RESPONDER_RELEASE
 * │ NOT_RESPONDER │
 * └───┬───────────┘ ◀──── RESPONDER_TERMINATED
 *     │
 *     │ RESPONDER_GRANT (HitRect)
 *     │
 *     ▼
 * ┌─────────────────────┐          ┌───────────────────┐              ┌───────────────────┐
 * │ RESPONDER_INACTIVE_ │  DELAY   │ RESPONDER_ACTIVE_ │  T + DELAY   │ RESPONDER_ACTIVE_ │
 * │ PRESS_START         ├────────▶ │ PRESS_START       ├────────────▶ │ LONG_PRESS_START  │
 * └─────────────────────┘          └───────────────────┘              └───────────────────┘
 *
 * T + DELAY => LONG_PRESS_DELAY + DELAY
 *
 * Not drawn are the side effects of each transition. The most important side
 * effect is the invocation of `onLongPress`. Only when the browser produces a
 * `click` event is `onPress` invoked.
 */
export default class PressResponder {
    _touchActivatePosition: any;
    _pressDelayTimeout: any;
    _selectionTerminated: boolean;
    _isPointerTouch: boolean;
    _longPressDelayTimeout: any;
    _longPressDispatched: boolean;
    _pressOutDelayTimeout: any;
    _touchState: string;
    _config: any;
    _eventHandlers: any;
    constructor(config: any);
    configure(config: any): void;
    /**
     * Resets any pending timers. This should be called on unmount.
     */
    reset(): void;
    /**
     * Returns a set of props to spread into the interactive element.
     */
    getEventHandlers(): any;
    _createEventHandlers(): {
        onStartShouldSetResponder: (event: any) => boolean;
        onKeyDown: (event: any) => void;
        onResponderGrant: (event: any) => void;
        onResponderMove: (event: any) => void;
        onResponderRelease: (event: any) => void;
        onResponderTerminate: (event: any) => void;
        onResponderTerminationRequest: (event: any) => any;
        onClick: (event: any) => void;
        onContextMenu: (event: any) => void;
    };
    /**
     * Receives a state machine signal, performs side effects of the transition
     * and stores the new state. Validates the transition as well.
     */
    _receiveSignal(signal: any, event: any): void;
    /**
     * Performs a transition between touchable states and identify any activations
     * or deactivations (and callback invocations).
     */
    _performTransitionSideEffects(prevState: any, nextState: any, signal: any, event: any): void;
    _activate(event: any): void;
    _deactivate(event: any): void;
    _handleLongPress(event: any): void;
    _cancelLongPressDelayTimeout(): void;
    _cancelPressDelayTimeout(): void;
    _cancelPressOutDelayTimeout(): void;
}
//# sourceMappingURL=PressResponder.d.ts.map