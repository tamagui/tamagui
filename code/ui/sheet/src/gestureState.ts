/**
 * Re-export gesture state from @tamagui/native.
 * Sheet uses this for backward compatibility with existing code.
 */

export {
  isGestureHandlerEnabled,
  getGestureHandlerState,
} from '@tamagui/native'

export type { GestureState as GestureHandlerState } from '@tamagui/native'

// re-export setGestureHandlerState for backward compat with setupGestureHandler
export { setGestureHandlerState } from '@tamagui/native'

// alias for backward compatibility
export { setGestureHandlerState as setGestureState } from '@tamagui/native'
