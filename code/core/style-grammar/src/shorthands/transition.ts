export type TransitionBehavior = 'normal' | 'allow-discrete'

export interface CSSTransitionTiming {
  type: 'css'
  duration: string
  timingFunction: string
}

export interface PresetTransitionTiming {
  type: 'preset'
  name: string
  config?: Readonly<Record<string, unknown>>
}

/**
 * a spring occupies the fused duration+timingFunction pair, exactly like a
 * preset: CSS has no spring easing, so it is not decomposable into css
 * components and the duration/timing-function longhands cannot reach inside it.
 *
 * `duration` is the perceptual duration, defined as the undamped period
 * `2pi / sqrt(stiffness / mass)` (SwiftUI's convention). `bounce` is 0 for
 * critically damped, approaches 1 for undamped oscillation, and goes negative
 * for overdamped. Drivers solve these into their own parameters; the low-level
 * `stiffness`/`damping`/`mass` escape hatch rides along in `config`.
 */
export interface SpringTransitionTiming {
  type: 'spring'
  duration: string
  bounce: number
  config?: Readonly<Record<string, unknown>>
}

export type TransitionTiming =
  | CSSTransitionTiming
  | PresetTransitionTiming
  | SpringTransitionTiming

export interface TransitionEntry {
  property: string
  timing: TransitionTiming
  delay: string
  behavior: TransitionBehavior
}

export interface TransitionIR {
  kind: 'transition'
  entries: readonly TransitionEntry[]
  enter?: TransitionEntry
  exit?: TransitionEntry
  config?: Readonly<Record<string, unknown>>
}

export interface TransitionGlobalIR {
  kind: 'global'
  value: 'inherit' | 'initial' | 'revert' | 'revert-layer' | 'unset'
}

export type ParsedTransition = TransitionIR | TransitionGlobalIR

export interface TransitionDiagnostic {
  code:
    | 'transition-empty-item'
    | 'transition-invalid-token'
    | 'transition-duplicate-component'
    | 'transition-invalid-duration'
    | 'transition-invalid-list'
    | 'transition-invalid-spring'
  message: string
  item?: string
  token?: string
}

export type TransitionParseResult =
  | {
      ok: true
      value: ParsedTransition
    }
  | {
      ok: false
      diagnostics: readonly TransitionDiagnostic[]
    }

export interface TransitionLonghands {
  transitionProperty?: string
  transitionDuration?: string
  transitionTimingFunction?: string
  transitionDelay?: string
  transitionBehavior?: string
}

const globalValues = new Set(['inherit', 'initial', 'revert', 'revert-layer', 'unset'])
const timingKeywords = new Set([
  'ease',
  'linear',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'step-start',
  'step-end',
])
const behaviorValues = new Set(['normal', 'allow-discrete'])
const reservedPresetNames = new Set([
  ...globalValues,
  ...timingKeywords,
  ...behaviorValues,
  'all',
  'none',
])
const noPresetNames: ReadonlySet<string> = new Set()
const identifierPattern = /^-?(?:[_a-zA-Z]|[^\0-\x7f])(?:[-_a-zA-Z0-9]|[^\0-\x7f])*$/
const timePattern = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(ms|s)$/

function splitTopLevel(input: string, separator: ',' | ' '): string[] | null {
  const values: string[] = []
  let start = 0
  let depth = 0
  let quote = ''

  for (let index = 0; index < input.length; index++) {
    const character = input[index]
    if (quote) {
      if (character === '\\') index++
      else if (character === quote) quote = ''
      continue
    }
    if (character === '"' || character === "'") {
      quote = character
      continue
    }
    if (character === '(') {
      depth++
      continue
    }
    if (character === ')') {
      depth--
      if (depth < 0) return null
      continue
    }
    if (depth !== 0) continue

    const matches = separator === ',' ? character === ',' : /\s/.test(character)
    if (!matches) continue

    const value = input.slice(start, index).trim()
    if (value) values.push(value)
    else if (separator === ',') values.push('')
    start = index + 1
    if (separator === ' ') {
      while (start < input.length && /\s/.test(input[start])) start++
      index = start - 1
    }
  }

  if (depth !== 0 || quote) return null
  values.push(input.slice(start).trim())
  return values
}

function isTime(value: string): boolean {
  return timePattern.test(value)
}

