// the object spelling of `transition`, lowered into the same IR as the string
// shorthand and the five longhands. there is no second parser and no second set
// of semantics: this file only decides which IR entries an object describes.
//
// base config keys build the entry for the `properties` list (default `all`).
// per-property keys build LATER entries, which win for that property under the
// css last-wins rule, exactly as `transition: all 200ms, opacity 150ms` does.
// entries do NOT inherit fields from the base, because the string spelling
// does not either. reach for `preset` when you want a shared starting point.

import {
  parseTransition,
  type TransitionBehavior,
  type TransitionDiagnostic,
  type TransitionEntry,
  type TransitionParseResult,
  type TransitionTiming,
} from './transition'
import { springToDurationBounce } from '../runtime/spring'

/** low-level spring physics: a projection of duration+bounce, not a second API */
export interface SpringEscapeHatch {
  stiffness?: number
  damping?: number
  mass?: number
  velocity?: number
  overshootClamping?: boolean
  restDisplacementThreshold?: number
  restSpeedThreshold?: number
}

export interface TransitionObjectBase {
  preset?: string
  duration?: number | string
  bounce?: number
  easing?: string
  delay?: number | string
  behavior?: TransitionBehavior
  /** the css transition-property list this base entry applies to */
  properties?: string
  spring?: SpringEscapeHatch
  /**
   * the transition to use while mounting. prefer colocating it with the styles
   * it animates: `enterStyle={{ opacity: 0, transition: '200ms' }}`.
   */
  enter?: TransitionObjectValue
  /** the transition to use while unmounting. see `enter`. */
  exit?: TransitionObjectValue
}

export type TransitionObjectValue =
  | string
  | (TransitionObjectBase & { [property: string]: unknown })

/**
 * every key that configures the transition itself. anything else in the object
 * is a property name. closed on purpose: an unrecognized key is a diagnostic,
 * never a silent per-property transition on a property that does not exist.
 */
export const TRANSITION_RESERVED_KEYS: ReadonlySet<string> = new Set([
  'preset',
  'duration',
  'bounce',
  'easing',
  'delay',
  'behavior',
  'properties',
  'spring',
  'enter',
  'exit',
])

const behaviorValues = new Set(['normal', 'allow-discrete'])
const springKeys = new Set([
  'stiffness',
  'damping',
  'mass',
  'velocity',
  'overshootClamping',
  'restDisplacementThreshold',
  'restSpeedThreshold',
])

function time(value: number | string, label: string): string | TransitionDiagnostic {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return {
        code: 'transition-invalid-token',
        token: String(value),
        message: `${label} must be a finite number of milliseconds`,
      }
    }
    return `${value}ms`
  }
  if (typeof value === 'string' && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(ms|s)$/.test(value)) {
    return value
  }
  return {
    code: 'transition-invalid-token',
    token: String(value),
    message: `${label} must be a number of milliseconds or a css time`,
  }
}

/**
 * builds the timing atom a base object describes, or undefined when it
 * describes no timing at all (an object carrying only per-property keys).
 */
function timingFor(
  base: TransitionObjectBase
): TransitionTiming | TransitionDiagnostic | undefined {
  const hasSpringPhysics =
    !!base.spring && Object.keys(base.spring).some((key) => springKeys.has(key))
  const wantsSpring = base.bounce !== undefined || hasSpringPhysics

  if (base.preset !== undefined) {
    if (typeof base.preset !== 'string' || !base.preset) {
      return {
        code: 'transition-invalid-token',
        token: String(base.preset),
        message: 'preset must be the name of a configured animation',
      }
    }
    // the preset stays opaque here: only the driver holds the config that
    // gives it values, so overrides ride along and are applied at resolve time
    const config: Record<string, unknown> = {}
    if (base.duration !== undefined) config.duration = base.duration
    if (base.bounce !== undefined) config.bounce = base.bounce
    if (base.easing !== undefined) config.easing = base.easing
    if (base.spring) Object.assign(config, base.spring)
    return Object.keys(config).length
      ? { type: 'preset', name: base.preset, config }
      : { type: 'preset', name: base.preset }
  }

  if (wantsSpring) {
    if (base.easing !== undefined) {
      return {
        code: 'transition-invalid-spring',
        message:
          'a spring carries its own easing; drop `easing`, or drop `bounce`/`spring` for a timing',
      }
    }

    let duration: string
    let bounce: number

    if (base.duration !== undefined) {
      const parsed = time(base.duration, 'duration')
      if (typeof parsed !== 'string') return parsed
      duration = parsed
      bounce = base.bounce ?? 0
    } else if (hasSpringPhysics) {
      // derive the canonical pair so the IR always carries one representation,
      // with the authored physics riding along for drivers that take them raw
      const stiffness = base.spring!.stiffness
      const mass = base.spring!.mass ?? 1
      if (stiffness === undefined) {
        return {
          code: 'transition-invalid-spring',
          message: 'a spring needs `duration`, or `spring.stiffness` to derive one from',
        }
      }
      const damping = base.spring!.damping ?? 2 * Math.sqrt(stiffness * mass)
      const canonical = springToDurationBounce({ stiffness, damping, mass })
      duration = `${canonical.duration}ms`
      bounce = base.bounce ?? canonical.bounce
    } else {
      return {
        code: 'transition-invalid-spring',
        message: '`bounce` needs a `duration` to go with it',
      }
    }

    if (!Number.isFinite(bounce) || bounce <= -1 || bounce >= 1) {
      return {
        code: 'transition-invalid-spring',
        token: String(bounce),
        message: 'bounce must be a number between -1 and 1 (0 is critically damped)',
      }
    }

    return base.spring
      ? { type: 'spring', duration, bounce, config: { ...base.spring } }
      : { type: 'spring', duration, bounce }
  }

  if (base.duration === undefined && base.easing === undefined) return undefined

  const duration = base.duration === undefined ? '0s' : time(base.duration, 'duration')
  if (typeof duration !== 'string') return duration
  return {
    type: 'css',
    duration,
    timingFunction: base.easing === undefined ? 'ease' : base.easing,
  }
}

