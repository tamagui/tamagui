/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

type ClickEvent = any
type KeyboardEvent = any
type ResponderEvent = any

export type PressResponderConfig = {
  // The gesture can be interrupted by a parent gesture, e.g., scroll.
  // Defaults to true.
  cancelable?: boolean | null
  // Whether to disable initialization of the press gesture.
  disabled?: boolean | null
  // Duration (in addition to `delayPressStart`) after which a press gesture is
  // considered a long press gesture. Defaults to 500 (milliseconds).
  delayLongPress?: number | null
  // Duration to wait after press down before calling `onPressStart`.
  delayPressStart?: number | null
  // Duration to wait after letting up before calling `onPressEnd`.
  delayPressEnd?: number | null
  // Called when a long press gesture has been triggered.
  onLongPress?: ((event: ResponderEvent) => void) | null
  // Called when a press gestute has been triggered.
  onPress?: ((event: ClickEvent) => void) | null
  // Called when the press is activated to provide visual feedback.
  onPressChange?: ((event: ResponderEvent) => void) | null
  // Called when the press is activated to provide visual feedback.
  onPressStart?: ((event: ResponderEvent) => void) | null
  // Called when the press location moves. (This should rarely be used.)
  onPressMove?: ((event: ResponderEvent) => void) | null
  // Called when the press is deactivated to undo visual feedback.
  onPressEnd?: ((event: ResponderEvent) => void) | null
}

export type EventHandlers = {
  onClick: (event: ClickEvent) => void
  onContextMenu: (event: ClickEvent) => void
  onKeyDown: (event: KeyboardEvent) => void
  onResponderGrant: (event: ResponderEvent) => void
  onResponderMove: (event: ResponderEvent) => void
  onResponderRelease: (event: ResponderEvent) => void
  onResponderTerminate: (event: ResponderEvent) => void
  onResponderTerminationRequest: (event: ResponderEvent) => boolean
  onStartShouldSetResponder: (event: ResponderEvent) => boolean
}

enum States {
  DELAY,
  ERROR,
  LONG_PRESS_DETECTED,
  NOT_RESPONDER,
  RESPONDER_ACTIVE_LONG_PRESS_START,
  RESPONDER_ACTIVE_PRESS_START,
  RESPONDER_INACTIVE_PRESS_START,
  RESPONDER_GRANT,
  RESPONDER_RELEASE,
  RESPONDER_TERMINATED,
}

type TouchState =
  | States.NOT_RESPONDER
  | States.RESPONDER_INACTIVE_PRESS_START
  | States.RESPONDER_ACTIVE_PRESS_START
  | States.RESPONDER_ACTIVE_LONG_PRESS_START
  | States.ERROR

type TouchSignal =
  | States.DELAY
  | States.RESPONDER_GRANT
  | States.RESPONDER_RELEASE
  | States.RESPONDER_TERMINATED
  | States.LONG_PRESS_DETECTED

const Transitions = Object.freeze({
  [States.NOT_RESPONDER]: {
    [States.DELAY]: States.ERROR,
    [States.RESPONDER_GRANT]: States.RESPONDER_INACTIVE_PRESS_START,
    [States.RESPONDER_RELEASE]: States.ERROR,
    [States.RESPONDER_TERMINATED]: States.ERROR,
    [States.LONG_PRESS_DETECTED]: States.ERROR,
  },
  [States.RESPONDER_INACTIVE_PRESS_START]: {
    [States.DELAY]: States.RESPONDER_ACTIVE_PRESS_START,
    [States.RESPONDER_GRANT]: States.ERROR,
    [States.RESPONDER_RELEASE]: States.NOT_RESPONDER,
    [States.RESPONDER_TERMINATED]: States.NOT_RESPONDER,
    [States.LONG_PRESS_DETECTED]: States.ERROR,
  },
  [States.RESPONDER_ACTIVE_PRESS_START]: {
    [States.DELAY]: States.ERROR,
    [States.RESPONDER_GRANT]: States.ERROR,
    [States.RESPONDER_RELEASE]: States.NOT_RESPONDER,
    [States.RESPONDER_TERMINATED]: States.NOT_RESPONDER,
    [States.LONG_PRESS_DETECTED]: States.RESPONDER_ACTIVE_LONG_PRESS_START,
  },
  [States.RESPONDER_ACTIVE_LONG_PRESS_START]: {
    [States.DELAY]: States.ERROR,
    [States.RESPONDER_GRANT]: States.ERROR,
    [States.RESPONDER_RELEASE]: States.NOT_RESPONDER,
    [States.RESPONDER_TERMINATED]: States.NOT_RESPONDER,
    [States.LONG_PRESS_DETECTED]: States.RESPONDER_ACTIVE_LONG_PRESS_START,
  },
  [States.ERROR]: {
    [States.DELAY]: States.NOT_RESPONDER,
    [States.RESPONDER_GRANT]: States.RESPONDER_INACTIVE_PRESS_START,
    [States.RESPONDER_RELEASE]: States.NOT_RESPONDER,
    [States.RESPONDER_TERMINATED]: States.NOT_RESPONDER,
    [States.LONG_PRESS_DETECTED]: States.NOT_RESPONDER,
  },
})

