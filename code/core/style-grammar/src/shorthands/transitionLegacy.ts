// migrates a v2 `transition` value to the v3 authoring form.
//
// this is a value-to-value migration, not a parser: it produces the object a
// person would write today, which the codemod prints back into source and
// `parseTransitionObject` then lowers exactly like hand-written code. there is
// no second set of semantics anywhere in the pipeline.
//
// the v2 shape leaned on inheritance: a `default` preset and a top-level
// `delay` silently applied to every per-property override. v3 entries stand
// alone under the css last-wins rule, so the migration materializes both into
// each entry rather than relying on a base that no longer reaches them.

import {
  parseTransition,
  type TransitionDiagnostic,
  type TransitionEntry,
} from './transition'

export type LegacyTransitionValue =
  | string
  | Readonly<Record<string, unknown>>
  | readonly [string, Readonly<Record<string, unknown>>]

/** a v3 `transition` value: a css/preset string, or a config object */
export type MigratedTransition = string | Record<string, unknown>

export type TransitionMigrationResult =
  | { ok: true; value: MigratedTransition }
  | { ok: false; diagnostics: readonly TransitionDiagnostic[] }

/** v2 keys that configured the transition rather than naming a property */
const legacyControlKeys = new Set([
  'default',
  'enter',
  'exit',
  'delay',
  'duration',
  'stiffness',
  'damping',
  'mass',
  'velocity',
  'overshootClamping',
  'restDisplacementThreshold',
  'restSpeedThreshold',
  'tension',
  'friction',
  'bounciness',
  'speed',
])

/** v2 spring keys that survive as-is under `spring` */
const springKeys = [
  'stiffness',
  'damping',
  'mass',
  'velocity',
  'overshootClamping',
  'restDisplacementThreshold',
  'restSpeedThreshold',
] as const

// react-native's own Origami conversions, ported verbatim from
// react-native/Libraries/Animated/SpringConfig.js so a migrated
// `tension`/`friction` or `bounciness`/`speed` keeps the motion it had.
function stiffnessFromOrigami(value: number): number {
  return (value - 30) * 3.62 + 194
}
function dampingFromOrigami(value: number): number {
  return (value - 8) * 3 + 25
}
function fromBouncinessAndSpeed(
  bounciness: number,
  speed: number
): { stiffness: number; damping: number } {
  const normalize = (value: number, start: number, end: number) =>
    (value - start) / (end - start)
  const projectNormal = (n: number, start: number, end: number) =>
    start + n * (end - start)
  const linear = (t: number, start: number, end: number) => t * end + (1 - t) * start
  const quadraticOut = (t: number, start: number, end: number) =>
    linear(2 * t - t * t, start, end)
  const b3Nobounce = (tension: number) => {
    if (tension <= 18) {
      return 0.0007 * tension ** 3 - 0.031 * tension ** 2 + 0.64 * tension + 1.28
    }
    if (tension <= 44) {
      return 0.000044 * tension ** 3 - 0.006 * tension ** 2 + 0.36 * tension + 2
    }
    return 0.00000045 * tension ** 3 - 0.000332 * tension ** 2 + 0.1078 * tension + 5.84
  }
  const b = projectNormal(normalize(bounciness / 1.7, 0, 20), 0, 0.8)
  const s = normalize(speed / 1.7, 0, 20)
  const bouncyTension = projectNormal(s, 0.5, 200)
  const bouncyFriction = quadraticOut(b, b3Nobounce(bouncyTension), 0.01)
  return {
    stiffness: stiffnessFromOrigami(bouncyTension),
    damping: dampingFromOrigami(bouncyFriction),
  }
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000
}

/**
 * collects the v2 spring config an object carries into a v3 `spring` object.
 * `duration` is handled by the caller: it is a first-class v3 knob, not physics.
 */
function migrateSpring(
  options: Readonly<Record<string, unknown>>,
  label: string,
  diagnostics: TransitionDiagnostic[]
): Record<string, unknown> | undefined {
  const spring: Record<string, unknown> = {}

  for (const key of springKeys) {
    if (options[key] !== undefined) spring[key] = options[key]
  }

  // the two Origami parameterizations both collapse to stiffness/damping
  const { tension, friction, bounciness, speed } = options as Record<string, number>
  if (tension !== undefined || friction !== undefined) {
    // react-native's own defaults for the pair
    const converted = {
      stiffness: stiffnessFromOrigami(tension ?? 40),
      damping: dampingFromOrigami(friction ?? 7),
    }
    spring.stiffness = round(converted.stiffness)
    spring.damping = round(converted.damping)
  } else if (bounciness !== undefined || speed !== undefined) {
    const converted = fromBouncinessAndSpeed(bounciness ?? 8, speed ?? 12)
    spring.stiffness = round(converted.stiffness)
    spring.damping = round(converted.damping)
  }

  if (spring.damping !== undefined && spring.stiffness === undefined) {
    diagnostics.push({
      code: 'transition-invalid-spring',
      token: label,
      message: `${label}: damping without stiffness has no v3 spelling, give it a stiffness or a duration and bounce`,
    })
  }

  return Object.keys(spring).length ? spring : undefined
}

