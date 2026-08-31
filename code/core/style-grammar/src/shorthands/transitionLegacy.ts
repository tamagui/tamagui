import type {
  TransitionDiagnostic,
  TransitionEntry,
  TransitionIR,
  TransitionParseResult,
} from './transition'
import { parseTransition } from './transition'

export type LegacyTransitionValue =
  | string
  | Readonly<Record<string, unknown>>
  | readonly [string, Readonly<Record<string, unknown>>]

const legacyControlKeys = new Set([
  'default',
  'enter',
  'exit',
  'delay',
  'stiffness',
  'damping',
  'mass',
  'tension',
  'friction',
  'velocity',
  'overshootClamping',
  'duration',
  'bounciness',
  'speed',
])
const springConfigKeys = new Set([
  'stiffness',
  'damping',
  'mass',
  'tension',
  'friction',
  'velocity',
  'overshootClamping',
  'duration',
  'bounciness',
  'speed',
])

/**
 * lowers the legacy array and per-property object forms into transition IR.
 * per-property presets and spring overrides remain explicit driver config.
 */
export function migrateLegacyTransition(
  input: LegacyTransitionValue,
  presetNames: ReadonlySet<string>
): TransitionParseResult {
  if (typeof input === 'string') return parseTransition(input, presetNames)

  const inputIsTuple = Array.isArray(input)
  const options = (
    inputIsTuple
      ? (input as readonly [string, Readonly<Record<string, unknown>>])[1]
      : input
  ) as Readonly<Record<string, unknown>>
  const defaultValue = inputIsTuple
    ? (input as readonly [string, Readonly<Record<string, unknown>>])[0]
    : options.default
  const diagnostics: TransitionDiagnostic[] = []

  const delay =
    options.delay === undefined
      ? undefined
      : typeof options.delay === 'number' && Number.isFinite(options.delay)
        ? `${options.delay}ms`
        : null

  if (delay === null) {
    diagnostics.push({
      code: 'transition-invalid-token',
      token: String(options.delay),
      message: 'legacy transition delay must be a finite number of milliseconds',
    })
  }

  const resolveTiming = (
    rawValue: string,
    field: string
  ): TransitionEntry | undefined => {
    const parsed = parseTransition(rawValue, presetNames)
    if (!parsed.ok) {
      for (let index = 0; index < parsed.diagnostics.length; index++) {
        const diagnostic = parsed.diagnostics[index]
        diagnostics.push({
          ...diagnostic,
          message: `legacy transition ${field}: ${diagnostic.message}`,
        })
      }
      return
    }
    if (
      parsed.value.kind !== 'transition' ||
      parsed.value.entries.length !== 1 ||
      parsed.value.entries[0].property !== 'all'
    ) {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: rawValue,
        message: `legacy transition ${field} must be a preset or CSS timing value`,
      })
      return
    }
    return parsed.value.entries[0]
  }

  let defaultTransition: TransitionEntry | undefined
  if (defaultValue !== undefined) {
    if (typeof defaultValue === 'string') {
      defaultTransition = resolveTiming(defaultValue, 'default')
    } else {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: String(defaultValue),
        message: 'legacy transition default must be a preset or CSS timing value',
      })
    }
  }

  const resolveLifecycle = (field: 'enter' | 'exit'): TransitionEntry | undefined => {
    const rawValue = options[field]
    if (rawValue === undefined) return
    if (typeof rawValue === 'string') return resolveTiming(rawValue, field)
    diagnostics.push({
      code: 'transition-invalid-token',
      token: String(rawValue),
      message: `legacy transition ${field} must be a preset or CSS timing value`,
    })
    return
  }
  const enter = resolveLifecycle('enter')
  const exit = resolveLifecycle('exit')

  const config: Record<string, unknown> = {}
  for (const key of springConfigKeys) {
    if (options[key] !== undefined) config[key] = options[key]
  }
  const hasConfig = Object.keys(config).length > 0

  const entries: TransitionEntry[] = []
  if (defaultTransition) {
    if (defaultTransition.timing.type === 'css' && hasConfig) {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: String(defaultValue),
        message: 'spring overrides cannot be applied to CSS transition timing',
      })
    }
    entries.push({
      ...defaultTransition,
      delay: delay ?? defaultTransition.delay,
      timing:
        defaultTransition.timing.type === 'preset' && hasConfig
          ? { ...defaultTransition.timing, config }
          : defaultTransition.timing,
    })
  }

  for (const [property, rawValue] of Object.entries(options)) {
    if (legacyControlKeys.has(property)) continue

    let transition: TransitionEntry | undefined
    let propertyConfig: Readonly<Record<string, unknown>> | undefined
    if (typeof rawValue === 'string') {
      transition = resolveTiming(rawValue, property)
      if (!transition) continue
    } else if (rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)) {
      propertyConfig = rawValue as Readonly<Record<string, unknown>>
      if (propertyConfig.type === undefined) {
        transition = defaultTransition
      } else if (typeof propertyConfig.type === 'string') {
        transition = resolveTiming(propertyConfig.type, property)
        if (!transition) continue
      } else {
        diagnostics.push({
          code: 'transition-invalid-token',
          token: property,
          message: `legacy transition property "${property}" has a non-string type`,
        })
        continue
      }
    } else {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: property,
        message: `legacy transition property "${property}" needs a preset, CSS timing value, or default`,
      })
      continue
    }

    if (!transition) {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: property,
        message: `legacy transition property "${property}" needs a preset, CSS timing value, or default`,
      })
      continue
    }

    const propertyOverrides = propertyConfig
      ? Object.fromEntries(
          Object.entries(propertyConfig).filter(([key]) => key !== 'type')
        )
      : undefined
    const hasPropertyOverrides =
      propertyOverrides !== undefined && Object.keys(propertyOverrides).length > 0
    if (hasPropertyOverrides && transition.timing.type === 'css') {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: property,
        message: `legacy transition property "${property}" cannot apply spring overrides to CSS timing`,
      })
      continue
    }
    entries.push({
      ...transition,
      property,
      timing:
        transition.timing.type === 'preset' && propertyOverrides && hasPropertyOverrides
          ? { ...transition.timing, config: propertyOverrides }
          : transition.timing,
      delay: delay ?? transition.delay,
    })
  }

  if (diagnostics.length) return { ok: false, diagnostics }
  const value: TransitionIR = {
    kind: 'transition',
    entries,
    ...(enter ? { enter: { ...enter, delay: delay ?? enter.delay } } : {}),
    ...(exit ? { exit: { ...exit, delay: delay ?? exit.delay } } : {}),
    ...(hasConfig ? { config } : {}),
  }
  return { ok: true, value }
}
