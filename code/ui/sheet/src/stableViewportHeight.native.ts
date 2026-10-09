import { Dimensions } from 'react-native'

/**
 * Height of the viewport the sheet positions against. Native measures against
 * the screen rather than the window, so it does not move with the keyboard.
 */
export function getStableViewportHeight(): number {
  return Dimensions.get('screen').height
}