/** milliseconds a v2 `delay` describes, or a diagnostic */
function migrateDelay(
  value: unknown,
  diagnostics: TransitionDiagnostic[]
): number | undefined {
  if (value === undefined) return
  if (typeof value === 'number' && Number.isFinite(value)) return value
  diagnostics.push({
    code: 'transition-invalid-token',
    token: String(value),
    message: 'legacy transition delay must be a finite number of milliseconds',
  })
  return
}

/**
 * re-spells a v2 string value as an object, so a materialized `delay` or a
 * `spring` override has somewhere to live. only ever called when one exists.
 */
function stringToObject(
  value: string,
  label: string,
  presetNames: ReadonlySet<string>,
  diagnostics: TransitionDiagnostic[]
): Record<string, unknown> | undefined {
  const parsed = parseTransition(value, presetNames)
  if (!parsed.ok) {
    for (const diagnostic of parsed.diagnostics) {
      diagnostics.push({ ...diagnostic, message: `${label}: ${diagnostic.message}` })
    }
    return
  }
  if (parsed.value.kind !== 'transition' || parsed.value.entries.length !== 1) {
    diagnostics.push({
      code: 'transition-invalid-token',
      token: value,
      message: `${label} must be a single preset or css timing value`,
    })
    return
  }
  const entry: TransitionEntry = parsed.value.entries[0]
  if (entry.timing.type === 'preset') return { preset: entry.timing.name }
  if (entry.timing.type === 'css') {
    // `ease` is the css default, so spelling it out only adds noise
    return entry.timing.timingFunction === 'ease'
      ? { duration: entry.timing.duration }
      : { duration: entry.timing.duration, easing: entry.timing.timingFunction }
  }
  diagnostics.push({
    code: 'transition-invalid-token',
    token: value,
    message: `${label} must be a single preset or css timing value`,
  })
  return
}

/** keys that give the base object a timing of its own, so `properties` applies */
const baseTimingKeys = ['preset', 'duration', 'bounce', 'easing', 'spring'] as const

/**
 * folds a v2 `animateOnly` list into the migrated value.
 *
 * v2 read the list as an exclusive filter over whatever the transition named,
 * which is what a css `transition-property` list already is. so the list
 * becomes `properties` on the base entry, and any per-property entry the list
 * leaves out is dropped rather than quietly surviving the filter.
 */
function applyAnimateOnly(
  value: Record<string, unknown>,
  animateOnly: readonly string[],
  presetNames: ReadonlySet<string>,
  diagnostics: TransitionDiagnostic[]
): void {
  for (const state of ['enter', 'exit'] as const) {
    const nested = value[state]
    // an enter/exit value is its own entry list and replaces the base while it
    // applies, so the list narrows it too rather than riding on the base
    if (typeof nested === 'string') {
      const asObject = stringToObject(nested, state, presetNames, diagnostics)
      if (!asObject) continue
      applyAnimateOnly(asObject, animateOnly, presetNames, diagnostics)
      value[state] = asObject
    } else if (nested && typeof nested === 'object') {
      applyAnimateOnly(
        nested as Record<string, unknown>,
        animateOnly,
        presetNames,
        diagnostics
      )
    }
  }

  const allowed = new Set(animateOnly)
  for (const key in value) {
    if (TRANSITION_MIGRATION_RESERVED.has(key)) continue
    if (!allowed.has(key)) delete value[key]
  }

  // with no base timing there is no base entry for the list to narrow: only
  // the properties still named transition at all, which is the same answer
  if (baseTimingKeys.some((key) => value[key] !== undefined)) {
    value.properties = animateOnly.join(', ')
  }
}

