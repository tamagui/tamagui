import {
  addTransformValue,
  createTransformAccumulator,
  finalizeTransformAccumulator,
} from './transformAccumulator'

// The transform family.
//
// See plans/dom-tailwind-flat-values.md — "The transform family" — and the
// Transforms section of plans/react-native-style-capabilities.md for the RN
// facts every choice here cites.
//
// `x`, `y`, `scale`, and `rotate` stay first-class props, each its own program
// with independent clause replacement, which is what makes `scale="1 enter:0.9"`
// an independently replaceable lifecycle program.
//
// Web: uniform `scale` and `rotate` lower to the CSS individual properties
// directly. Where two programs share one CSS property — `x` and `y` both feed
// `translate`, `scaleX`/`scaleY` both feed `scale` — each program owns a per-axis
// custom property and one static rule composes them. Transitions survive that
// indirection because changing a custom property triggers transitions on the
// property consuming it (browser-verified 2026-07-29).
//
// Native: RN has no individual transform properties through 0.86, so the caller
// composes one array in authored order. That order is semantic because array
// entries are matrix-multiplied in sequence.

export interface TransformComposition {
  /** the CSS property the axis variables compose into */
  property: string
  /** local axis defaults that prevent inherited parent transforms from leaking in */
  defaults: Readonly<Record<string, string>>
  /** the composing declaration value, with per-axis fallbacks */
  value: string
}

export type TransformTargetKind =
  /** the program writes the CSS individual property directly */
  | 'property'
  /** the program writes a per-axis custom property that a static rule composes */
  | 'axis-variable'

export interface TransformTarget {
  prop: string
  kind: TransformTargetKind
  /** the declaration this program writes, and the property it hashes under */
  declaration: string
  /** the CSS property that ultimately changes; two targets sharing this and
   *  differing in `kind` would fight for one declaration */
  effectiveProperty: string
  /** present for `axis-variable` targets */
  composition?: TransformComposition
}

// `0px` rather than `0` so the fallback is unambiguous in both slots
const translateComposition: TransformComposition = Object.freeze({
  property: 'translate',
  defaults: Object.freeze({ '--t-x': '0px', '--t-y': '0px' }),
  value: 'var(--t-x, 0px) var(--t-y, 0px)',
})

const scaleComposition: TransformComposition = Object.freeze({
  property: 'scale',
  defaults: Object.freeze({ '--t-scale-x': '1', '--t-scale-y': '1' }),
  value: 'var(--t-scale-x, 1) var(--t-scale-y, 1)',
})

/**
 * One entry per program TARGET. Uniform `scale` is absent on purpose: it expands
 * to both axis targets the way `padding` expands to four sides, so no two
 * mechanisms ever write the CSS `scale` property and a later `scaleX` replaces
 * just its axis through the ordinary forward merge.
 */
export const transformFamilyTargets: Readonly<Record<string, TransformTarget>> =
  Object.freeze({
    x: {
      prop: 'x',
      kind: 'axis-variable',
      declaration: '--t-x',
      effectiveProperty: 'translate',
      composition: translateComposition,
    },
    y: {
      prop: 'y',
      kind: 'axis-variable',
      declaration: '--t-y',
      effectiveProperty: 'translate',
      composition: translateComposition,
    },
    scaleX: {
      prop: 'scaleX',
      kind: 'axis-variable',
      declaration: '--t-scale-x',
      effectiveProperty: 'scale',
      composition: scaleComposition,
    },
    scaleY: {
      prop: 'scaleY',
      kind: 'axis-variable',
      declaration: '--t-scale-y',
      effectiveProperty: 'scale',
      composition: scaleComposition,
    },
    rotate: {
      prop: 'rotate',
      kind: 'property',
      declaration: 'rotate',
      effectiveProperty: 'rotate',
    },
  })

/** authored prop -> the targets it contributes, uniform `scale` expanding to both axes */
const transformPropTargets: Readonly<Record<string, readonly TransformTarget[]>> =
  Object.freeze({
    x: [transformFamilyTargets.x],
    y: [transformFamilyTargets.y],
    rotate: [transformFamilyTargets.rotate],
    scaleX: [transformFamilyTargets.scaleX],
    scaleY: [transformFamilyTargets.scaleY],
    scale: [transformFamilyTargets.scaleX, transformFamilyTargets.scaleY],
  })

/** the authored props that lower through the transform family */
export const transformFamilyProps: ReadonlySet<string> = new Set(
  Object.keys(transformPropTargets)
)

const noTargets: readonly TransformTarget[] = Object.freeze([])

