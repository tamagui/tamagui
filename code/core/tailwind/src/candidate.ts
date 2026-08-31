import { isWeb } from '@tamagui/constants'
import {
  plainValueToPayload,
  type FrontendClassPlan,
  type FrontendClassPlanEntry,
  type StyleFrontendConfig,
} from '@tamagui/core/internal-runtime'
import {
  borderSideSuffix,
  configRevisionSymbol,
  createGrammarConfigView,
  getTokenCategory,
  getSafeAreaEdge,
  percentUtilityProps,
  radiusCornerProps,
  splitColorOpacitySuffix,
} from '@tamagui/style-grammar/runtime'
import {
  classifyCandidate,
  decodeArbitrary,
  type GrammarConfigView,
  type ParsedCandidate,
} from '@tamagui/style-grammar/tooling'

/**
 * Class-string tokenization and candidate adaptation. This is the Tailwind
 * frontend's private half of the pipeline: everything here is about how a
 * candidate is SPELLED (brackets, slashes, fractions, keywords, negatives).
 *
 * The semantic parser itself stays in `@tamagui/style-grammar`, shared with the
 * converter and build tooling, and everything downstream of the props this module
 * produces — value programs, merging, lowering, evaluation — is core's shared
 * renderer.
 */

const styleGrammarConfigCache = new WeakMap<
  StyleFrontendConfig,
  { revision: number; value: GrammarConfigView }
>()

export function getStyleGrammarConfig(config: StyleFrontendConfig): GrammarConfigView {
  const cached = styleGrammarConfigCache.get(config)
  const revision = (config as any)[configRevisionSymbol]?.revision || 0
  if (cached && cached.revision === revision) return cached.value
  const view = createGrammarConfigView(config)
  styleGrammarConfigCache.set(config, { revision, value: view })
  return view
}

export function isTokenValueProp(prop: string): boolean {
  return getTokenCategory(prop) !== null
}

// CANONICAL arbitrary-value coercion. an arbitrary `[..]` whose inner is a UNITLESS number
// (z-[400], aspect-[1.5], leading-[1.25]) or a PX length (p-[18px], text-[14px], border-[0.5px])
// resolves to a NUMBER: React Native REQUIRES numbers for dimensional + typography props and
// silently DROPS "Npx"/"400" strings (Yoga parseCSSProperty<CSSNumber,CSSPercentage> rejects px;
// StyleSheetTypes types fontSize/lineHeight/letterSpacing as number). web accepts the number and
// re-adds px via CSS. anything carrying a real unit/function (%, rem, vh, deg, calc(), var(),
// #hex, colors) stays a STRING.
function arbitraryValue(inner: string): number | string {
  const px = /^(-?\d*\.?\d+)px$/.exec(inner)
  if (px) return Number(px[1])
  if (/^-?\d*\.?\d+$/.test(inner)) return Number(inner)
  return inner
}

// tailwind sizing keywords / fractions for width/height/min/max props.
// returns a CSS value, or null if `value` isn't a sizing keyword (falls through to normal parse).
function tailwindSizingValue(prop: string, value: string): string | null {
  if (value === 'full') return '100%'
  if (value === 'auto') return 'auto'
  if (value === 'screen') return /[Hh]eight/.test(prop) ? '100vh' : '100vw'
  if (value === 'min') return 'min-content'
  if (value === 'max') return 'max-content'
  if (value === 'fit') return 'fit-content'
  const frac = /^(\d+)\/(\d+)$/.exec(value)
  if (frac && Number(frac[2]) !== 0) {
    return `${(Number(frac[1]) / Number(frac[2])) * 100}%`
  }
  return null
}

// unwrap a possibly-arbitrary value ([2px] → "2px") and coerce a bare number / px length to
// a NUMBER (2px → 2, 0.5 → 0.5) so borderWidth/radius match tamagui's numeric props; other
// units (1em, calc(…)) stay strings.
function borderDimValue(raw: string): number | string {
  let inner = raw
  if (raw.length > 1 && raw[0] === '[' && raw[raw.length - 1] === ']') {
    inner = decodeArbitrary(raw.slice(1, -1))
  }
  const px = /^(-?\d*\.?\d+)px$/.exec(inner)
  if (px) return Number.parseFloat(px[1])
  if (/^-?\d*\.?\d+$/.test(inner)) return Number(inner)
  return inner
}

/**
 * Expand a registry-parsed directional border/radius into all affected props. The registry
 * already selected the token category and width-vs-color meaning; this function only expands
 * that semantic result across sides/corners.
 */
