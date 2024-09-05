/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */

const DELAY = 'DELAY'
const ERROR = 'ERROR'
const LONG_PRESS_DETECTED = 'LONG_PRESS_DETECTED'
const NOT_RESPONDER = 'NOT_RESPONDER'
const RESPONDER_ACTIVE_LONG_PRESS_START = 'RESPONDER_ACTIVE_LONG_PRESS_START'
const RESPONDER_ACTIVE_PRESS_START = 'RESPONDER_ACTIVE_PRESS_START'
const RESPONDER_INACTIVE_PRESS_START = 'RESPONDER_INACTIVE_PRESS_START'
const RESPONDER_GRANT = 'RESPONDER_GRANT'
const RESPONDER_RELEASE = 'RESPONDER_RELEASE'
const RESPONDER_TERMINATED = 'RESPONDER_TERMINATED'
const Transitions = Object.freeze({
  NOT_RESPONDER: {
    DELAY: ERROR,
    RESPONDER_GRANT: RESPONDER_INACTIVE_PRESS_START,
    RESPONDER_RELEASE: ERROR,
    RESPONDER_TERMINATED: ERROR,
    LONG_PRESS_DETECTED: ERROR,
  },
  RESPONDER_INACTIVE_PRESS_START: {
    DELAY: RESPONDER_ACTIVE_PRESS_START,
    RESPONDER_GRANT: ERROR,
    RESPONDER_RELEASE: NOT_RESPONDER,
    RESPONDER_TERMINATED: NOT_RESPONDER,
    LONG_PRESS_DETECTED: ERROR,
  },
  RESPONDER_ACTIVE_PRESS_START: {
    DELAY: ERROR,
    RESPONDER_GRANT: ERROR,
    RESPONDER_RELEASE: NOT_RESPONDER,
    RESPONDER_TERMINATED: NOT_RESPONDER,
    LONG_PRESS_DETECTED: RESPONDER_ACTIVE_LONG_PRESS_START,
  },
  RESPONDER_ACTIVE_LONG_PRESS_START: {
    DELAY: ERROR,
    RESPONDER_GRANT: ERROR,
    RESPONDER_RELEASE: NOT_RESPONDER,
    RESPONDER_TERMINATED: NOT_RESPONDER,
    LONG_PRESS_DETECTED: RESPONDER_ACTIVE_LONG_PRESS_START,
  },
  ERROR: {
    DELAY: NOT_RESPONDER,
    RESPONDER_GRANT: RESPONDER_INACTIVE_PRESS_START,
    RESPONDER_RELEASE: NOT_RESPONDER,
    RESPONDER_TERMINATED: NOT_RESPONDER,
    LONG_PRESS_DETECTED: NOT_RESPONDER,
  },
})

const isActiveSignal = (signal) =>
  signal === RESPONDER_ACTIVE_PRESS_START || signal === RESPONDER_ACTIVE_LONG_PRESS_START

const isButtonRole = (element) => element.getAttribute('role') === 'button'

const isPressStartSignal = (signal) =>
  signal === RESPONDER_INACTIVE_PRESS_START ||
  signal === RESPONDER_ACTIVE_PRESS_START ||
  signal === RESPONDER_ACTIVE_LONG_PRESS_START

const isTerminalSignal = (signal) =>
  signal === RESPONDER_TERMINATED || signal === RESPONDER_RELEASE

const isValidKeyPress = (event) => {
  const key = event.key
  const target = event.target
  const role = target.getAttribute('role')
  const isSpacebar = key === ' ' || key === 'Spacebar'
  return key === 'Enter' || (isSpacebar && role === 'button')
}

const DEFAULT_LONG_PRESS_DELAY_MS = 450 // 500 - 50

