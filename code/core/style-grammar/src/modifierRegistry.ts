// The one global modifier namespace the flat value grammar parses against.
//
// Built from the existing built-in state vocabulary plus the config's media
// keys, platform names, and root theme names, with parameterized group
// modifiers resolved on lookup. There is a single namespace on purpose: a name
// may mean exactly one thing, so a config whose media key collides with a state
// or theme name gets a diagnostic instead of a silent choice. Registration order
// is state, media, platform, theme, and first registration wins.
//
// See plans/dom-tailwind-flat-values.md — "Conditions".

import type { GrammarConfigView } from './candidate'
import {
  canonicalClauseModifier,
  isModifierName,
  parseGroupModifier,
  stateModifierNames,
} from './clauseIdentity'
import { grammarPlatformNames } from './config'
import {
  grammarMaxNonPlatformDepth,
  type ModifierKind,
  type ModifierRegistryView,
} from './valueTypes'

type Names = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>
const groupPrefix = 'group-'

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
   * Overrides the view's derived `containerSizeNames`. When NEITHER is
   * supplied the sizes are unknown: no container modifier registers and a
   * diagnostic says so — an unknowable set refuses rather than over-claims.
   * A caller with genuinely no container concept passes `[]` explicitly.
   */
  containerSizeNames?: Names
}

/**
 * Theme conditions name a root theme. Nested themes still inherit from that
 * root, so `dark:` applies within `dark_blue`, but `dark_blue:` is not a
 * condition of its own.
 */
export function isRootThemeName(name: string): boolean {
  return name.length > 0 && !name.includes('_')
}

export interface ContainerModifier {
  /** the size condition; the registry only accepts a registered media name here */
  size: string
  /** the container name, or null for the nearest container */
  container: string | null
}

interface ModifierTrieNode {
  modifiers: readonly string[]
  children: Map<string, ModifierTrieNode>
  next?: readonly string[]
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
  for (const name in source as Readonly<Record<string, unknown>>) {
    if (Object.prototype.hasOwnProperty.call(source, name)) visit(name)
  }
}

export function createModifierRegistry(
  view: GrammarConfigView,
  options: CreateModifierRegistryOptions = {}
): ModifierRegistryResult {
  const names = new Map<string, ModifierKind>()
  const diagnostics: string[] = []
  const completionNames: string[] = []

  // options override the view's derived set. an undefined BOTH falls back to
  // every-media-name for now — that over-claim is scheduled for removal with
  // its own caller sweep; views built from media records already carry the
  // correct derived subset
  const sizeSource = options.containerSizeNames ?? view.containerSizeNames
  let containerSizes: Set<string> | null = null
  if (sizeSource !== undefined) {
    containerSizes = new Set()
    forEachName(sizeSource, (name) => {
      if (name.startsWith(groupPrefix)) {
        diagnostics.push(
          `container size "${name}" is not registered: the "group-" prefix is reserved for group state modifiers; rename this container size so it does not begin with "group-"`
        )
      } else {
        containerSizes!.add(name)
      }
    })
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
    if (name.startsWith(groupPrefix)) {
      diagnostics.push(
        `modifier "${name}" is not registered: the "group-" prefix is reserved for group state modifiers; rename this ${kind} name so it does not begin with "group-"`
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
    names.set(name, kind)
    completionNames.push(name)
  }

  // when the caller or the view declares which sizes a container can measure,
  // the same spelling must also be registered as media. Otherwise any
  // registered media name works (legacy fallback, removal pending its caller
  // sweep)
  const isContainerSize = (size: string): boolean =>
    names.get(size) === 'media' && (!containerSizes || containerSizes.has(size))

  for (const name of stateModifierNames) register(name, 'state')
  forEachName(view.mediaNames, (name) => register(name, 'media'))
  forEachName(view.platformNames ?? grammarPlatformNames, (name) =>
    register(name, 'platform')
  )
  forEachName(view.themeNames, (name) => {
    if (isRootThemeName(name)) register(name, 'theme')
  })

  if (containerSizes) {
    for (const size of containerSizes) {
      if (names.get(size) !== 'media') {
        diagnostics.push(
          `container size "${size}" is not registered: the same spelling is not registered as a media query`
        )
      }
    }
  }

  for (const name of stateModifierNames) {
    const group = `group-${name}`
    if (names.get(group) === undefined) completionNames.push(group)
  }
  if (containerSizes) {
    for (const size of containerSizes) {
      if (isContainerSize(size)) completionNames.push(`@${size}`)
    }
  } else {
    for (const name of completionNames.slice()) {
      if (names.get(name) === 'media') completionNames.push(`@${name}`)
    }
  }

  const kindOrder: Readonly<Record<ModifierKind, number>> = {
    platform: 0,
    theme: 1,
    container: 2,
    media: 3,
    group: 4,
    state: 5,
  }
  const modifierTrie: ModifierTrieNode = {
    modifiers: [],
    children: new Map(),
  }

  const get = (name: string): ModifierKind | undefined => {
    const kind = names.get(name)
    if (kind !== undefined) return kind
    if (parseGroupModifier(name) !== null) return 'group'
    const container = parseContainerModifier(name)
    if (container !== null && isContainerSize(container.size)) return 'container'
    return undefined
  }

  return {
    registry: {
      get,
      next(modifiers: readonly string[]): readonly string[] {
        let node = modifierTrie
        for (const authored of modifiers) {
          const canonical = canonicalClauseModifier(authored)
          let child = node.children.get(canonical)
          if (!child) {
            child = {
              modifiers: [...node.modifiers, canonical],
              children: new Map(),
            }
            node.children.set(canonical, child)
          }
          node = child
        }
        if (node.next) return node.next

        const used = new Set<string>()
        const usedKinds = new Set<ModifierKind>()
        let highestOrder = -1
        let nonPlatformDepth = 0

        for (const canonical of node.modifiers) {
          if (used.has(canonical)) {
            node.next = []
            return node.next
          }
          used.add(canonical)
          const kind = get(canonical)
          if (!kind || usedKinds.has(kind) || kindOrder[kind] < highestOrder) {
            node.next = []
            return node.next
          }
          usedKinds.add(kind)
          highestOrder = kindOrder[kind]
          if (kind !== 'platform') {
            nonPlatformDepth++
            if (nonPlatformDepth > grammarMaxNonPlatformDepth) {
              node.next = []
              return node.next
            }
          }
        }

        const next: string[] = []
        for (const name of completionNames) {
          const canonical = canonicalClauseModifier(name)
          if (canonical !== name) continue
          if (used.has(canonical)) continue
          const kind = get(name)
          if (!kind || kindOrder[kind] < highestOrder) continue
          if (usedKinds.has(kind)) continue
          if (kind !== 'platform' && nonPlatformDepth >= grammarMaxNonPlatformDepth) {
            continue
          }
          next.push(name)
        }
        node.next = next
        return node.next
      },
    },
    diagnostics,
  }
}
