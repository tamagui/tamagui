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
