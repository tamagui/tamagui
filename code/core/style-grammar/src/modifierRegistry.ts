// The one global modifier namespace the flat value grammar parses against.
//
// Built from the existing built-in state vocabulary plus the config's media
// keys, platform names, and (sub-)theme names, with parameterized group
// modifiers resolved on lookup. There is a single namespace on purpose: a name
// may mean exactly one thing, so a config whose media key collides with a state
// or theme name gets a diagnostic instead of a silent choice. Registration order
// is state, media, platform, theme, and first registration wins.
//
// See plans/dom-tailwind-flat-values.md — "Conditions".

import type { GrammarConfigView } from './candidate'
import { grammarPlatformNames } from './config'
import { modifierAliases, pseudoToModifier } from './registry'
import { componentStateNames } from './states'
import type { ModifierKind, ModifierRegistryView } from './valueTypes'

type Names = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>

export interface ModifierRegistryResult {
  registry: ModifierRegistryView
  /** one human-readable line per name collision, in registration order */
  diagnostics: string[]
}

/**
 * Every built-in interaction/state modifier spelling: the modifiers of the core
 * pseudo-style props, their aliases, and the component-tier state words the
 * behavior packages expose through DOM attributes.
 */
export const stateModifierNames: readonly string[] = Object.freeze([
  ...Object.values(pseudoToModifier),
  ...Object.keys(modifierAliases),
  ...componentStateNames,
])

const stateModifierSet: ReadonlySet<string> = new Set(stateModifierNames)

const groupPrefixLength = 'group-'.length

/**
 * Parameterized group modifiers use Tailwind's spelling: `group-hover` for the
 * nearest unnamed group and `group-hover/card` for a named one. The state part
 * must be a built-in state modifier; the name part is an identifier.
 */
function isGroupModifier(name: string): boolean {
  if (!name.startsWith('group-')) return false
  const slash = name.indexOf('/')
  if (slash === -1) return stateModifierSet.has(name.slice(groupPrefixLength))
  if (slash + 1 >= name.length) return false
  for (let index = slash + 1; index < name.length; index++) {
    const code = name.charCodeAt(index)
    if (
      !(code >= 97 && code <= 122) && // a-z
      !(code >= 65 && code <= 90) && // A-Z
      !(code >= 48 && code <= 57) && // 0-9
      code !== 45 && // -
      code !== 95 // _
    ) {
      return false
    }
  }
  return stateModifierSet.has(name.slice(groupPrefixLength, slash))
}

function forEachName(source: Names | undefined, visit: (name: string) => void): void {
  if (!source) return
  if (Array.isArray(source)) {
    for (const name of source) visit(name)
    return
  }
  if (source instanceof Set) {
    for (const name of source) visit(name)
    return
  }
  for (const name in source as Readonly<Record<string, unknown>>) visit(name)
}

export function createModifierRegistry(view: GrammarConfigView): ModifierRegistryResult {
  const names = new Map<string, ModifierKind>()
  const diagnostics: string[] = []

  const register = (name: string, kind: ModifierKind): void => {
    const existing = names.get(name)
    if (existing !== undefined) {
      if (existing !== kind) {
        diagnostics.push(
          `modifier "${name}" is already registered as a ${existing} modifier, so the ${kind} name is ignored`
        )
      }
      return
    }
    if (isGroupModifier(name)) {
      diagnostics.push(
        `modifier "${name}" shadows the group modifier of the same spelling, which can no longer be used as a ${kind} name`
      )
    }
    names.set(name, kind)
  }

  for (const name of stateModifierNames) register(name, 'state')
  forEachName(view.mediaNames, (name) => register(name, 'media'))
  forEachName(view.platformNames ?? grammarPlatformNames, (name) =>
    register(name, 'platform')
  )
  forEachName(view.themeNames, (name) => register(name, 'theme'))

  return {
    registry: {
      get(name: string): ModifierKind | undefined {
        const kind = names.get(name)
        if (kind !== undefined) return kind
        return isGroupModifier(name) ? 'group' : undefined
      },
    },
    diagnostics,
  }
}