function expandBorderCandidate(
  parsed: ParsedCandidate,
  value: any
): Record<string, any> | null {
  const prefix = parsed.prefix
  if (!prefix) return null
  if (prefix.startsWith('rounded-')) {
    const props = radiusCornerProps[prefix.slice('rounded-'.length)]
    if (!props || props.length === 1) return null
    const out: Record<string, any> = {}
    for (const p of props) out[p] = value
    return out
  }

  const m = /^border-([trblxy])$/.exec(prefix)
  if (!m) return null
  const sides = borderSideSuffix[m[1]]
  const suffix = parsed.entry?.prop.endsWith('Width') ? 'Width' : 'Color'
  const out: Record<string, any> = {}
  for (const side of sides) out[`border${side}${suffix}`] = value
  return out
}

/**
 * Adapt a registry-parsed candidate into the ordinary props shared rendering consumes.
 * Examples:
 *   "hover:bg-blue5" → backgroundColor + a `hover:blue5` program
 *   "sm:p-4" → padding + an `sm:4` program
 *   "bg-[red]" → { key: "backgroundColor", value: "red" }
 *   "w-100" → { key: "width", value: 100 }
 *   "opacity-50" → { key: "opacity", value: 0.5 }
 */
function tailwindClassToFlatProp(
  parsed: ParsedCandidate
): { key: string; value: any } | null {
  if (parsed.kind !== 'dynamic' || !parsed.entry || parsed.rawValue === undefined) {
    return null
  }
  const prop = parsed.entry.prop
  const category = parsed.entry.tokenCategory
  let value: any = parsed.rawValue

  if (prop.endsWith('Width') && parsed.prefix?.startsWith('border')) {
    if (parsed.valueKind === 'token') {
      value = `${parsed.negative ? '-' : ''}${value}`
    } else if (parsed.valueKind === 'arbitrary') {
      value = borderDimValue(value)
    } else {
      return null
    }
    return { key: prop, value }
  }

  if (prop === 'fontFamily') {
    let famValue: string
    if (value.length > 2 && value[0] === '[' && value[value.length - 1] === ']') {
      famValue = decodeArbitrary(value.slice(1, -1))
    } else {
      const generic: Record<string, string> = {
        sans: 'sans-serif',
        serif: 'serif',
        mono: 'monospace',
      }
      famValue = parsed.valueKind === 'token' ? value : generic[value] || value
    }
    return {
      key: 'fontFamily',
      value: famValue,
    }
  }

  if (prop === 'fontSize') {
    let fsValue: any
    if (value.length > 2 && value[0] === '[' && value[value.length - 1] === ']') {
      // fontSize is number-only on native: text-[14px] → 14 (arbitraryValue drops px)
      fsValue = arbitraryValue(decodeArbitrary(value.slice(1, -1)))
    } else {
      fsValue = value
    }
    return {
      key: 'fontSize',
      value: fsValue,
    }
  }

  if (prop === 'lineHeight') {
    let lhValue: any
    if (value.length > 2 && value[0] === '[' && value[value.length - 1] === ']') {
      const inner = decodeArbitrary(value.slice(1, -1))
      // px length → NUMBER (native-valid: leading-[20px] → 20). a UNITLESS value is a web
      // lineHeight MULTIPLIER and MUST stay a string (a number would be px-ified to "1.25px"
      // on web, breaking the multiplier). RN has no unitless multiplier, so this is web-only.
      lhValue = /^-?\d*\.?\d+px$/.test(inner) ? Number.parseFloat(inner) : inner
    } else {
      lhValue = value
    }
    return {
      key: 'lineHeight',
      value: lhValue,
    }
  }

  if (prop === 'letterSpacing') {
    let lsValue: any
    if (value.length > 2 && value[0] === '[' && value[value.length - 1] === ']') {
      lsValue = arbitraryValue(decodeArbitrary(value.slice(1, -1)))
    } else {
      lsValue = value
    }
    return {
      key: 'letterSpacing',
      value: lsValue,
    }
  }

  if (prop === 'boxShadow' && value[0] === '[' && value[value.length - 1] === ']') {
    return {
      key: 'boxShadow',
      value: decodeArbitrary(value.slice(1, -1)),
    }
  }

  // arbitrary values: p-[4px], w-[100px], rounded-[8px], min-h-[100vh], rotate-[-8deg],
  // h-[calc(100%-2px)], bg-[var(--color5)], bg-[#fff]. use the bracketed value directly as
  // CSS — no scaling/token resolution. tailwind encodes spaces inside [] as underscores.
  if (value.length > 2 && value[0] === '[' && value[value.length - 1] === ']') {
    const inner = decodeArbitrary(value.slice(1, -1))
    if (inner === '') return null
    // px-length + unitless arbitraries become NUMBERS (native requires numbers, drops "Npx"
    // strings); unit/function values stay strings. one canonical rule (arbitraryValue).
    return { key: prop, value: arbitraryValue(inner) }
  }

  // tailwind sizing keywords / fractions (w-full → 100%, w-1/2 → 50%, w-auto, w-screen).
  // handled before isValidTailwindValue since fractions/keywords aren't plain CSS values. An
  // exact configured size token with the same spelling stays a token.
  if (category === 'size' && parsed.valueKind !== 'token') {
    const sized = tailwindSizingValue(prop, value)
    if (sized != null) {
      return { key: prop, value: sized }
    }
  }

  // color opacity modifier: bg-blue-500/50 → split value into base + /N suffix,
  // re-attached after token resolution so the shared color resolver applies it via color-mix
  // (web) / rgba (native). only for color props; for non-color props a "/" in the
  // value is left intact (e.g. fraction sizing handled above).
  let opacitySuffix = ''
  if (category === 'color' && typeof value === 'string') {
    const suffix = splitColorOpacitySuffix(value)
    if (suffix.kind === 'invalid') {
      return { key: prop, value }
    }
    if (suffix.kind === 'valid') {
      opacitySuffix = value.slice(suffix.name.length)
      value = suffix.name
    }
  }

  // handle special value patterns
  if (percentUtilityProps.has(prop) && /^\d+$/.test(value)) {
    // tailwind percentage utilities: opacity-50 → 0.5, scale-95 → 0.95, scale-100 → 1
    value = Number(value) / 100
  } else if (/^\d+(\.\d+)?$/.test(value)) {
    if (category === 'zIndex' && parsed.valueKind === 'convenience') {
      value = Number(value)
    } else if (category) {
      value = `${parsed.negative ? '-' : ''}${value}`
    } else {
      value = Number(value)
    }
  } else if (typeof value === 'string') {
    if (
      category &&
      !(
        (category === 'space' || category === 'size' || category === 'radius') &&
        getSafeAreaEdge(value)
      )
    ) {
      value = `${parsed.negative ? '-' : ''}${value}`
    }
  }

  // re-attach the color opacity suffix (bg-blue-500/50). the shared flat-value
  // resolver parses the trailing /N after its property-scoped name lookup.
  if (opacitySuffix && typeof value === 'string') {
    value = `${value}${opacitySuffix}`
  }

  if (parsed.negative && !category) {
    if (typeof value === 'number') value = -value
    else if (typeof value === 'string' && value[0] !== '-') value = `-${value}`
  }

  return { key: prop, value }
}