const isActiveSignal = (signal) =>
  signal === States.RESPONDER_ACTIVE_PRESS_START ||
  signal === States.RESPONDER_ACTIVE_LONG_PRESS_START

const isButtonRole = (element) => element.getAttribute('role') === 'button'

const isPressStartSignal = (signal) =>
  signal === States.RESPONDER_INACTIVE_PRESS_START ||
  signal === States.RESPONDER_ACTIVE_PRESS_START ||
  signal === States.RESPONDER_ACTIVE_LONG_PRESS_START

const isTerminalSignal = (signal) =>
  signal === States.RESPONDER_TERMINATED || signal === States.RESPONDER_RELEASE

const isValidKeyPress = (event) => {
  const { key, target } = event
  const role = target.getAttribute('role')
  const isSpacebar = key === ' ' || key === 'Spacebar'

  return key === 'Enter' || (isSpacebar && role === 'button')
}

const DEFAULT_LONG_PRESS_DELAY_MS = 450 // 500 - 50
const DEFAULT_PRESS_DELAY_MS = 50

type TimeoutID = NodeJS.Timer | null

export class PressResponder {
  _config: PressResponderConfig
  _eventHandlers?: EventHandlers | null = null
  _isPointerTouch?: boolean = false
  _longPDT?: TimeoutID = null
  _longPressDispatched?: boolean = false
  _pDT?: TimeoutID = null
  _pODT?: TimeoutID = null
  _selectionTerminated?: boolean
  _touchActivatePosition?: {
    pageX: number
    pageY: number
  } | null
  _touchState: TouchState = States.NOT_RESPONDER

  constructor(config: PressResponderConfig) {
    this._config = config
  }

  configure(config: PressResponderConfig) {
    this._config = config
  }

  /**
   * Resets any pending timers. This should be called on unmount.
   */
  reset(): void {
    this._cancelLongPDT()
    this._cancelPDT()
    this._cancelPODT()
  }

  /**
   * Returns a set of props to spread into the interactive element.
   */
  getEventHandlers(): EventHandlers {
    if (this._eventHandlers == null) {
      this._eventHandlers = this._createHandlers()
    }
    return this._eventHandlers
  }