/**
 * lowers the transition object form into TransitionIR.
 *
 * @param presetNames configured animation names, so per-property strings
 *   resolve presets the same way the shorthand does
 * @param knownProperties when given, any non-reserved key outside it is a
 *   diagnostic instead of a silently-ignored per-property entry
 */
export function parseTransitionObject(
  input: TransitionObjectValue,
  presetNames: ReadonlySet<string> = new Set(),
  knownProperties?: ReadonlySet<string>
): TransitionParseResult {
  if (typeof input === 'string') return parseTransition(input, presetNames)

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {
      ok: false,
      diagnostics: [
        {
          code: 'transition-invalid-token',
          message: 'transition must be a css transition string or a config object',
        },
      ],
    }
  }

  const diagnostics: TransitionDiagnostic[] = []
  const base = input as TransitionObjectBase
  const entries: TransitionEntry[] = []

  let delay = '0s'
  if (base.delay !== undefined) {
    const parsed = time(base.delay, 'delay')
    if (typeof parsed === 'string') delay = parsed
    else diagnostics.push(parsed)
  }

  let behavior: TransitionBehavior = 'normal'
  if (base.behavior !== undefined) {
    if (behaviorValues.has(base.behavior)) behavior = base.behavior
    else {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: String(base.behavior),
        message: `"${base.behavior}" is not a transition behavior`,
      })
    }
  }

  const timing = timingFor(base)
  if (timing !== undefined && 'code' in timing) diagnostics.push(timing)
  else if (timing !== undefined) {
    // an object with no timing keys describes no base entry at all, so only
    // its listed properties transition. same reading as `transition: opacity
    // 150ms` with no `all` clause.
    const properties = (base.properties ?? 'all').split(',')
    for (const property of properties) {
      const trimmed = property.trim()
      if (!trimmed) {
        diagnostics.push({
          code: 'transition-empty-item',
          message: 'transition property lists cannot contain an empty item',
        })
        continue
      }
      entries.push({ property: trimmed, timing, delay, behavior })
    }
  } else if (base.properties !== undefined) {
    diagnostics.push({
      code: 'transition-invalid-list',
      message: '`properties` needs a duration, preset, bounce, or spring to apply',
    })
  }

  for (const key in input) {
    if (TRANSITION_RESERVED_KEYS.has(key)) continue
    const value = (input as Record<string, unknown>)[key]
    if (value === undefined) continue

    if (knownProperties && !knownProperties.has(key)) {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: key,
        message: `"${key}" is not a style property or a transition setting`,
      })
      continue
    }

    if (typeof value === 'string') {
      const parsed = parseTransition(value, presetNames)
      if (!parsed.ok) {
        diagnostics.push(...parsed.diagnostics)
        continue
      }
      if (parsed.value.kind === 'global') {
        diagnostics.push({
          code: 'transition-invalid-list',
          token: key,
          message: `CSS-wide value "${value}" cannot apply to a single property`,
        })
        continue
      }
      // the property key names the property, so a bare `"150ms ease-out"`
      // needs no property token of its own
      for (const entry of parsed.value.entries) {
        entries.push({
          ...entry,
          property: entry.property === 'all' ? key : entry.property,
        })
      }
      continue
    }

    if (value && typeof value === 'object') {
      const nested = parseTransitionObject(
        { ...(value as TransitionObjectBase), properties: key },
        presetNames,
        knownProperties
      )
      if (!nested.ok) {
        diagnostics.push(...nested.diagnostics)
        continue
      }
      if (nested.value.kind === 'transition') entries.push(...nested.value.entries)
      continue
    }

    diagnostics.push({
      code: 'transition-invalid-token',
      token: key,
      message: `"${key}" must be a transition string or a transition config object`,
    })
  }

  // mount and unmount transitions are their own entry lists rather than
  // entries in this one, because they never apply at the same time as it
  const states: {
    enter?: readonly TransitionEntry[]
    exit?: readonly TransitionEntry[]
  } = {}
  for (const state of ['enter', 'exit'] as const) {
    const value = base[state]
    if (value === undefined) continue
    const parsed = parseTransitionObject(value, presetNames, knownProperties)
    if (!parsed.ok) {
      diagnostics.push(...parsed.diagnostics)
      continue
    }
    if (parsed.value.kind === 'transition') states[state] = parsed.value.entries
  }

  if (diagnostics.length) return { ok: false, diagnostics }

  if (!entries.length && !states.enter && !states.exit) {
    return {
      ok: false,
      diagnostics: [
        {
          code: 'transition-empty-item',
          message: 'transition object describes no transition',
        },
      ],
    }
  }

  return {
    ok: true,
    value: { kind: 'transition', entries, enter: states.enter, exit: states.exit },
  }
}
