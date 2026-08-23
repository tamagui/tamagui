export type CoreStateModifierName =
  | 'hover'
  | 'press'
  | 'focus'
  | 'focus-visible'
  | 'focus-within'
  | 'disabled'
  | 'enter'
  | 'exit'

export const coreStateModifierNames: readonly CoreStateModifierName[] = Object.freeze([
  'hover',
  'press',
  'focus',
  'focus-visible',
  'focus-within',
  'disabled',
  'enter',
  'exit',
])

export type ComponentStateModifierName =
  | 'open'
  | 'checked'
  | 'highlighted'
  | 'selected'
  | 'invalid'

export const componentStateModifierNames: readonly ComponentStateModifierName[] =
  Object.freeze(['open', 'checked', 'highlighted', 'selected', 'invalid'])

// precedence order and the selector id packed into the runtime vocabulary
export const canonicalStateModifierNames: readonly string[] = Object.freeze([
  'hover',
  'focus-within',
  'focus',
  'focus-visible',
  'press',
  'disabled',
  'enter',
  'exit',
  ...componentStateModifierNames,
])

export const stateModifierSelectors: readonly string[] = Object.freeze([
  ':hover',
  ':focus-within',
  ':focus',
  ':focus-visible',
  ':active',
  '[aria-disabled]',
  '.t_unmounted',
  '.t_exiting',
  '[data-state="open"]',
  '[data-state="checked"]',
  '[data-highlighted]',
  '[data-state="active"]',
  '[aria-invalid="true"]',
])

/**
 * Every alternate spelling of a core state modifier, and the one it means.
 *
 * This table is the only place an alias is written down. The web runtime used
 * to re-map `pressed`, `starting` and `ending` inline while resolving a
 * condition, which meant `parseValue` reported them as unregistered modifiers
 * and the runtime styled them anyway. `stateVocabulary` in states.ts already
 * calls all four aliases, so the two tables agree.
 */
export const modifierAliases: Readonly<Record<string, string>> = Object.freeze({
  __proto__: null,
  active: 'press',
  pressed: 'press',
  starting: 'enter',
  ending: 'exit',
})
