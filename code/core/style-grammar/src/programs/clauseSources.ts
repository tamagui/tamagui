/** states the native evaluator can source from component state and lifecycle */
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
