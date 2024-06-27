export type TamaguiComponentEvents = {
  cancelable?: boolean | undefined
  disabled?: any
  hitSlop?: any
  delayLongPress?: any
  delayPressIn?: any
  delayPressOut?: any
  focusable?: any
  minPressDuration?: number | undefined
  onPressIn: ((e: any) => void) | undefined
  onPress: ((e: any) => void) | undefined
  onLongPress?: ((e: any) => void) | undefined
  onMouseEnter?: ((e: any) => void) | undefined
  onMouseLeave?: ((e: any) => void) | undefined
  onPressOut: ((e: any) => void) | undefined
  onFocus?: ((e: any) => void) | undefined
  onBlur?: ((e: any) => void) | undefined
}