// Parsing a Tailwind candidate depends only on the class string and the grammar
// config, never on the surrounding props, so the decision is cached per class.
// Without this the full parse (split + classify + resolve + border expansion) ran
// on every render of every component carrying a className — measured at ~18µs per
// call for a 4-class string, a 1.53x tax over writing the same styles as props.
// The plan is a flat [key, value][] applied in order, so the authored ordering
// between classes and ordinary props is unchanged.
//
// null = web-only candidate dropped on native. 'raw' = not claimed by the
// grammar, caller preserves the class string. An array (which may legitimately be
// empty) = claimed, apply these entries.
type TailwindPlanEntry = FrontendClassPlanEntry
type TailwindClassPlan = TailwindPlanEntry[] | null | 'raw'
type TailwindParentPlan = {
  entries: TailwindPlanEntry[]
  preserveRawClass: boolean
}

type CachedTailwindClassPlan = TailwindClassPlan | TailwindParentPlan

const classPlanCache = new WeakMap<object, Map<string, CachedTailwindClassPlan>>()

function getClassPlanCache(grammarConfig: object) {
  let cache = classPlanCache.get(grammarConfig)
  if (!cache) {
    cache = new Map()
    classPlanCache.set(grammarConfig, cache)
  }
  return cache
}

function createPlanEntry(
  property: string,
  value: unknown,
  modifiers: readonly string[]
): TailwindPlanEntry | null {
  if (modifiers.length === 0) return [property, value]
  const payload = plainValueToPayload(value, property)
  if (payload === null) return null
  let condition = ''
  for (let index = 0; index < modifiers.length; index++) {
    if (index) condition += ':'
    condition += modifiers[index]
  }
  return [property, payload, condition, modifiers]
}