/** the v3 keys `applyAnimateOnly` must not mistake for property names */
const TRANSITION_MIGRATION_RESERVED = new Set([
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

/**
 * migrates a v2 transition value to its v3 spelling.
 *
 * @param presetNames configured animation names, so the migration can tell a
 *   preset from a css timing exactly as the runtime does
 * @param animateOnly the removed `animateOnly` prop's list, when the site had
 *   one. an empty list disabled transitions entirely, which is `none`.
 */
export function migrateLegacyTransition(
  input: LegacyTransitionValue,
  presetNames: ReadonlySet<string>,
  animateOnly?: readonly string[]
): TransitionMigrationResult {
  if (animateOnly?.length === 0) return { ok: true, value: 'none' }

  // a bare string was already the v3 spelling, unless a list has to narrow it
  if (typeof input === 'string') {
    if (!animateOnly) return { ok: true, value: input }
    const diagnostics: TransitionDiagnostic[] = []
    const asObject = stringToObject(input, 'transition', presetNames, diagnostics)
    if (!asObject) return { ok: false, diagnostics }
    applyAnimateOnly(asObject, animateOnly, presetNames, diagnostics)
    if (diagnostics.length) return { ok: false, diagnostics }
    return { ok: true, value: asObject }
  }

  const isTuple = Array.isArray(input)
  const tuple = input as readonly [string, Readonly<Record<string, unknown>>]
  const options = (isTuple ? (tuple[1] ?? {}) : input) as Readonly<
    Record<string, unknown>
  >
  const diagnostics: TransitionDiagnostic[] = []

  const presetValue = isTuple ? tuple[0] : options.default
  let preset: string | undefined
  if (presetValue !== undefined) {
    if (typeof presetValue === 'string') preset = presetValue
    else {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: String(presetValue),
        message: 'legacy transition default must be a preset or css timing value',
      })
    }
  }

  const delay = migrateDelay(options.delay, diagnostics)
  const spring = migrateSpring(options, 'transition', diagnostics)

  // build in the order a person writes them, so the printed source reads well
  const value: Record<string, unknown> = {}
  if (preset !== undefined) {
    // a v2 `default` naming a css timing is just that timing in v3
    const asObject = presetNames.has(preset)
      ? { preset }
      : stringToObject(preset, 'transition default', presetNames, diagnostics)
    if (asObject) Object.assign(value, asObject)
  }
  if (options.duration !== undefined) {
    // a v2 `default` naming a css timing already carried a duration, and the
    // separate `duration` only reached the js drivers. keeping both silently
    // would change the motion on one target or the other
    if (value.duration !== undefined && value.duration !== options.duration) {
      diagnostics.push({
        code: 'transition-invalid-duration',
        token: String(options.duration),
        message: `transition sets both a "${value.duration}" timing and duration ${options.duration}; keep the one you meant`,
      })
    }
    value.duration = options.duration
  }
  if (delay !== undefined) value.delay = delay
  if (spring) value.spring = spring

  for (const state of ['enter', 'exit'] as const) {
    const raw = options[state]
    if (raw === undefined) continue
    if (typeof raw !== 'string') {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: String(raw),
        message: `legacy transition ${state} must be a preset or css timing value`,
      })
      continue
    }
    if (delay === undefined) {
      value[state] = raw
      continue
    }
    // v2 applied the top-level delay here too, and v3 entries do not inherit
    const asObject = stringToObject(
      raw,
      `legacy transition ${state}`,
      presetNames,
      diagnostics
    )
    if (asObject) value[state] = { ...asObject, delay }
  }

  for (const [property, raw] of Object.entries(options)) {
    if (legacyControlKeys.has(property)) continue

    if (typeof raw === 'string') {
      if (delay === undefined) {
        value[property] = raw
        continue
      }
      const asObject = stringToObject(
        raw,
        `transition ${property}`,
        presetNames,
        diagnostics
      )
      if (asObject) value[property] = { ...asObject, delay }
      continue
    }

    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: property,
        message: `legacy transition property "${property}" needs a preset, css timing value, or default`,
      })
      continue
    }

    const config = raw as Readonly<Record<string, unknown>>
    const entry: Record<string, unknown> = {}

    // v2 `type` on a property named a preset; v3 spells that `preset`
    const propertyPreset = config.type === undefined ? preset : config.type
    if (propertyPreset === undefined) {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: property,
        message: `legacy transition property "${property}" needs a preset, css timing value, or default`,
      })
      continue
    }
    if (typeof propertyPreset !== 'string') {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: property,
        message: `legacy transition property "${property}" has a non-string type`,
      })
      continue
    }
    const asObject = presetNames.has(propertyPreset)
      ? { preset: propertyPreset }
      : stringToObject(propertyPreset, `transition ${property}`, presetNames, diagnostics)
    if (!asObject) continue
    Object.assign(entry, asObject)

    if (config.duration !== undefined) entry.duration = config.duration
    const propertyDelay = migrateDelay(config.delay, diagnostics) ?? delay
    if (propertyDelay !== undefined) entry.delay = propertyDelay
    const propertySpring = migrateSpring(config, `transition ${property}`, diagnostics)
    if (propertySpring) entry.spring = propertySpring

    value[property] = entry
  }

  if (animateOnly) applyAnimateOnly(value, animateOnly, presetNames, diagnostics)

  if (diagnostics.length) return { ok: false, diagnostics }
  return { ok: true, value }
}

const identifierPattern = /^[A-Za-z_$][A-Za-z0-9_$]*$/

function quote(value: string): string {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

/** prints a migrated value as javascript source, for a codemod to write back */
export function printMigratedTransition(value: MigratedTransition): string {
  if (typeof value === 'string') return quote(value)
  const parts: string[] = []
  for (const [key, entry] of Object.entries(value)) {
    const name = identifierPattern.test(key) ? key : quote(key)
    parts.push(
      `${name}: ${
        typeof entry === 'string'
          ? quote(entry)
          : entry !== null && typeof entry === 'object'
            ? printMigratedTransition(entry as Record<string, unknown>)
            : String(entry)
      }`
    )
  }
  return `{ ${parts.join(', ')} }`
}
