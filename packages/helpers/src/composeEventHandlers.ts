type Events = Object

export type EventHandler<E extends Events> = (event: E) => void

export function composeEventHandlers<E extends Events>(
  og?: EventHandler<E>,
  next?: EventHandler<E>,
  { checkDefaultPrevented = true } = {}
) {
  if (!og || !next) {
    return next || og
  }
  return function composedEventHandler(event: E) {
    og?.(event)
    if (
      !(checkDefaultPrevented && 'defaultPrevented' in event) ||
      // @ts-ignore
      ('defaultPrevented' in event && !event.defaultPrevented)
    ) {
      return next?.(event)
    }
  }
}