/** the targets an authored transform prop contributes; empty when not in the family */
export function getTransformTargets(prop: string): readonly TransformTarget[] {
  return transformPropTargets[prop] ?? noTargets
}

/** the declarations an authored transform prop owns; empty when not in the family */
export function transformDeclarationsFor(prop: string): readonly string[] {
  return transformDeclarations[prop] ?? noDeclarations
}

const noDeclarations: readonly string[] = Object.freeze([])

const transformDeclarations: Readonly<Record<string, readonly string[]>> = Object.freeze({
  x: ['--t-x'],
  y: ['--t-y'],
  rotate: ['rotate'],
  scaleX: ['--t-scale-x'],
  scaleY: ['--t-scale-y'],
  scale: ['--t-scale-x', '--t-scale-y'],
})

/**
 * Declaration -> the authored prop it evaluates as on native, so the evaluator
 * can turn program results back into `composeTransformArray` input.
 */
export const transformPropForDeclaration: Readonly<Record<string, string>> =
  Object.freeze({
    '--t-x': 'x',
    '--t-y': 'y',
    '--t-scale-x': 'scaleX',
    '--t-scale-y': 'scaleY',
    rotate: 'rotate',
  })

/**
 * The unit a bare legacy number carries for each declaration, so a displaced
 * plain value lifts into a program base with the right spelling: lengths take
 * px, scale is unitless, rotate takes deg.
 */
export const transformDeclarationUnit: Readonly<Record<string, 'px' | 'none' | 'deg'>> =
  Object.freeze({
    '--t-x': 'px',
    '--t-y': 'px',
    '--t-scale-x': 'none',
    '--t-scale-y': 'none',
    rotate: 'deg',
  })

/** legacy flat transform keys that write a declaration, uniform parent last */
export const legacyTransformKeysFor: Readonly<Record<string, readonly string[]>> =
  Object.freeze({
    '--t-x': ['x'],
    '--t-y': ['y'],
    '--t-scale-x': ['scaleX', 'scale'],
    '--t-scale-y': ['scaleY', 'scale'],
    rotate: ['rotate'],
  })

/** the sibling axis a uniform legacy `scale` also covers */
export const uniformLegacySiblings: Readonly<Record<string, string>> = Object.freeze({
  '--t-scale-x': 'scaleY',
  '--t-scale-y': 'scaleX',
})

/**
 * Custom property -> the rule composing its axis group, so the web lowering can
 * emit the composing rule alongside an axis program without knowing the family.
 */
export const transformAxisCompositions: Readonly<Record<string, TransformComposition>> =
  Object.freeze({
    '--t-x': translateComposition,
    '--t-y': translateComposition,
    '--t-scale-x': scaleComposition,
    '--t-scale-y': scaleComposition,
  })

// ---------------------------------------------------------------------------
// native composition
// ---------------------------------------------------------------------------

/** one React Native transform array entry */
export type TransformEntry = Readonly<Record<string, string | number | readonly number[]>>

export type TransformDiagnosticCode =
  /** a CSS transform function RN cannot represent faithfully */
  | 'unsupported-transform-function'
  /** a unit RN's array form cannot carry (turn, em, rem, physical units) */
  | 'unsupported-transform-unit'
  /** matrix() with a length RN rejects (it requires 9 or 16 numbers) */
  | 'unsupported-matrix-length'
  /** a value that is invalid CSS without a unit, so web would drop it too */
  | 'unitless-transform-value'
  /** the raw transform string could not be tokenized */
  | 'malformed-transform'

export interface TransformDiagnostic {
  code: TransformDiagnosticCode
  /** the offending function, prop, or fragment */
  source: string
  message: string
}

/** evaluated program values, keyed by the authored transform prop */
export type TransformProgramResults = Readonly<
  Record<string, string | number | undefined | null>
>

export interface ComposedTransform {
  transform: TransformEntry[]
  errors: TransformDiagnostic[]
}

/**
 * Builds one RN transform array in authored order. A complete raw transform
 * owns the property when it follows transform parts. An unrepresentable value
 * is a diagnostic rather than a lossy forward to RN's permissive string parser.
 */