function isTimingFunction(value: string): boolean {
  if (timingKeywords.has(value)) return true
  if (/^cubic-bezier\(\s*[^)]+\s*\)$/.test(value)) {
    const values = value.slice(value.indexOf('(') + 1, -1).split(',')
    if (values.length !== 4) return false
    const numbers: number[] = []
    for (let index = 0; index < values.length; index++) {
      const number = Number(values[index].trim())
      if (!Number.isFinite(number)) return false
      numbers.push(number)
    }
    return numbers[0] >= 0 && numbers[0] <= 1 && numbers[2] >= 0 && numbers[2] <= 1
  }
  if (/^steps\(\s*[^)]+\s*\)$/.test(value)) {
    const parts = value.slice(value.indexOf('(') + 1, -1).split(',')
    if (parts.length > 2) return false
    const count = Number(parts[0].trim())
    if (!Number.isInteger(count) || count <= 0) return false
    const position = parts[1]?.trim()
    if (
      position !== undefined &&
      !/^(jump-start|jump-end|jump-none|jump-both|start|end)$/.test(position)
    ) {
      return false
    }
    return position !== 'jump-none' || count > 1
  }
  if (/^linear\(\s*[^)]+\s*\)$/.test(value)) return true
  return false
}

const springPattern = /^spring\(\s*([^)]*)\s*\)$/

/**
 * parses `spring(<duration>)` or `spring(<duration>, <bounce>)`.
 *
 * returns undefined when the token is not spring-shaped at all, so the caller
 * can keep trying other token kinds, and a diagnostic when it is spring-shaped
 * but wrong, so a typo inside the parens is never silently read as a property.
 */
function parseSpring(
  token: string
): SpringTransitionTiming | TransitionDiagnostic | undefined {
  const match = springPattern.exec(token)
  if (!match) return undefined

  const args = splitTopLevel(match[1], ',')
  if (args === null || args.length === 0 || args.length > 2 || !args[0]) {
    return {
      code: 'transition-invalid-spring',
      token,
      message: `"${token}" must be spring(<duration>) or spring(<duration>, <bounce>)`,
    }
  }

  const duration = args[0]
  if (!isTime(duration) || Number(duration.match(timePattern)?.[1]) < 0) {
    return {
      code: 'transition-invalid-spring',
      token,
      message: `spring duration "${duration}" must be a non-negative time`,
    }
  }

  if (args.length === 1) {
    return { type: 'spring', duration, bounce: 0 }
  }

  const bounce = Number(args[1])
  if (!Number.isFinite(bounce) || bounce <= -1 || bounce >= 1) {
    return {
      code: 'transition-invalid-spring',
      token,
      message: `spring bounce "${args[1]}" must be a number between -1 and 1 (0 is critically damped)`,
    }
  }

  return { type: 'spring', duration, bounce }
}