  _createHandlers(): EventHandlers {
    const start = (event: ResponderEvent, shouldDelay?: boolean): void => {
      event.persist()

      this._cancelPODT()

      this._longPressDispatched = false
      this._selectionTerminated = false
      this._touchState = States.NOT_RESPONDER
      this._isPointerTouch = event.nativeEvent.type === 'touchstart'

      this._receiveSignal(States.RESPONDER_GRANT, event)

      const delayPressStart = normalizeDelay(
        // @ts-ignore
        this._config.delayPressStart,
        0,
        DEFAULT_PRESS_DELAY_MS
      )

      if (shouldDelay !== false && delayPressStart > 0) {
        this._pDT = setTimeout(() => {
          this._receiveSignal(States.DELAY, event)
        }, delayPressStart)
      } else {
        this._receiveSignal(States.DELAY, event)
      }

      const delayLongPress = normalizeDelay(
        this._config.delayLongPress,
        10,
        DEFAULT_LONG_PRESS_DELAY_MS
      )
      this._longPDT = setTimeout(() => {
        this._handleLongPress(event)
      }, delayLongPress + delayPressStart)
    }

    const end = (event: ResponderEvent): void => {
      this._receiveSignal(States.RESPONDER_RELEASE, event)
    }

    const keyupHandler = (event: KeyboardEvent) => {
      const { onPress } = this._config
      const { target } = event

      if (this._touchState !== States.NOT_RESPONDER && isValidKeyPress(event)) {
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
      onStartShouldSetResponder: (event): boolean => {
        const { disabled } = this._config
        if (disabled && isButtonRole(event.currentTarget)) {
          event.stopPropagation()
        }
        if (disabled == null) {
          return true
        }
        return !disabled
      },

      onKeyDown: (event) => {
        const { disabled } = this._config
        const { key, target } = event
        if (!disabled && isValidKeyPress(event)) {
          if (this._touchState === States.NOT_RESPONDER) {
            start(event, false)
            // Listen to 'keyup' on document to account for situations where
            // focus is moved to another element during 'keydown'.
            document.addEventListener('keyup', keyupHandler)
          }
          const role = target.getAttribute('role')
          const isSpacebarKey = key === ' ' || key === 'Spacebar'
          const isButtonRole = role === 'button' || role === 'menuitem'
          if (isSpacebarKey && isButtonRole) {
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
            this._cancelLongPDT()
          }
        }
      },

      onResponderRelease: (event) => end(event),

      onResponderTerminate: (event) => {
        if (event.nativeEvent.type === 'selectionchange') {
          this._selectionTerminated = true
        }
        this._receiveSignal(States.RESPONDER_TERMINATED, event)
      },

      onResponderTerminationRequest: (event): boolean => {
        const { cancelable, disabled, onLongPress } = this._config
        // If `onLongPress` is provided, don't terminate on `contextmenu` as default
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
      onClick: (event: any): void => {
        const { disabled, onPress } = this._config
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
      onContextMenu: (event: any): void => {
        const { disabled, onLongPress } = this._config
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
  _receiveSignal(signal: TouchSignal, event: ResponderEvent): void {
    const prevState = this._touchState
    let nextState: TouchState | null = null
    if (Transitions[prevState] != null) {
      nextState = Transitions[prevState][signal] as TouchState
    }
    if (this._touchState === States.NOT_RESPONDER && signal === States.RESPONDER_RELEASE) {
      return
    }
    if (nextState == null || nextState === States.ERROR) {
      // eslint-disable-next-line no-console
      console.error(`PressResponder: Invalid signal ${signal} for state ${prevState} on responder`)
    } else if (prevState !== nextState) {
      this._sideEff(prevState, nextState, signal, event)
      this._touchState = nextState
    }
  }

  /**
   * Performs a transition between touchable states and identify any activations
   * or deactivations (and callback invocations).
   */
  _sideEff(
    prevState: TouchState,
    nextState: TouchState,
    signal: TouchSignal,
    event: ResponderEvent
  ): void {
    if (isTerminalSignal(signal)) {
      // Pressable suppression of contextmenu on windows.
      // On Windows, the contextmenu is displayed after pointerup.
      // https://github.com/necolas/react-native-web/issues/2296
      setTimeout(() => {
        this._isPointerTouch = false
      }, 0)
      this._touchActivatePosition = null
      this._cancelLongPDT()
    }

    if (isPressStartSignal(prevState) && signal === States.LONG_PRESS_DETECTED) {
      const { onLongPress } = this._config
      // Long press is not supported for keyboards because 'click' can be dispatched
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

    if (isPressStartSignal(prevState) && signal === States.RESPONDER_RELEASE) {
      const { onLongPress, onPress } = this._config
      if (onPress != null) {
        const isPressCanceledByLongPress =
          onLongPress != null && prevState === States.RESPONDER_ACTIVE_LONG_PRESS_START
        if (!isPressCanceledByLongPress) {
          // If we never activated (due to delays), activate and deactivate now.
          if (!isNextActive && !isPrevActive) {
            this._activate(event)
            this._deactivate(event)
          }
        }
      }
    }

    this._cancelPDT()
  }

  _activate(event: ResponderEvent): void {
    const { onPressChange, onPressStart } = this._config
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

  _deactivate(event: ResponderEvent): void {
    const { onPressChange, onPressEnd } = this._config
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
      this._pODT = setTimeout(() => {
        end()
      }, delayPressEnd)
    } else {
      end()
    }
  }

  _handleLongPress(event: ResponderEvent): void {
    if (
      this._touchState === States.RESPONDER_ACTIVE_PRESS_START ||
      this._touchState === States.RESPONDER_ACTIVE_LONG_PRESS_START
    ) {
      this._receiveSignal(States.LONG_PRESS_DETECTED, event)
    }
  }

  _cancelLongPDT(): void {
    if (this._longPDT) {
      clearTimeout(this._longPDT)
      this._longPDT = null
    }
  }

  _cancelPDT(): void {
    if (this._pDT) {
      clearTimeout(this._pDT)
      this._pDT = null
    }
  }

  _cancelPODT(): void {
    if (this._pODT) {
      clearTimeout(this._pODT)
      this._pODT = null
    }
  }
}

function normalizeDelay(delay: number | null | undefined, min = 0, fallback = 0): number {
  return Math.max(min, delay ?? fallback)
}

function getTouchFromResponderEvent(event: ResponderEvent) {
  const { changedTouches, touches } = event.nativeEvent
  if (touches && touches.length > 0) {
    return touches[0]
  }
  if (changedTouches && changedTouches.length > 0) {
    return changedTouches[0]
  }
  return event.nativeEvent
}
