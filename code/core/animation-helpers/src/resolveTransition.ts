// the one place a `transition` prop becomes driver-ready values.
//
// every driver and `getSplitStyles` call `resolveTransition`, so there is a
// single grammar, a single preset lookup, and a single spring solver behind
// css, reanimated, motion, and react-native. a transition that means one thing
// on one driver cannot mean something else on another, because none of them
// decide anything on their own any more.
//
// the shape is CSS's: an ordered entry list where the LAST entry naming a
// property wins for that property, and entries do not inherit from each other.
// `transition="all 200ms, opacity 150ms ease-out"` reads exactly as it does in
// a stylesheet.

import {
  parseTransition,
  parseTransitionObject,
  springFromDurationBounce,
  springSettleTime,
  springToDurationBounce,
  springToLinearEasing,
  type TransitionBehavior,
  type TransitionDiagnostic,
  type TransitionEntry,
  type TransitionObjectValue,
  type TransitionTiming,
} from '@tamagui/style-grammar/transitions'

import { canonicalTransitionProperty } from './propertyNames'
import { setTransitionResolver } from './transitionResolver'

export type DriverTiming =
  | {
      kind: 'timing'
      durationMs: number
      easing: string
    }
  | {
      kind: 'spring'
      /** the undamped period, the portable "how fast does this feel" number */
      durationMs: number
      bounce: number
      stiffness: number
      damping: number
      mass: number
      /** authored low-level overrides, for drivers that take them raw */
      extra?: Record<string, unknown>
    }

export interface ResolvedEntry {
  /** canonical property name, kebab-case, or `all` / `none` */
  property: string
  timing: DriverTiming
  delayMs: number
  behavior: TransitionBehavior
}

export interface ResolvedTransition {
  /** in authored order; later entries win under the css last-wins rule */
  entries: readonly ResolvedEntry[]
  /** the winning `all` entry, or null when only specific properties were named */
  all: ResolvedEntry | null
  /** winning entry per canonical property name, excluding `all` */
  byProperty: Readonly<Record<string, ResolvedEntry>>
  /** true when the author disabled transitions entirely (`transition="none"`) */
  none: boolean
  /**
   * true when any entry was authored as a preset name or a `spring()`, the two
   * things that have no css spelling of their own. a resolution without one is
   * already plain css and needs no driver at all.
   */
  fused: boolean
  /** replaces this whole resolution while mounting, when the author set one */
  enter: ResolvedTransition | null
  /** replaces this whole resolution while unmounting */
  exit: ResolvedTransition | null
  diagnostics: readonly TransitionDiagnostic[]
}

const emptyResolved: ResolvedTransition = {
  entries: [],
  all: null,
  byProperty: {},
  none: false,
  fused: false,
  enter: null,
  exit: null,
  diagnostics: [],
}

/** the resolution that applies in a given animation state */
export function forAnimationState(
  resolved: ResolvedTransition,
  state: 'enter' | 'exit' | 'default'
): ResolvedTransition {
  if (state === 'enter' && resolved.enter) return resolved.enter
  if (state === 'exit' && resolved.exit) return resolved.exit
  return resolved
}

function timeToMs(value: string): number {
  // the grammar guarantees a `<number>ms` or `<number>s` token here
  return value.endsWith('ms') ? Number.parseFloat(value) : Number.parseFloat(value) * 1000
}

function springTiming(
  durationMs: number,
  bounce: number,
  extra?: Record<string, unknown>
): DriverTiming {
  const mass = typeof extra?.mass === 'number' ? extra.mass : 1
  const physics = springFromDurationBounce({ duration: durationMs, bounce }, mass)
  return {
    kind: 'spring',
    durationMs,
    bounce,
    // authored physics win over the derived pair, so the escape hatch is exact
    stiffness: typeof extra?.stiffness === 'number' ? extra.stiffness : physics.stiffness,
    damping: typeof extra?.damping === 'number' ? extra.damping : physics.damping,
    mass,
    extra,
  }
}

/**
 * turns one entry in a driver's `animations` config into a timing.
 *
 * accepts every shape `PresetConfig` allows: a css string (`'350ms ease-out'`),
 * spring physics (`{ type: 'spring', damping, stiffness, mass }`), a timing
 * (`{ type: 'timing', duration, easing }`), and the canonical pair
 * (`{ duration, bounce }`). configs written for any driver therefore resolve
 * to the same motion on all four.
 */
