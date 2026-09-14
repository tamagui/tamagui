type Events = object

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
    const isPrevented =
      !!event &&
      typeof event === 'object' &&
      (('defaultPrevented' in event && Boolean(event.defaultPrevented)) ||
        ('isCanceled' in event && Boolean(event.isCanceled)))
    if (!event || !checkDefaultPrevented || !isPrevented) {
      return next?.(event)
    }
  }
}