export function composeTransformArray(
  results: TransformProgramResults,
  rawTransform?: string | readonly TransformEntry[] | null
): ComposedTransform {
  const accumulator = createTransformAccumulator()
  const errors: TransformDiagnostic[] = []

  for (const prop in results) {
    const value = results[prop]
    if (value == null) continue
    if (prop === 'x' || prop === 'y') {
      const length = readLength(value, prop, errors)
      if (length !== null) addTransformValue(accumulator, prop, length)
    } else if (prop === 'rotate') {
      const angle = readAngle(value, prop, errors)
      if (angle !== null) addTransformValue(accumulator, prop, angle)
    } else if (prop === 'scale' || prop === 'scaleX' || prop === 'scaleY') {
      const number = readNumber(value, prop, errors)
      if (number !== null) addTransformValue(accumulator, prop, number)
    }
  }

  if (rawTransform != null) {
    if (typeof rawTransform === 'string') {
      const parsed = parseTransformString(rawTransform)
      for (const error of parsed.errors) errors.push(error)
      addTransformValue(accumulator, 'transform', parsed.transform)
    } else {
      addTransformValue(accumulator, 'transform', rawTransform)
    }
  }

  return {
    transform: finalizeTransformAccumulator(accumulator) as TransformEntry[],
    errors,
  }
}

/**
 * Parses a CSS transform string into RN array entries. Arrays are the only form
 * Animated and Reanimated can animate, so the string is parsed exactly once here
 * rather than handed to RN per frame.
 */
export function parseTransformString(input: string): ComposedTransform {
  const transform: TransformEntry[] = []
  const errors: TransformDiagnostic[] = []

  let index = 0
  const length = input.length

  while (index < length) {
    const code = input.charCodeAt(index)
    // whitespace and commas separate functions
    if (
      code === 32 ||
      code === 9 ||
      code === 10 ||
      code === 13 ||
      code === 12 ||
      code === 44
    ) {
      index++
      continue
    }

    const nameStart = index
    while (index < length && input.charCodeAt(index) !== 40 /* ( */) {
      const inner = input.charCodeAt(index)
      if (inner === 32 || inner === 44) break
      index++
    }
    const name = input.slice(nameStart, index).trim()

    if (input.charCodeAt(index) !== 40) {
      errors.push({
        code: 'malformed-transform',
        source: name || input.slice(nameStart),
        message: `transform: expected "(" after "${name || input.slice(nameStart)}"`,
      })
      return { transform, errors }
    }

    // arguments up to the matching paren
    index++
    const argsStart = index
    let depth = 1
    while (index < length && depth > 0) {
      const inner = input.charCodeAt(index)
      if (inner === 40) depth++
      else if (inner === 41) depth--
      if (depth > 0) index++
    }
    if (depth !== 0) {
      errors.push({
        code: 'malformed-transform',
        source: name,
        message: `transform: "${name}(" is never closed`,
      })
      return { transform, errors }
    }
    const args = input
      .slice(argsStart, index)
      .split(',')
      .map((arg) => arg.trim())
      .filter((arg) => arg.length > 0)
    index++

    readFunction(name, args, transform, errors)
  }

  return { transform, errors }
}

function readFunction(
  name: string,
  args: readonly string[],
  transform: TransformEntry[],
  errors: TransformDiagnostic[]
): void {
  switch (name) {
    case 'translate': {
      const x = readLength(args[0] ?? '0', 'translate', errors)
      if (x !== null) transform.push({ translateX: x })
      if (args.length > 1) {
        const y = readLength(args[1], 'translate', errors)
        if (y !== null) transform.push({ translateY: y })
      }
      return
    }
    case 'translateX':
    case 'translateY': {
      const value = readLength(args[0] ?? '0', name, errors)
      if (value !== null) transform.push({ [name]: value })
      return
    }
    case 'translate3d': {
      // the JS parser accepts translate3d but Fabric's reader takes two entries,
      // so decompose it and require a zero Z
      const z = args[2] ?? '0'
      if (readLength(z, name, []) !== 0) {
        errors.push({
          code: 'unsupported-transform-function',
          source: name,
          message: `transform: "${name}" with a non-zero Z is not supported on native; RN has no translateZ`,
        })
        return
      }
      const x = readLength(args[0] ?? '0', name, errors)
      if (x !== null) transform.push({ translateX: x })
      const y = readLength(args[1] ?? '0', name, errors)
      if (y !== null) transform.push({ translateY: y })
      return
    }
    case 'scale': {
      const first = readNumber(args[0] ?? '1', name, errors)
      if (first === null) return
      if (args.length < 2) {
        transform.push({ scale: first })
        return
      }
      const second = readNumber(args[1], name, errors)
      if (second === null) return
      if (first === second) {
        transform.push({ scale: first })
        return
      }
      transform.push({ scaleX: first })
      transform.push({ scaleY: second })
      return
    }
    case 'scaleX':
    case 'scaleY': {
      const value = readNumber(args[0] ?? '1', name, errors)
      if (value !== null) transform.push({ [name]: value })
      return
    }
    case 'rotate':
    case 'rotateX':
    case 'rotateY':
    case 'rotateZ':
    case 'skewX':
    case 'skewY': {
      const value = readAngle(args[0] ?? '0', name, errors)
      if (value !== null) transform.push({ [name]: value })
      return
    }
    case 'perspective': {
      const value = readLength(args[0] ?? '0', name, errors)
      if (typeof value === 'number') transform.push({ perspective: value })
      else if (value !== null) {
        errors.push({
          code: 'unsupported-transform-unit',
          source: name,
          message: `transform: "${name}" needs an absolute length, not "${args[0]}"`,
        })
      }
      return
    }
    case 'matrix': {
      // RN's parser requires 9 or 16 numbers; the standard six-number CSS
      // matrix() is rejected rather than silently reinterpreted
      const numbers: number[] = []
      for (const arg of args) {
        const value = readNumber(arg, name, errors)
        if (value === null) return
        numbers.push(value)
      }
      if (numbers.length !== 9 && numbers.length !== 16) {
        errors.push({
          code: 'unsupported-matrix-length',
          source: name,
          message: `transform: "matrix()" needs 9 or 16 numbers on native, got ${numbers.length}. The six-number CSS form has no faithful native lowering.`,
        })
        return
      }
      transform.push({ matrix: numbers })
      return
    }
    default: {
      errors.push({
        code: 'unsupported-transform-function',
        source: name,
        message: `transform: "${name}" has no faithful native lowering`,
      })
    }
  }
}

