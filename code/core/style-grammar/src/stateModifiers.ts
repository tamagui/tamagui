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
// null prototype so `modifierAliases.toString` and the other eleven
// Object.prototype spellings read as unregistered rather than inherited.
export const modifierAliases: Readonly<Record<string, string>> = Object.freeze(
  Object.assign(Object.create(null) as Record<string, string>, {
    active: 'press',
    pressed: 'press',
    starting: 'enter',
    ending: 'exit',
  })
)