export function presetToTiming(preset: unknown): DriverTiming | null {
  if (typeof preset === 'string') {
    const parsed = parseTransition(preset)
    if (!parsed.ok || parsed.value.kind !== 'transition') return null
    const entry = parsed.value.entries[0]
    if (!entry) return null
    return timingToDriver(entry.timing, null)
  }

  if (!preset || typeof preset !== 'object') return null
  const config = preset as Record<string, unknown>
  const duration = typeof config.duration === 'number' ? config.duration : undefined
  const hasPhysics =
    typeof config.stiffness === 'number' || typeof config.damping === 'number'

  const stiffness = typeof config.stiffness === 'number' ? config.stiffness : undefined
  const damping = typeof config.damping === 'number' ? config.damping : undefined

  const isSpring =
    config.type === 'spring' || typeof config.bounce === 'number' || hasPhysics

  if (isSpring) {
    const mass = typeof config.mass === 'number' ? config.mass : 1
    if (stiffness !== undefined) {
      const canonical = springToDurationBounce({
        stiffness,
        damping: damping ?? 2 * Math.sqrt(stiffness * mass),
        mass,
      })
      return {
        kind: 'spring',
        durationMs: duration ?? canonical.duration,
        bounce: typeof config.bounce === 'number' ? config.bounce : canonical.bounce,
        stiffness,
        damping: damping ?? 2 * Math.sqrt(stiffness * mass),
        mass,
        extra: config,
      }
    }
    if (duration !== undefined) {
      return springTiming(
        duration,
        typeof config.bounce === 'number' ? config.bounce : 0,
        config
      )
    }
    return null
  }

  if (duration === undefined) return null
  const easing = typeof config.easing === 'string' ? config.easing : 'ease'
  return { kind: 'timing', durationMs: duration, easing }
}

/**
 * lowers a grammar timing atom into driver values, resolving a preset name
 * against the driver's configured animations.
 */
function timingToDriver(
  timing: TransitionTiming,
  animations: Record<string, unknown> | null
): DriverTiming | null {
  if (timing.type === 'css') {
    return {
      kind: 'timing',
      durationMs: timeToMs(timing.duration),
      easing: timing.timingFunction,
    }
  }

  if (timing.type === 'spring') {
    return springTiming(
      timeToMs(timing.duration),
      timing.bounce,
      timing.config as Record<string, unknown> | undefined
    )
  }

  const preset = animations?.[timing.name]
  if (preset === undefined) return null
  const base = presetToTiming(preset)
  if (!base || !timing.config) return base

  // authored overrides land on top of the preset, in the preset's own terms
  const overrides = timing.config as Record<string, unknown>
  if (base.kind === 'spring' || typeof overrides.bounce === 'number') {
    const overrideDuration =
      typeof overrides.duration === 'number'
        ? overrides.duration
        : typeof overrides.duration === 'string'
          ? timeToMs(overrides.duration)
          : undefined
    const overrideBounce =
      typeof overrides.bounce === 'number' ? overrides.bounce : undefined
    const durationMs = overrideDuration ?? base.durationMs
    const bounce = overrideBounce ?? (base.kind === 'spring' ? base.bounce : 0)
    let carried = base.kind === 'spring' ? base.extra : undefined
    // a duration or bounce override re-solves the spring, so a preset written as
    // stiffness/damping cannot pass those two through: they ARE what the
    // override replaces. mass belongs to the object rather than the curve, so it
    // carries. physics written in the override still win, exactly as elsewhere.
    if (carried && (overrideDuration !== undefined || overrideBounce !== undefined)) {
      const { stiffness, damping, ...rest } = carried
      carried = rest
    }
    return springTiming(durationMs, bounce, { ...carried, ...overrides })
  }

  return {
    kind: 'timing',
    durationMs:
      typeof overrides.duration === 'number'
        ? overrides.duration
        : typeof overrides.duration === 'string'
          ? timeToMs(overrides.duration)
          : base.durationMs,
    easing: typeof overrides.easing === 'string' ? overrides.easing : base.easing,
  }
}