function parseSingleTransition(
  item: string,
  presetNames: ReadonlySet<string> = noPresetNames
): TransitionEntry | TransitionDiagnostic {
  const tokens = splitTopLevel(item, ' ')
  if (tokens === null || tokens.length === 0) {
    return {
      code: 'transition-invalid-token',
      item,
      message: `"${item}" is not a balanced CSS transition`,
    }
  }
  for (let index = 0; index < tokens.length; index++) {
    if (!tokens[index]) {
      return {
        code: 'transition-invalid-token',
        item,
        message: `"${item}" is not a balanced CSS transition`,
      }
    }
  }

  let property: string | undefined
  let duration: string | undefined
  let delay: string | undefined
  let timingFunction: string | undefined
  let behavior: TransitionBehavior | undefined
  // a preset or a spring: an opaque atom filling the duration+timingFunction
  // pair, so an entry carrying one accepts no separate duration or easing
  let fused: PresetTransitionTiming | SpringTransitionTiming | undefined
  // collected order-independently, like every other css shorthand component,
  // and assigned to duration/delay once we know whether a fused atom is present
  const times: string[] = []

  for (const token of tokens) {
    if (globalValues.has(token)) {
      return {
        code: 'transition-invalid-list',
        item,
        token,
        message: `CSS-wide value "${token}" must be the whole transition`,
      }
    }
    if (isTime(token)) {
      if (times.length === 2) {
        return {
          code: 'transition-duplicate-component',
          item,
          token,
          message: `"${item}" has more than two time values`,
        }
      }
      times.push(token)
      continue
    }

    const spring = parseSpring(token)
    if (spring !== undefined) {
      if ('code' in spring) return { ...spring, item }
      if (fused !== undefined) {
        return {
          code: 'transition-duplicate-component',
          item,
          token,
          message: `"${item}" has more than one preset or spring`,
        }
      }
      fused = spring
      continue
    }

    if (isTimingFunction(token)) {
      if (timingFunction !== undefined) {
        return {
          code: 'transition-duplicate-component',
          item,
          token,
          message: `"${item}" has more than one timing function`,
        }
      }
      timingFunction = token
      continue
    }

    if (behaviorValues.has(token)) {
      if (behavior !== undefined) {
        return {
          code: 'transition-duplicate-component',
          item,
          token,
          message: `"${item}" has more than one transition behavior`,
        }
      }
      behavior = token as TransitionBehavior
      continue
    }

    // config-first identifier: an exact configured animation name is a preset,
    // never a property. reserved css names can never be presets.
    if (!reservedPresetNames.has(token) && presetNames.has(token)) {
      if (fused !== undefined) {
        return {
          code: 'transition-duplicate-component',
          item,
          token,
          message: `"${item}" has more than one preset or spring`,
        }
      }
      fused = { type: 'preset', name: token }
      continue
    }

    if (identifierPattern.test(token) || /^--[-_a-zA-Z0-9]+$/.test(token)) {
      if (property !== undefined) {
        return {
          code: 'transition-duplicate-component',
          item,
          token,
          message: `"${item}" has more than one transition property`,
        }
      }
      property = token
      continue
    }

    return {
      code: 'transition-invalid-token',
      item,
      token,
      message: `"${token}" is not valid in a CSS transition`,
    }
  }

  if (fused !== undefined) {
    // the atom carries its own duration and easing, so a lone time is the delay
    if (timingFunction !== undefined) {
      return {
        code: 'transition-invalid-list',
        item,
        message: `"${item}" sets a timing function on a ${fused.type}, which already carries its own easing`,
      }
    }
    if (times.length > 1) {
      return {
        code: 'transition-duplicate-component',
        item,
        message: `"${item}" has more than one time value; a ${fused.type} carries its own duration, so only a delay may follow it`,
      }
    }
    delay = times[0]
  } else {
    duration = times[0]
    delay = times[1]
    if (duration !== undefined && Number(duration.match(timePattern)?.[1]) < 0) {
      return {
        code: 'transition-invalid-duration',
        item,
        token: duration,
        message: `transition duration "${duration}" cannot be negative`,
      }
    }
  }

  if (
    property === 'none' &&
    (fused !== undefined ||
      duration !== undefined ||
      delay !== undefined ||
      timingFunction !== undefined ||
      behavior !== undefined)
  ) {
    return {
      code: 'transition-invalid-list',
      item,
      message: '"none" cannot be combined with other transition components',
    }
  }

  return {
    property: property ?? 'all',
    timing: fused ?? {
      type: 'css',
      duration: duration ?? '0s',
      timingFunction: timingFunction ?? 'ease',
    },
    delay: delay ?? '0s',
    behavior: behavior ?? 'normal',
  }
}

/**
 * parses CSS transition shorthand or an exact configured preset name.
 *
 * duration-shaped values and css-reserved names always use css semantics.
 * preset matching is exact and never infers aliases.
 */
export function parseTransition(
  input: string,
  presetNames: ReadonlySet<string> = noPresetNames
): TransitionParseResult {
  const value = input.trim()
  if (!value) {
    return {
      ok: false,
      diagnostics: [
        {
          code: 'transition-empty-item',
          message: 'transition cannot be empty',
        },
      ],
    }
  }

  if (globalValues.has(value)) {
    return {
      ok: true,
      value: {
        kind: 'global',
        value: value as TransitionGlobalIR['value'],
      },
    }
  }

  const items = splitTopLevel(value, ',')
  if (items === null) {
    return {
      ok: false,
      diagnostics: [
        {
          code: 'transition-invalid-token',
          item: value,
          message: `"${value}" is not a balanced CSS transition`,
        },
      ],
    }
  }

  const entries: TransitionEntry[] = []
  const diagnostics: TransitionDiagnostic[] = []
  for (const item of items) {
    if (!item) {
      diagnostics.push({
        code: 'transition-empty-item',
        message: 'transition lists cannot contain an empty item',
      })
      continue
    }
    const parsed = parseSingleTransition(item, presetNames)
    if ('code' in parsed) diagnostics.push(parsed)
    else entries.push(parsed)
  }

  let hasNone = false
  for (let index = 0; index < entries.length; index++) {
    if (entries[index].property === 'none') {
      hasNone = true
      break
    }
  }
  if (hasNone && entries.length > 1) {
    diagnostics.push({
      code: 'transition-invalid-list',
      message: '"none" cannot be combined with other transition items',
    })
  }

  return diagnostics.length
    ? { ok: false, diagnostics }
    : { ok: true, value: { kind: 'transition', entries } }
}

