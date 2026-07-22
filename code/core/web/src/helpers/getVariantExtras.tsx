import { getSetting } from '../config'
import { getVariableValue } from '../createVariable'
import type { GenericFonts, GetStyleState, LanguageContextType } from '../types'

const cache = new WeakMap<GetStyleState, { props: GetStyleState['props']; value: any }>()

export const getVariantExtras = (styleState: GetStyleState) => {
  const cached = cache.get(styleState)
  if (cached?.props === styleState.props) {
    return cached.value
  }

  const { props, conf, context, theme, styleProps } = styleState
  const styledContext = styleProps.styledContext
  let fonts = conf.fontsParsed
  if (context?.language) {
    fonts = getFontsForLanguage(conf.fontsParsed, context.language)
  }

  const next = {
    fonts,
    tokens: conf.tokensParsed,
    theme,
    context: styledContext,
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
      // when a component re-processes already-resolved props (useProps ->
      // inner render), fontFamily arrives as the opaque `var(--f-family)`
      // reference — the font identity survives in the `font_<name>` className
      const className = props.className
      if (typeof className === 'string') {
        const match = /(?:^|\s)font_([A-Za-z0-9_-]+)/.exec(className)
        if (match && fonts[`$${match[1]}`]) {
          return fonts[`$${match[1]}`]
        }
      }
      // a bare var() reference with no font class resolves to the root
      // --f-family, which is the default font. defaultFontToken is the
      // normalized ('$'-prefixed) defaultFont setting — fontsParsed keys are
      // always prefixed, the raw setting may not be
      return !props.fontFamily ||
        props.fontFamily[0] === '$' ||
        (typeof props.fontFamily === 'string' && props.fontFamily.startsWith('var('))
        ? fonts[conf.defaultFontToken]
        : undefined
    },
    props,
  }

  cache.set(styleState, { props, value: next })

  return next as any
}

const fontLanguageCache = new WeakMap()

export function getFontsForLanguage(fonts: GenericFonts, language: LanguageContextType) {
  if (fontLanguageCache.has(language)) {
    return fontLanguageCache.get(language)
  }
  const next = {
    ...fonts,
    ...Object.fromEntries(
      Object.entries(language).flatMap(([name, lang]) => {
        if (lang === 'default') {
          return []
        }
        const langKey = `$${name}_${lang}`
        return [[`$${name}`, fonts[langKey]]]
      })
    ),
  }
  fontLanguageCache.set(language, next)
  return next
}