const DEFAULT_PRESS_DELAY_MS = 50
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
  _touchActivatePosition = null as any
  _pressDelayTimeout = 0 as any
  _selectionTerminated = false
  _isPointerTouch = false
  _longPressDelayTimeout = 0 as any
  _longPressDispatched = false
  _pressOutDelayTimeout = 0 as any
  _touchState = NOT_RESPONDER
  _config = null as any
  _eventHandlers = null as any

  constructor(config) {
    this.configure(config)
  }

  configure(config) {
    this._config = config
  }
  /**
   * Resets any pending timers. This should be called on unmount.
   */

  reset() {
    this._cancelLongPressDelayTimeout()

    this._cancelPressDelayTimeout()

    this._cancelPressOutDelayTimeout()
  }
  /**
   * Returns a set of props to spread into the interactive element.
   */

  getEventHandlers() {
    if (this._eventHandlers == null) {
      this._eventHandlers = this._createEventHandlers()
    }

    return this._eventHandlers
  }

  _createEventHandlers() {
    const start = (event, shouldDelay?: boolean) => {
      event.persist()

      this._cancelPressOutDelayTimeout()

      this._longPressDispatched = false
      this._selectionTerminated = false
      this._touchState = NOT_RESPONDER
      this._isPointerTouch = event.nativeEvent.type === 'touchstart'

      this._receiveSignal(RESPONDER_GRANT, event)

      const delayPressStart = normalizeDelay(
        this._config.delayPressStart,
        0,
        DEFAULT_PRESS_DELAY_MS
      )

      if (shouldDelay !== false && delayPressStart > 0) {
        this._pressDelayTimeout = setTimeout(() => {
          this._receiveSignal(DELAY, event)
        }, delayPressStart)
      } else {
        this._receiveSignal(DELAY, event)
      }

      const delayLongPress = normalizeDelay(
        this._config.delayLongPress,
        10,
        DEFAULT_LONG_PRESS_DELAY_MS
      )
      this._longPressDelayTimeout = setTimeout(() => {
        this._handleLongPress(event)
      }, delayLongPress + delayPressStart)
    }

    const end = (event) => {
      this._receiveSignal(RESPONDER_RELEASE, event)
    }

    const keyupHandler = (event) => {
      const onPress = this._config.onPress
      const target = event.target

      if (this._touchState !== NOT_RESPONDER && isValidKeyPress(event)) {
        end(event)
        document.removeEventListener('keyup', keyupHandler)
        const role = target.getAttribute('role')
        const elementType = target.tagName.toLowerCase()
        const isNativeInteractiveElement =
          role === 'link' ||
          elementType === 'a' ||
          elementType === 'button' ||
          elementType === 'input' ||
          elementType === 'select' ||
          elementType === 'textarea'

        if (onPress != null && !isNativeInteractiveElement) {
          onPress(event)
        }
      }
    }

    return {
      onStartShouldSetResponder: (event) => {
        const disabled = this._config.disabled

        if (disabled && isButtonRole(event.currentTarget)) {
          event.stopPropagation()
        }

        if (disabled == null) {
          return true
        }

        return !disabled
      },
      onKeyDown: (event) => {
        const disabled = this._config.disabled
        const key = event.key
        const target = event.target

        if (!disabled && isValidKeyPress(event)) {
          if (this._touchState === NOT_RESPONDER) {
            start(event, false) // Listen to 'keyup' on document to account for situations where
            // focus is moved to another element during 'keydown'.

            document.addEventListener('keyup', keyupHandler)
          }

          const role = target.getAttribute('role')
          const isSpacebarKey = key === ' ' || key === 'Spacebar'

          const _isButtonRole = role === 'button' || role === 'menuitem'

          if (isSpacebarKey && _isButtonRole) {
            // Prevent spacebar scrolling the window
            event.preventDefault()
          }

          event.stopPropagation()
        }
      },
      onResponderGrant: (event) => start(event),
      onResponderMove: (event) => {
        if (this._config.onPressMove != null) {
          this._config.onPressMove(event)
        }

        const touch = getTouchFromResponderEvent(event)

        if (this._touchActivatePosition != null) {
          const deltaX = this._touchActivatePosition.pageX - touch.pageX
          const deltaY = this._touchActivatePosition.pageY - touch.pageY

          if (Math.hypot(deltaX, deltaY) > 10) {
            this._cancelLongPressDelayTimeout()
          }
        }
      },
      onResponderRelease: (event) => end(event),
      onResponderTerminate: (event) => {
        if (event.nativeEvent.type === 'selectionchange') {
          this._selectionTerminated = true
        }

        this._receiveSignal(RESPONDER_TERMINATED, event)
      },
      onResponderTerminationRequest: (event) => {
        const _this$_config = this._config
        const cancelable = _this$_config.cancelable
        const disabled = _this$_config.disabled
        const onLongPress = _this$_config.onLongPress // If `onLongPress` is provided, don't terminate on `contextmenu` as default
        // behavior will be prevented for non-mouse pointers.

        if (
          !disabled &&
          onLongPress != null &&
          this._isPointerTouch &&
          event.nativeEvent.type === 'contextmenu'
        ) {
          return false
        }

        if (cancelable == null) {
          return true
        }

        return cancelable
      },
      // NOTE: this diverges from react-native in 3 significant ways:
      // * The `onPress` callback is not connected to the responder system (the native
      //  `click` event must be used but is dispatched in many scenarios where no pointers
      //   are on the screen.) Therefore, it's possible for `onPress` to be called without
      //   `onPress{Start,End}` being called first.
      // * The `onPress` callback is only be called on the first ancestor of the native
      //   `click` target that is using the PressResponder.
      // * The event's `nativeEvent` is a `MouseEvent` not a `TouchEvent`.
      onClick: (event) => {
        const _this$_config2 = this._config
        const disabled = _this$_config2.disabled
        const onPress = _this$_config2.onPress

        if (!disabled) {
          // If long press dispatched, cancel default click behavior.
          // If the responder terminated because text was selected during the gesture,
          // cancel the default click behavior.
          event.stopPropagation()

          if (this._longPressDispatched || this._selectionTerminated) {
            event.preventDefault()
          } else if (onPress != null && event.altKey === false) {
            onPress(event)
          }
        } else {
          if (isButtonRole(event.currentTarget)) {
            event.stopPropagation()
          }
        }
      },
      // If `onLongPress` is provided and a touch pointer is being used, prevent the
      // default context menu from opening.
      onContextMenu: (event) => {
        const _this$_config3 = this._config
        const disabled = _this$_config3.disabled
        const onLongPress = _this$_config3.onLongPress

        if (!disabled) {
          if (onLongPress != null && this._isPointerTouch && !event.defaultPrevented) {
            event.preventDefault()
            event.stopPropagation()
          }
        } else {
          if (isButtonRole(event.currentTarget)) {
            event.stopPropagation()
          }
        }
      },
    }
  }
  /**
   * Receives a state machine signal, performs side effects of the transition
   * and stores the new state. Validates the transition as well.
   */

  _receiveSignal(signal, event) {
    const prevState = this._touchState
    let nextState = null

    if (Transitions[prevState] != null) {
      nextState = Transitions[prevState][signal]
    }

    if (this._touchState === NOT_RESPONDER && signal === RESPONDER_RELEASE) {
      return
    }

    if (nextState == null || nextState === ERROR) {
      console.error(
        `PressResponder: Invalid signal ${signal} for state ${prevState} on responder`
      )
    } else if (prevState !== nextState) {
      this._performTransitionSideEffects(prevState, nextState, signal, event)

      this._touchState = nextState
    }
  }
  /**
   * Performs a transition between touchable states and identify any activations
   * or deactivations (and callback invocations).
   */

  _performTransitionSideEffects(prevState, nextState, signal, event) {
    if (isTerminalSignal(signal)) {
      // Pressable suppression of contextmenu on windows.
      // On Windows, the contextmenu is displayed after pointerup.
      // https://github.com/necolas/react-native-web/issues/2296
      setTimeout(() => {
        this._isPointerTouch = false
      }, 0)
      this._touchActivatePosition = null

      this._cancelLongPressDelayTimeout()
    }

    if (isPressStartSignal(prevState) && signal === LONG_PRESS_DETECTED) {
      const onLongPress = this._config.onLongPress // Long press is not supported for keyboards because 'click' can be dispatched
      // immediately (and multiple times) after 'keydown'.

      if (onLongPress != null && event.nativeEvent.key == null) {
        onLongPress(event)
        this._longPressDispatched = true
      }
    }

    const isPrevActive = isActiveSignal(prevState)
    const isNextActive = isActiveSignal(nextState)

    if (!isPrevActive && isNextActive) {
      this._activate(event)
    } else if (isPrevActive && !isNextActive) {
      this._deactivate(event)
    }

    if (isPressStartSignal(prevState) && signal === RESPONDER_RELEASE) {
      const _this$_config4 = this._config
      const _onLongPress = _this$_config4.onLongPress
      const onPress = _this$_config4.onPress

      if (onPress != null) {
        const isPressCanceledByLongPress =
          _onLongPress != null && prevState === RESPONDER_ACTIVE_LONG_PRESS_START

        if (!isPressCanceledByLongPress) {
          // If we never activated (due to delays), activate and deactivate now.
          if (!(isNextActive || isPrevActive)) {
            this._activate(event)

            this._deactivate(event)
          }
        }
      }
    }

    this._cancelPressDelayTimeout()
  }

  _activate(event) {
    const _this$_config5 = this._config
    const onPressChange = _this$_config5.onPressChange
    const onPressStart = _this$_config5.onPressStart
    const touch = getTouchFromResponderEvent(event)
    this._touchActivatePosition = {
      pageX: touch.pageX,
      pageY: touch.pageY,
    }

    if (onPressStart != null) {
      onPressStart(event)
    }

    if (onPressChange != null) {
      onPressChange(true)
    }
  }

  _deactivate(event) {
    const _this$_config6 = this._config
    const onPressChange = _this$_config6.onPressChange
    const onPressEnd = _this$_config6.onPressEnd

    function end() {
      if (onPressEnd != null) {
        onPressEnd(event)
      }

      if (onPressChange != null) {
        onPressChange(false)
      }
    }

    const delayPressEnd = normalizeDelay(this._config.delayPressEnd)

    if (delayPressEnd > 0) {
      this._pressOutDelayTimeout = setTimeout(() => {
        end()
      }, delayPressEnd)
    } else {
      end()
    }
  }

  _handleLongPress(event) {
    if (
      this._touchState === RESPONDER_ACTIVE_PRESS_START ||
      this._touchState === RESPONDER_ACTIVE_LONG_PRESS_START
    ) {
      this._receiveSignal(LONG_PRESS_DETECTED, event)
    }
  }

  _cancelLongPressDelayTimeout() {
    if (this._longPressDelayTimeout != null) {
      clearTimeout(this._longPressDelayTimeout)
      this._longPressDelayTimeout = null
    }
  }

  _cancelPressDelayTimeout() {
    if (this._pressDelayTimeout != null) {
      clearTimeout(this._pressDelayTimeout)
      this._pressDelayTimeout = null
    }
  }

  _cancelPressOutDelayTimeout() {
    if (this._pressOutDelayTimeout != null) {
      clearTimeout(this._pressOutDelayTimeout)
      this._pressOutDelayTimeout = null
    }
  }
}

function normalizeDelay(delay, min?: number, fallback?: any) {
  if (min === void 0) {
    min = 0
  }

  if (fallback === void 0) {
    fallback = 0
  }

  return Math.max(min, delay !== null && delay !== void 0 ? delay : fallback)
}

function getTouchFromResponderEvent(event) {
  const _event$nativeEvent = event.nativeEvent
  const changedTouches = _event$nativeEvent.changedTouches
  const touches = _event$nativeEvent.touches

  if (touches != null && touches.length > 0) {
    return touches[0]
  }

  if (changedTouches != null && changedTouches.length > 0) {
    return changedTouches[0]
  }

  return event.nativeEvent
}
