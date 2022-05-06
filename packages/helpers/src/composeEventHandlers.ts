import { FocusEvent } from 'react'
import { GestureResponderEvent } from 'react-native'

export type EventHandler<E extends Event | GestureResponderEvent | FocusEvent> = (event: E) => void

export function composeEventHandlers<E extends Event | GestureResponderEvent | FocusEvent>(
  og?: EventHandler<E>,
  next?: EventHandler<E>,
  { checkDefaultPrevented = true } = {}
) {
  return function composedEventHandler(event: E) {
    og?.(event)
    if (!checkDefaultPrevented || !event.defaultPrevented) {
      return next?.(event)
    }
  }
}
