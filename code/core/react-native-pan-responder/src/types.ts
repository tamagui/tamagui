import type {
  GestureResponderEvent,
  PanResponderGestureState,
} from '@tamagui/react-native-types'
import type { ResponderConfig } from '@tamagui/react-native-use-responder-events'

export type { PanResponderGestureState }

type PanResponderCallback<T> = (
  event: GestureResponderEvent,
  gestureState: PanResponderGestureState
) => T

/**
 * The config react-native's `PanResponder.create` takes, so a caller can move
 * between the two without rewriting a handler.
 */
export type PanResponderConfig = {
  onMoveShouldSetPanResponder?: PanResponderCallback<boolean>
  onMoveShouldSetPanResponderCapture?: PanResponderCallback<boolean>
  onStartShouldSetPanResponder?: PanResponderCallback<boolean>
  onStartShouldSetPanResponderCapture?: PanResponderCallback<boolean>
  onPanResponderReject?: PanResponderCallback<void>
  onPanResponderGrant?: PanResponderCallback<void>
  onPanResponderStart?: PanResponderCallback<void>
  onPanResponderEnd?: PanResponderCallback<void>
  onPanResponderRelease?: PanResponderCallback<void>
  onPanResponderMove?: PanResponderCallback<void>
  onPanResponderTerminate?: PanResponderCallback<void>
  onPanResponderTerminationRequest?: PanResponderCallback<boolean>
  onShouldBlockNativeResponder?: PanResponderCallback<boolean>
}

/**
 * Everything but `onClickCapture` goes into `useResponderEvents`; that one is a
 * plain React prop on the element.
 */
export type PanResponderHandlers = ResponderConfig & {
  onClickCapture: (event: any) => void
}

export type PanResponderInstance = {
  panHandlers: PanResponderHandlers
}
