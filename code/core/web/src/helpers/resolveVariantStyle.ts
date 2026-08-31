import { getSetting } from '../config'
import { getVariableValue } from '../createVariable'
import type { GenericFonts, GetStyleState, LanguageContextType } from '../types'
import { emitVariantStyle, walkConditionalValue } from './getSplitStyles'
import { isObj } from './isObj'
import { getConfigRevisionState } from './grammarConfig'
import { skipProps } from './skipProps'
import { styleOriginalValues } from './styleOriginalValues'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'

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

export const getVariantExtras = (styleState: GetStyleState) => {
  const cached = (styleState as any).flatVariantExtras
  if (cached) return cached

  const { props, conf, context, theme, styleProps } = styleState
  let fonts = conf.fontsParsed
  if (context?.language) {
    fonts = getFontsForLanguage(conf.fontsParsed, context.language)
  }

  const next = {
    fonts,
    tokens: conf.tokensParsed,
    theme,
    context: styleProps.styledContext,
    get fontFamily() {
      return (
        getVariableValue(styleState.fontFamily || styleState.props.fontFamily) ||
        props.fontFamily ||
        getVariableValue(getSetting('defaultFont'))
      )
    },
    get font() {
      const found = fonts[this.fontFamily]
      if (found) return found

      const className = props.className
      if (typeof className === 'string') {
        const name = /(?:^|\s)font_(\S+)/.exec(className)?.[1]
        if (name && fonts[name]) return fonts[name]
      }
      return fonts[conf.defaultFontToken]
    },
    props,
  }

  return ((styleState as any).flatVariantExtras = next)
}

export function resolveVariantStyle(
  state: GetStyleState,
  variants: Record<string, any>,
  key: string,
  value: any,
  parentKey = key,
  parentCondition?: unknown
) {
  const definition = variants[key]
  if (
    !(
      typeof value === 'string' &&
      definition &&
      typeof definition === 'object' &&
      value in definition
    ) &&
    walkConditionalValue(state, key, value, parentCondition, (payload, condition) =>
      resolveSelection(state, variants, key, payload, parentKey, condition || undefined)
    )
  ) {
    return
  }
  resolveSelection(state, variants, key, value, parentKey, parentCondition)
}

function resolveSelection(
  state: GetStyleState,
  variants: Record<string, any>,
  key: string,
  value: any,
  parentKey: string,
  condition?: unknown
) {
  let output = getConfigRevisionState(state.conf).variantDefinition(
    variants[key],
    value,
    state.theme
  )
  if (typeof output === 'function') output = output(value, getVariantExtras(state))
  if (!isObj(output)) return

  const originals = styleOriginalValues.get(output)
  for (const outputKey in output) {
    if (!state.styleProps.noSkip && outputKey in skipProps) continue
    const raw = output[outputKey]
    const value = state.styleProps.noNormalize
      ? raw
      : normalizeValueWithProperty(raw, state.conf.shorthands[outputKey] || outputKey)
    emitVariantStyle(
      state,
      outputKey,
      value,
      originals?.[outputKey] ?? raw,
      condition,
      parentKey === key && outputKey === key
    )
  }
}