/** a length RN can carry: points as a number, or a percentage string */
function readLength(
  value: string | number,
  source: string,
  errors: TransformDiagnostic[]
): number | string | null {
  if (typeof value === 'number') return value
  const text = value.trim()
  if (text.endsWith('%')) {
    // array entries keep percentages: RN >= 0.75 resolves them against the
    // view's own size, and we never emit them inside a string
    return Number.isNaN(Number.parseFloat(text)) ? fail() : text
  }
  if (text.endsWith('px')) {
    const number = Number(text.slice(0, -2))
    return Number.isFinite(number) ? number : fail()
  }
  const bare = Number(text)
  if (Number.isFinite(bare)) {
    // `0` is valid CSS without a unit; any other bare number is not, and RN's
    // string parser would silently treat it as points
    if (bare === 0) return 0
    errors.push({
      code: 'unitless-transform-value',
      source,
      message: `transform: "${text}" needs a unit (px or %) in "${source}"; a bare number is invalid CSS`,
    })
    return null
  }
  return fail()

  function fail(): null {
    errors.push({
      code: 'unsupported-transform-unit',
      source,
      message: `transform: "${text}" is not a length native can carry in "${source}"; use px or %`,
    })
    return null
  }
}

/** an angle RN can carry: deg or rad, as a string */
function readAngle(
  value: string | number,
  source: string,
  errors: TransformDiagnostic[]
): string | null {
  if (typeof value === 'number') {
    if (value === 0) return '0deg'
    errors.push({
      code: 'unitless-transform-value',
      source,
      message: `transform: "${source}" needs deg or rad, got the bare number ${value}`,
    })
    return null
  }
  const text = value.trim()
  if (text.endsWith('deg') || text.endsWith('rad')) {
    return Number.isFinite(Number.parseFloat(text)) ? text : angleFail()
  }
  if (Number(text) === 0) return '0deg'
  if (text.endsWith('turn') || text.endsWith('grad')) {
    errors.push({
      code: 'unsupported-transform-unit',
      source,
      message: `transform: "${text}" — RN supports only deg and rad, not ${text.endsWith('turn') ? 'turn' : 'grad'}`,
    })
    return null
  }
  if (Number.isFinite(Number(text))) {
    errors.push({
      code: 'unitless-transform-value',
      source,
      message: `transform: "${source}" needs deg or rad, got "${text}"`,
    })
    return null
  }
  return angleFail()

  function angleFail(): null {
    errors.push({
      code: 'unsupported-transform-unit',
      source,
      message: `transform: "${text}" is not an angle native can carry in "${source}"`,
    })
    return null
  }
}

function readNumber(
  value: string | number,
  source: string,
  errors: TransformDiagnostic[]
): number | null {
  if (typeof value === 'number') return value
  const text = value.trim()
  const number = Number(text)
  if (Number.isFinite(number) && text !== '') return number
  errors.push({
    code: 'unsupported-transform-unit',
    source,
    message: `transform: "${text}" is not a plain number in "${source}"; scale is unitless on native`,
  })
  return null
}
