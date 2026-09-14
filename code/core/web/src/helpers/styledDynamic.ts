import { getSetting } from '../config'
import { getVariableValue } from '../createVariable'
import type {
  GenericFonts,
  GetStyleState,
  LanguageContextType,
  StyledDynamic,
  StyledDynamicEnv,
  StyledDynamicFn,
  StyledDynamicProp,
} from '../types'
import { styledDynamicSymbol } from '../types'

const fontLanguageCache = new WeakMap()

export function getFontsForLanguage(fonts: GenericFonts, language: LanguageContextType) {
  if (fontLanguageCache.has(language)) return fontLanguageCache.get(language)
  const next = { ...fonts }
  for (const name in language) {
    const lang = language[name]
    if (lang !== 'default') next[name] = fonts[`${name}_${lang}`]
  }
  fontLanguageCache.set(language, next)
  return next
}

export function isStyledDynamic(value: unknown): value is StyledDynamic {
  return (
    !!value &&
    (typeof value === 'function' || typeof value === 'object') &&
    styledDynamicSymbol in (value as object)
  )
}

const bareStyledDynamic: StyledDynamicProp = { [styledDynamicSymbol]: true }
const dynamicSpreadProbe = Symbol('tamagui.dynamicSpreadProbe')
const dynamicComputedProbe = '__tamagui_dynamic_computed_key__'
const dynamicComputedNumberProbe = 712_367_821
const dynamicShapeProbeValues = new WeakSet<object>()

function createDynamicShapeProbe(): any {
  const target = function () {}
  let probe: any
  probe = new Proxy(target, {
    apply: () => probe,
    construct: () => probe,
    get: (_target, key) => {
      if (key === Symbol.toPrimitive) {
        return (hint: string) =>
          hint === 'number' ? dynamicComputedNumberProbe : dynamicComputedProbe
      }
      if (key === Symbol.iterator) {
        return function* () {
          yield dynamicComputedProbe
        }
      }
      if (key === dynamicSpreadProbe) return true
      return probe
    },
    getOwnPropertyDescriptor: (target, key) =>
      key === dynamicSpreadProbe
        ? { configurable: true, enumerable: true, value: true }
        : Reflect.getOwnPropertyDescriptor(target, key),
    ownKeys: (target) => [...Reflect.ownKeys(target), dynamicSpreadProbe],
  })
  dynamicShapeProbeValues.add(probe)
  return probe
}

function findDynamicShapeViolation(value: unknown) {
  if (!value || (typeof value !== 'object' && typeof value !== 'function')) return
  const seen = new WeakSet<object>()
  let spread = false
  let computed = false
  const visit = (current: object) => {
    // A proxy used as an ordinary scalar/local value is valid. Its enumerable
    // marker only means "spread" after object spread copies that descriptor
    // onto a returned literal.
    if (dynamicShapeProbeValues.has(current) || seen.has(current)) return
    seen.add(current)
    let descriptors: PropertyDescriptorMap
    try {
      descriptors = Object.getOwnPropertyDescriptors(current)
    } catch {
      return
    }
    for (const key of Reflect.ownKeys(descriptors)) {
      if (key === dynamicSpreadProbe) spread = true
      if (
        typeof key === 'string' &&
        (key.includes(dynamicComputedProbe) || key === String(dynamicComputedNumberProbe))
      ) {
        computed = true
      }
      const nested = descriptors[key as keyof typeof descriptors]?.value
      if (nested && (typeof nested === 'object' || typeof nested === 'function')) {
        visit(nested)
      }
    }
  }
  visit(value)
  if (spread || computed) return { spread, computed }
}

function validateDynamicShape(fn: Function) {
  try {
    const probe = createDynamicShapeProbe()
    // Helpers may diagnose the deliberately-invalid proxy value (for example a
    // token resolver saying it is not a known size). Those are probe artifacts,
    // not definition warnings; only the shape warning below should escape.
    const warn = console.warn
    let output
    try {
      console.warn = () => {}
      output = fn(probe, probe)
    } finally {
      console.warn = warn
    }
    const violation = findDynamicShapeViolation(output)
    if (!violation) return
    const reasons = [
      violation.spread ? 'a spread from a dynamic input' : '',
      violation.computed ? 'a computed key from a dynamic input' : '',
    ].filter(Boolean)
    console.warn(
      `[tamagui] styled.dynamic${fn.name ? ` (${fn.name})` : ''} returned ${reasons.join(' and ')} during its development shape check. Dynamic style bodies require static object keys for extraction; this definition will deopt instead.`
    )
  } catch {
    // The probe is intentionally best-effort. A body may depend on a concrete
    // runtime value the proxy cannot model; definition must never fail for it.
  }
}

/**
 * `styled.dynamic<T>()` declares a typed variant prop that is consumed by
 * styling (given style by a component `.resolve`). `styled.dynamic<T>(fn)`
 * maps the value to a style fragment; it is invoked per clause payload so
 * responsive/conditional values work, and the branded function stays callable
 * inside other dynamics or resolvers.
 */
export function styledDynamic<Val>(): StyledDynamicProp<Val>
export function styledDynamic<Val>(
  fn: (value: Val, env: StyledDynamicEnv) => Record<string, any> | null | undefined
): StyledDynamicFn<Val>
export function styledDynamic(fn?: any) {
  if (!fn) return bareStyledDynamic
  if (process.env.NODE_ENV === 'development') validateDynamicShape(fn)
  fn[styledDynamicSymbol] = true
  return fn
}

/**
 * the env for `styled.dynamic` callbacks and `.resolve` resolvers: tokens,
 * theme, fonts, and the active font. Built once per style pass.
 */
export function getDynamicEnv(styleState: GetStyleState): StyledDynamicEnv {
  const cached = (styleState as any).flatDynamicEnv
  if (cached) return cached

  const { props, conf, context, theme } = styleState
  let fonts = conf.fontsParsed
  if (context?.language) {
    fonts = getFontsForLanguage(conf.fontsParsed, context.language)
  }

  const next = {
    fonts,
    tokens: conf.tokensParsed,
    sizes: conf.sizes,
    theme,
    get fontFamily() {
      return (
        getVariableValue(styleState.fontFamily || props.fontFamily) ||
        props.fontFamily ||
        getVariableValue(getSetting('defaultFont'))
      )
    },
    get font() {
      const found = fonts[this.fontFamily as string]
      if (found) return found

      const className = props.className
      if (typeof className === 'string') {
        const name = /(?:^|\s)font_(\S+)/.exec(className)?.[1]
        if (name && fonts[name]) return fonts[name]
      }
      return fonts[conf.defaultFontToken]
    },
  } as StyledDynamicEnv

  return ((styleState as any).flatDynamicEnv = next)
}