const namedEasings: Record<string, readonly [number, number, number, number]> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
}

/**
 * a css easing as cubic-bezier control points, which is the only easing shape
 * reanimated, motion, and react-native all accept.
 *
 * returns null for `steps()` and `linear()`, which have no bezier equivalent.
 * a driver that gets null should fall back to its own default rather than
 * pretending it applied something.
 */
export function easingToBezier(
  easing: string
): readonly [number, number, number, number] | null {
  const named = namedEasings[easing]
  if (named) return named
  if (!easing.startsWith('cubic-bezier(')) return null
  const parts = easing.slice('cubic-bezier('.length, -1).split(',')
  if (parts.length !== 4) return null
  const points = parts.map((part) => Number.parseFloat(part))
  if (points.some((point) => !Number.isFinite(point))) return null
  return points as unknown as [number, number, number, number]
}

export interface ResolveTransitionOptions {
  /** the driver's animations config; its keys are the valid preset names */
  animations?: Record<string, unknown> | null
  /** config shorthands, so `transition="bg 200ms"` names backgroundColor */
  shorthands?: Record<string, string> | null
}

const cacheByAnimations = new WeakMap<object, Map<string, ResolvedTransition>>()
const objectCache = new WeakMap<object, ResolvedTransition>()
const noAnimations: Record<string, unknown> = {}

/**
 * parses and resolves a `transition` prop into driver-ready entries.
 *
 * memoized per (animations config, authored value), because this runs on every
 * render of every component carrying a transition.
 */
export function resolveTransition(
  transition: TransitionObjectValue | null | undefined,
  options: ResolveTransitionOptions = {}
): ResolvedTransition {
  if (transition == null || transition === '') return emptyResolved

  const animations = options.animations ?? null
  const cacheKey = (animations ?? noAnimations) as object

  if (typeof transition === 'string') {
    let byValue = cacheByAnimations.get(cacheKey)
    if (!byValue) {
      byValue = new Map()
      cacheByAnimations.set(cacheKey, byValue)
    }
    const hit = byValue.get(transition)
    if (hit) return hit
    const built = buildResolved(transition, animations, options.shorthands ?? null)
    // an authored value set is bounded in practice, but a codegen loop is not
    if (byValue.size > 2048) byValue.clear()
    byValue.set(transition, built)
    return built
  }

  if (typeof transition !== 'object') return emptyResolved
  const hit = objectCache.get(transition)
  if (hit) return hit
  const built = buildResolved(transition, animations, options.shorthands ?? null)
  objectCache.set(transition, built)
  return built
}

function buildResolved(
  transition: TransitionObjectValue,
  animations: Record<string, unknown> | null,
  shorthands: Record<string, string> | null
): ResolvedTransition {
  const presetNames = animations ? new Set(Object.keys(animations)) : undefined
  const parsed = parseTransitionObject(transition, presetNames)

  if (!parsed.ok) {
    return { ...emptyResolved, diagnostics: parsed.diagnostics }
  }
  if (parsed.value.kind !== 'transition') return emptyResolved

  return fromEntries(
    parsed.value.entries,
    animations,
    shorthands,
    parsed.value.enter
      ? fromEntries(parsed.value.enter, animations, shorthands, null, null)
      : null,
    parsed.value.exit
      ? fromEntries(parsed.value.exit, animations, shorthands, null, null)
      : null
  )
}

const transformFamily = ['transform', 'translate', 'scale', 'rotate'] as const

