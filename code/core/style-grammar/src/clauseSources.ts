/**
 * states the native evaluator can source from component state and lifecycle.
 * component-tier states stay web-only until their behavior packages feed them
 * into component state.
 */
export const nativeSourceableStates: ReadonlySet<string> = new Set([
  'hover',
  'press',
  'active',
  'focus',
  'focus-visible',
  'focus-within',
  'disabled',
  'enter',
  'exit',
])

/**
 * states a group clause can source natively through componentState.group.
 */
export const nativeGroupSourceableStates: readonly string[] = Object.freeze([
  'hover',
  'press',
  'active',
  'focus',
  'focus-visible',
  'focus-within',
  'disabled',
])