function computeClassPlan(
  cls: string,
  grammarConfig: GrammarConfigView
): CachedTailwindClassPlan {
  const groupMarker = /^group(?:\/([A-Za-z0-9_-]+))?$/.exec(cls)
  if (groupMarker) {
    return {
      entries: [['group', groupMarker[1] || true]],
      preserveRawClass: isWeb,
    }
  }

  const containerMarker = /^@container(-size)?(?:\/([A-Za-z0-9_-]+))?$/.exec(cls)
  if (containerMarker) {
    const isSize = containerMarker[1] !== undefined
    const name = containerMarker[2]
    const entries: TailwindPlanEntry[] = []
    entries.push(['container', name || true])
    if (isSize) {
      entries.push(['containerType', 'size'])
    }
    return { entries, preserveRawClass: isWeb }
  }

  const classification = classifyCandidate(cls, grammarConfig)
  if (classification.kind === 'passthrough') {
    return isWeb ? 'raw' : null
  }
  const parsed = classification.parsed
  // named utilities first (flex-row, flex-1, hidden, …) — whole class → fixed prop(s).
  // these may emit multiple props and may have no dash, so handle before the generic parse.
  const util = parsed.kind === 'utility' ? parsed.properties : null
  if (util) {
    const entries: TailwindPlanEntry[] = []
    for (const p in util) {
      const entry = createPlanEntry(p, util[p], parsed.modifiers)
      if (!entry) return 'raw'
      entries.push(entry)
    }
    return entries
  }
  // Resolve only after the registry has claimed the candidate. Directional border/radius
  // expansion below consumes that parsed decision instead of re-parsing width vs color.
  const flatProp = tailwindClassToFlatProp(parsed)
  if (flatProp) {
    const expanded = expandBorderCandidate(parsed, flatProp.value)
    if (expanded) {
      const entries: TailwindPlanEntry[] = []
      for (const p in expanded) {
        const entry = createPlanEntry(p, expanded[p], parsed.modifiers)
        if (!entry) return 'raw'
        entries.push(entry)
      }
      return entries
    }
    const entry = createPlanEntry(flatProp.key, flatProp.value, parsed.modifiers)
    return entry ? [entry] : 'raw'
  }
  // not claimed: caller preserves the raw class
  return 'raw'
}

export function getTailwindClassPlan(
  candidate: string,
  config: StyleFrontendConfig
): FrontendClassPlan {
  const grammarConfig = getStyleGrammarConfig(config)
  const plans = getClassPlanCache(grammarConfig)
  let plan = plans.get(candidate)
  if (plan === undefined) {
    plan = computeClassPlan(candidate, grammarConfig)
    plans.set(candidate, plan)
  }
  return plan
}

export function resolveTailwindClassName(
  className: string,
  config: StyleFrontendConfig
): Record<string, any> {
  const result: Record<string, any> = {}
  let rawClassName = ''
  let start = 0
  for (let index = 0; index <= className.length; index++) {
    if (index !== className.length && className.charCodeAt(index) > 32) continue
    if (start === index) {
      start = index + 1
      continue
    }
    const candidate = className.slice(start, index)
    const plan = getTailwindClassPlan(candidate, config)
    if (plan === 'raw') {
      rawClassName = rawClassName ? `${rawClassName} ${candidate}` : candidate
    } else if (plan) {
      const parentPlan = plan as TailwindParentPlan
      if (!Array.isArray(plan) && parentPlan.preserveRawClass) {
        rawClassName = rawClassName ? `${rawClassName} ${candidate}` : candidate
      }
      const entries = Array.isArray(plan) ? plan : parentPlan.entries
      for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
        const [key, value, condition] = entries[entryIndex]
        const previous = result[key]
        let next = value
        if (condition !== undefined) {
          next =
            previous && typeof previous === 'object' && !Array.isArray(previous)
              ? { ...previous, [condition]: value }
              : previous === undefined
                ? { [condition]: value }
                : { default: previous, [condition]: value }
        } else if (previous && typeof previous === 'object' && !Array.isArray(previous)) {
          next = { ...previous, default: value }
        }
        setInAuthoredOrder(result, key, next)
      }
    }
    start = index + 1
  }
  if (rawClassName) result.className = rawClassName
  return result
}

/**
 * Append a contribution at the end of the forward pass.
 *
 * Plain re-assignment keeps a key's FIRST insertion position, so a restated
 * shorthand would stay behind a longhand authored between the two occurrences:
 * `p-4 px-2 p-6` has to resolve `paddingLeft` from `p-6`, and `pt-2 p-4 pt-8` has to
 * resolve `paddingTop` from `pt-8`. Deleting the key first moves it to the end,
 * which is the authored order the shared per-longhand merge reads.
 */
export function setInAuthoredOrder(
  target: Record<string, any>,
  key: string,
  value: any
): void {
  if (key in target) delete target[key]
  target[key] = value
}
