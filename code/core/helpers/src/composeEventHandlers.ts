type Events = Object

export type EventHandler<E extends Events> = (event: E) => void

export function composeEventHandlers<E extends Events>(
  og?: EventHandler<E> | null,
  next?: EventHandler<E> | null,
  { checkDefaultPrevented = true } = {}
) {
  if (!og || !next) {
    return next || og || undefined
  }
  return (event: E) => {
    og?.(event)
    if (
      !event ||
      !(
        checkDefaultPrevented &&
        typeof event === 'object' &&
        'defaultPrevented' in event
      ) ||
      // @ts-ignore
      ('defaultPrevented' in event && !event.defaultPrevented)
    ) {
      return next?.(event)
    }
  }
}