function fromEntries(
  source: readonly TransitionEntry[],
  animations: Record<string, unknown> | null,
  shorthands: Record<string, string> | null,
  enter: ResolvedTransition | null,
  exit: ResolvedTransition | null
): ResolvedTransition {
  const entries: ResolvedEntry[] = []
  const byProperty: Record<string, ResolvedEntry> = {}
  const diagnostics: TransitionDiagnostic[] = []
  let all: ResolvedEntry | null = null
  let none = false
  let fused = false

  for (const entry of source) {
    if (entry.property === 'none') {
      none = true
      continue
    }

    if (entry.timing.type !== 'css') fused = true

    const timing = timingToDriver(entry.timing, animations)
    if (!timing) {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: entry.timing.type === 'preset' ? entry.timing.name : undefined,
        message:
          entry.timing.type === 'preset'
            ? `"${entry.timing.name}" is not a configured animation`
            : 'transition timing could not be resolved',
      })
      continue
    }

    const expanded = shorthands?.[entry.property] ?? entry.property
    const property = canonicalTransitionProperty(expanded)
    const delayMs = timeToMs(entry.delay)
    // tamagui writes x/y into the css `translate` longhand, scale into
    // `scale` and rotate into `rotate`, so an authored `transform` covers the
    // whole family or it transitions nothing the author can see.
    for (const name of expanded === 'transform' ? transformFamily : [property]) {
      const resolved: ResolvedEntry = {
        property: name,
        timing,
        delayMs,
        behavior: entry.behavior,
      }
      entries.push(resolved)
      // last wins, exactly as a stylesheet resolves a repeated property
      if (name === 'all') all = resolved
      else byProperty[name] = resolved
    }
  }

  return { entries, all, byProperty, none, fused, enter, exit, diagnostics }
}

/**
 * the transition that applies to one style key, under css last-wins.
 *
 * an authored `transform` already expanded into the whole family in
 * `fromEntries`, so `x`, `scale` and `rotate` find a direct entry here.
 */
export function getTransitionForKey(
  resolved: ResolvedTransition,
  key: string
): ResolvedEntry | null {
  if (resolved.none) return null
  const direct = resolved.byProperty[canonicalTransitionProperty(key)]
  if (direct) return direct
  return resolved.all
}

/** true when anything at all will animate */
export function hasTransition(resolved: ResolvedTransition): boolean {
  return !resolved.none && resolved.entries.length > 0
}

/**
 * how long a timing actually runs, which for a spring is its settle time and
 * not its nominal duration. this is the number a completion deadline needs.
 */
export function getSettleMs(timing: DriverTiming): number {
  if (timing.kind === 'timing') return timing.durationMs
  return springSettleTime({ duration: timing.durationMs, bounce: timing.bounce })
}

/** the longest anything will take, for the driver's completion bookkeeping */
export function getMaxDurationMs(resolved: ResolvedTransition): number {
  let max = 0
  for (const entry of resolved.entries) {
    const total = getSettleMs(entry.timing) + entry.delayMs
    if (total > max) max = total
  }
  return max
}

const linearEasingCache = new Map<string, { easing: string; durationMs: number }>()

/**
 * one entry as css. a spring becomes a `linear()` easing sampled across its
 * settle time, which is how a real spring curve, overshoot included, survives
 * with no javascript running.
 */
export function entryToCSS(entry: ResolvedEntry): string {
  const delay = entry.delayMs ? ` ${entry.delayMs}ms` : ''
  const behavior = entry.behavior === 'allow-discrete' ? ' allow-discrete' : ''

  if (entry.timing.kind === 'timing') {
    return `${entry.property} ${entry.timing.durationMs}ms ${entry.timing.easing}${delay}${behavior}`
  }

  const key = `${entry.timing.durationMs}/${entry.timing.bounce}`
  let spring = linearEasingCache.get(key)
  if (!spring) {
    spring = springToLinearEasing({
      duration: entry.timing.durationMs,
      bounce: entry.timing.bounce,
    })
    if (linearEasingCache.size > 256) linearEasingCache.clear()
    linearEasingCache.set(key, spring)
  }
  return `${entry.property} ${Math.round(spring.durationMs)}ms ${spring.easing}${delay}${behavior}`
}

/**
 * the whole resolution as a css `transition` value, or `undefined` when
 * nothing animates. entry order is preserved, so css last-wins does the
 * per-property resolution for us in the browser.
 */
export function toCSSTransition(resolved: ResolvedTransition): string | undefined {
  if (resolved.none) return 'none'
  if (!resolved.entries.length) return undefined

  let out = ''
  for (const entry of resolved.entries) {
    out += `${out ? ', ' : ''}${entryToCSS(entry)}`
  }
  return out || undefined
}

// see `transitionResolver.ts`: this is what keeps the grammar out of a bundle
// that has no animation driver in it.
setTransitionResolver({ resolve: resolveTransition, toCSS: toCSSTransition })
