// Legacy condition prop names, normalized to the one spelling the shared
// converter resolves.
//
// Three v1 spellings need normalizing before the shared converter sees them:
// the platform conditions are written `$web`/`$ios` rather than `$platform-web`;
// v1 media keys are camelCase where the V6 built-ins are kebab-case (decision
// 15); and a legacy group condition may carry a container size, which V3 splits
// into a container query plus a group state (`$group-card-sm-hover` becomes
// `@sm/card:group-hover/card:`).

import { grammarPlatformNames, pseudoToModifier, type ModifierRegistryView } from './grammar'

export interface ContainerRequest {
  /** the media key the container measures */
  size: string
  /** the group name the query is scoped to, or null for the nearest container */
  group: string | null
}

export interface ResolvedLegacyName {
  /** the spelling handed to the shared converter */
  canonical: string
  /** modifiers replacing the converter's root modifier, when the split applies */
  replaceRoot: readonly string[] | null
  /** the container the parent group element has to declare */
  container: ContainerRequest | null
}

export type LegacyNameResolution =
  | { ok: true; resolved: ResolvedLegacyName }
  | { ok: false; code: string; message: string }

export function isLegacyConditionName(name: string): boolean {
  return name.startsWith('$') || pseudoToModifier[name] !== undefined
}

function kebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/** the registered media name for a v1 media key, kebab-cased when v1 spelled it camelCase */
function mediaName(name: string, registry: ModifierRegistryView): string | null {
  if (registry.get(name) === 'media') return name
  const kebabbed = kebab(name)
  return registry.get(kebabbed) === 'media' ? kebabbed : null
}

/** the longest suffix of `parts` that resolves through `resolve` */
function longestSuffix(
  parts: readonly string[],
  resolve: (candidate: string) => string | null
): { value: string; rest: readonly string[] } | null {
  for (let start = 0; start < parts.length; start++) {
    const resolved = resolve(parts.slice(start).join('-'))
    if (resolved !== null) return { value: resolved, rest: parts.slice(0, start) }
  }
  return null
}

function resolveGroupName(
  name: string,
  registry: ModifierRegistryView
): LegacyNameResolution {
  const parts = name.slice('$group-'.length).split('-')
  const state = longestSuffix(parts, (candidate) =>
    registry.get(candidate) === 'state' ? candidate : null
  )
  const beforeState = state ? state.rest : parts
  const size = longestSuffix(beforeState, (candidate) => mediaName(candidate, registry))
  const group = (size ? size.rest : beforeState).join('-') || null
  const suffix = group === null ? '' : `/${group}`

  if (!state && !size) {
    return {
      ok: false,
      code: 'legacy-group-presence',
      message: `"${name}" styles every descendant of the group unconditionally; V3 has no group-presence condition, so move the value to the base program or add a state`,
    }
  }

  if (!size) {
    // the shared converter already splits `$group-[name-]state`
    return { ok: true, resolved: { canonical: name, replaceRoot: null, container: null } }
  }

  const modifiers = [`@${size.value}${suffix}`]
  if (state) modifiers.push(`group-${state.value}${suffix}`)
  for (const modifier of modifiers) {
    if (registry.get(modifier) === undefined) {
      return {
        ok: false,
        code: 'unregistered-legacy-condition',
        message: `"${name}" needs modifier "${modifier}", which is not registered`,
      }
    }
  }

  return {
    ok: true,
    resolved: {
      // any registered root works: `replaceRoot` substitutes the whole chain
      canonical: state ? `$group-${group === null ? '' : `${group}-`}${state.value}` : `$${size.value}`,
      replaceRoot: modifiers,
      container: { size: size.value, group },
    },
  }
}

export function resolveLegacyName(
  name: string,
  registry: ModifierRegistryView
): LegacyNameResolution {
  if (pseudoToModifier[name] !== undefined || name.startsWith('$theme-')) {
    return { ok: true, resolved: { canonical: name, replaceRoot: null, container: null } }
  }

  if (name.startsWith('$platform-')) {
    return { ok: true, resolved: { canonical: name, replaceRoot: null, container: null } }
  }

  if (name.startsWith('$group-')) return resolveGroupName(name, registry)

  if (name.startsWith('$')) {
    const bare = name.slice(1)
    if (grammarPlatformNames.has(bare)) {
      return {
        ok: true,
        resolved: {
          canonical: `$platform-${bare}`,
          replaceRoot: null,
          container: null,
        },
      }
    }
    const media = mediaName(bare, registry)
    if (media !== null) {
      return {
        ok: true,
        resolved: { canonical: `$${media}`, replaceRoot: null, container: null },
      }
    }
    return {
      ok: false,
      code: 'unknown-legacy-condition',
      message: `"${name}" is not a registered legacy condition spelling`,
    }
  }

  return {
    ok: false,
    code: 'unknown-legacy-condition',
    message: `"${name}" is not a registered legacy condition spelling`,
  }
}
