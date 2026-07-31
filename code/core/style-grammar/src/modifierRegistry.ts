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
import { modifierAliases, pseudoToModifier } from './stateModifiers'
import { componentStateNames } from './states'
import type { ModifierKind, ModifierRegistryView } from './valueTypes'

type Names = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>

export interface ModifierRegistryResult {
  registry: ModifierRegistryView
  /** one human-readable line per name collision, in registration order */
  diagnostics: string[]
}

export interface CreateModifierRegistryOptions {
  /**
   * The media keys that measure a size, so `@key` is a meaningful container
   * query. A `hover` or `pointer` media key measures nothing a container has, and
   * `@container (hover: none)` is valid syntax with no meaning, so those keys have
   * no `@` form.
   *
   * Omit it and every media name stays eligible, which is what callers relied on
   * before container narrowing. The web adapter always provides it.
   */
  containerSizeNames?: Names
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

export interface GroupModifier {
  /** the state the parent group must be in, always a built-in state modifier */
  state: string
  /** the group name, or null for the nearest unnamed group */
  group: string | null
}

/**
 * Parameterized group modifiers use Tailwind's spelling: `group-hover` for the
 * nearest unnamed group and `group-hover/card` for a named one. The state part
 * must be a built-in state modifier; the name part is an identifier. Returns
 * null for anything else, which is what makes the spelling a single source of
 * truth for both registration and lowering.
 */
export function parseGroupModifier(name: string): GroupModifier | null {
  if (!name.startsWith('group-')) return null
  const slash = name.indexOf('/')
  if (slash === -1) {
    const state = name.slice(groupPrefixLength)
    return stateModifierSet.has(state) ? { state, group: null } : null
  }
  if (!isModifierName(name, slash + 1, name.length)) return null
  const state = name.slice(groupPrefixLength, slash)
  return stateModifierSet.has(state) ? { state, group: name.slice(slash + 1) } : null
}

export interface ContainerModifier {
  /** the size condition; the registry only accepts a registered media name here */
  size: string
  /** the container name, or null for the nearest container */
  container: string | null
}

/**
 * Container query modifiers own the `@` prefix: `@sm` targets the nearest
 * container and `@sm/card` a named one (plan decisions 17-18). Plain `sm:` stays
 * a viewport media query, which is why the prefix is reserved.
 *
 * This parses the spelling only. Whether `size` names a registered media key is
 * config-dependent, so the registry checks that on lookup and lowering resolves
 * the query text — the same split groups use for their state part.
 */
export function parseContainerModifier(name: string): ContainerModifier | null {
  if (name.charCodeAt(0) !== 64 /* @ */) return null
  const slash = name.indexOf('/')
  if (slash === -1) {
    return isModifierName(name, 1, name.length)
      ? { size: name.slice(1), container: null }
      : null
  }
  if (!isModifierName(name, 1, slash) || !isModifierName(name, slash + 1, name.length)) {
    return null
  }
  return { size: name.slice(1, slash), container: name.slice(slash + 1) }
}

/** the shared identifier rule for the parameterized parts of a modifier */
function isModifierName(text: string, start: number, end: number): boolean {
  if (start >= end) return false
  for (let index = start; index < end; index++) {
    const code = text.charCodeAt(index)
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
  return true
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

export function createModifierRegistry(
  view: GrammarConfigView,
  options: CreateModifierRegistryOptions = {}
): ModifierRegistryResult {
  const names = new Map<string, ModifierKind>()
  const diagnostics: string[] = []

  let containerSizes: Set<string> | null = null
  if (options.containerSizeNames) {
    containerSizes = new Set()
    forEachName(options.containerSizeNames, (name) => containerSizes!.add(name))
  }

  const register = (name: string, kind: ModifierKind): void => {
    if (name.charCodeAt(0) === 64 /* @ */) {
      // the `@` prefix belongs to container queries, so no configured name may
      // take it; otherwise `@sm:` would mean two things
      diagnostics.push(
        `modifier "${name}" is not registered: the "@" prefix is reserved for container query modifiers, so it cannot be a ${kind} name`
      )
      return
    }
    const existing = names.get(name)
    if (existing !== undefined) {
      if (existing !== kind) {
        diagnostics.push(
          `modifier "${name}" is already registered as a ${existing} modifier, so the ${kind} name is ignored`
        )
      }
      return
    }
    if (parseGroupModifier(name) !== null) {
      diagnostics.push(
        `modifier "${name}" shadows the group modifier of the same spelling, which can no longer be used as a ${kind} name`
      )
    }
    names.set(name, kind)
  }

  // when the caller declares which sizes a container can measure, that list is
  // the whole rule. Otherwise any registered media name works, and first
  // registration still wins, so a media name shadowed by a state has no `@` form
  const isContainerSize = (size: string): boolean =>
    containerSizes ? containerSizes.has(size) : names.get(size) === 'media'

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
        if (parseGroupModifier(name) !== null) return 'group'
        const container = parseContainerModifier(name)
        if (container !== null && isContainerSize(container.size)) return 'container'
        return undefined
      },
    },
    diagnostics,
  }
}
