import { FocusEvent, useCallback, useRef } from 'react'
import { GestureResponderEvent } from 'react-native'

export type EventHandler<E extends Event | GestureResponderEvent | FocusEvent> = (event: E) => void

export function composeEventHandlers<E extends Event | GestureResponderEvent | FocusEvent>(
  og?: EventHandler<E>,
  next?: EventHandler<E>,
  { checkDefaultPrevented = true } = {}
) {
  const handlers = useRef<(EventHandler<E> | undefined)[]>([])
  handlers.current[0] = og
  handlers.current[1] = next

  // mimic upcoming react useEvent and keep it stable
  return useCallback(function composedEventHandler(event: E) {
    const [og, next] = handlers.current
    og?.(event)
    if (!checkDefaultPrevented || !event.defaultPrevented) {
      return next?.(event)
    }
  }, [])
}
