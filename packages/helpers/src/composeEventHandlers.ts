export type EventHandler<E extends Event> = (event: E) => void

export function composeEventHandlers<E extends Event>(
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
