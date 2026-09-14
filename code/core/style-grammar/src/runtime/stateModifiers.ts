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

/** the shared identifier rule for parameterized modifier names */
export function isModifierName(text: string, start: number, end: number): boolean {
  if (start >= end) return false
  for (let index = start; index < end; index++) {
    const code = text.charCodeAt(index)
    if (
      !(code >= 97 && code <= 122) &&
      !(code >= 65 && code <= 90) &&
      !(code >= 48 && code <= 57) &&
      code !== 45 &&
      code !== 95
    ) {
      return false
    }
  }
  return true
}

/** canonical spelling used by every clause identity and matching consumer */
export function canonicalClauseModifier(name: string): string {
  const direct = modifierAliases[name]
  if (direct) return direct
  if (!name.startsWith('group-')) return name
  const slash = name.indexOf('/')
  if (slash !== -1 && !isModifierName(name, slash + 1, name.length)) return name
  const state = modifierAliases[name.slice(6, slash === -1 ? name.length : slash)]
  if (!state || state === 'enter' || state === 'exit') return name
  return slash === -1 ? `group-${state}` : `group-${state}${name.slice(slash)}`
}