function parseLonghandList(value: string | undefined, fallback: string): string[] | null {
  if (value === undefined) return [fallback]
  const values = splitTopLevel(value, ',')
  if (!values?.length) return null
  for (let index = 0; index < values.length; index++) {
    if (!values[index]) return null
  }
  return values
}

/**
 * lowers the five CSS transition longhands into the same IR as the shorthand.
 * css list repetition is based on transition-property, as in the browser.
 */
export function parseTransitionLonghands(
  input: TransitionLonghands
): TransitionParseResult {
  const properties = parseLonghandList(input.transitionProperty, 'all')
  const durations = parseLonghandList(input.transitionDuration, '0s')
  const timings = parseLonghandList(input.transitionTimingFunction, 'ease')
  const delays = parseLonghandList(input.transitionDelay, '0s')
  const behaviors = parseLonghandList(input.transitionBehavior, 'normal')

  if (!properties || !durations || !timings || !delays || !behaviors) {
    return {
      ok: false,
      diagnostics: [
        {
          code: 'transition-invalid-list',
          message: 'transition longhands must be non-empty comma-separated lists',
        },
      ],
    }
  }

  const entries: TransitionEntry[] = []
  const diagnostics: TransitionDiagnostic[] = []
  for (let index = 0; index < properties.length; index++) {
    const property = properties[index]
    const duration = durations[index % durations.length]
    const timingFunction = timings[index % timings.length]
    const delay = delays[index % delays.length]
    const behavior = behaviors[index % behaviors.length]

    if (
      globalValues.has(property) ||
      globalValues.has(duration) ||
      globalValues.has(timingFunction) ||
      globalValues.has(delay) ||
      globalValues.has(behavior)
    ) {
      diagnostics.push({
        code: 'transition-invalid-list',
        message:
          'CSS-wide values cannot be mixed into transition longhand lists; use the transition shorthand global value',
      })
      break
    }
    if (!(identifierPattern.test(property) || /^--[-_a-zA-Z0-9]+$/.test(property))) {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: property,
        message: `"${property}" is not a transition property`,
      })
    }
    if (!isTime(duration) || Number(duration.match(timePattern)?.[1]) < 0) {
      diagnostics.push({
        code: 'transition-invalid-duration',
        token: duration,
        message: `"${duration}" is not a non-negative transition duration`,
      })
    }
    if (!isTimingFunction(timingFunction)) {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: timingFunction,
        message: `"${timingFunction}" is not a transition timing function`,
      })
    }
    if (!isTime(delay)) {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: delay,
        message: `"${delay}" is not a transition delay`,
      })
    }
    if (!behaviorValues.has(behavior)) {
      diagnostics.push({
        code: 'transition-invalid-token',
        token: behavior,
        message: `"${behavior}" is not a transition behavior`,
      })
    }

    entries.push({
      property,
      timing: { type: 'css', duration, timingFunction },
      delay,
      behavior: behavior as TransitionBehavior,
    })
  }

  let hasNone = false
  for (let index = 0; index < properties.length; index++) {
    if (properties[index] === 'none') {
      hasNone = true
      break
    }
  }
  if (hasNone && properties.length > 1) {
    diagnostics.push({
      code: 'transition-invalid-list',
      message: '"none" cannot be combined with other transition properties',
    })
  }

  return diagnostics.length
    ? { ok: false, diagnostics }
    : { ok: true, value: { kind: 'transition', entries } }
}

export function serializeTransition(value: ParsedTransition): string | null {
  if (value.kind === 'global') return value.value
  if (value.enter || value.exit || value.config) return null
  // presets and springs are opaque atoms with no css spelling
  for (let index = 0; index < value.entries.length; index++) {
    if (value.entries[index].timing.type !== 'css') return null
  }

  let serialized = ''
  for (let index = 0; index < value.entries.length; index++) {
    const entry = value.entries[index]
    if (index) serialized += ', '
    if (entry.timing.type !== 'css') return null
    if (entry.property === 'none') {
      if (
        entry.timing.duration !== '0s' ||
        entry.timing.timingFunction !== 'ease' ||
        entry.delay !== '0s' ||
        entry.behavior !== 'normal'
      ) {
        return null
      }
      serialized += 'none'
      continue
    }
    serialized += `${entry.property} ${entry.timing.duration} ${entry.timing.timingFunction} ${entry.delay} ${entry.behavior}`
  }
  return serialized
}
