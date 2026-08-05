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

      // When a component re-processes already-resolved props (useProps -> inner
      // render), fontFamily arrives as the opaque var(--f-family) reference. The
      // font identity survives in the font_<name> class.
      const className = props.className
      if (typeof className === 'string') {
        const match = /(?:^|\s)font_([A-Za-z0-9_-]+)/.exec(className)
        if (match && fonts[match[1]]) {
          return fonts[match[1]]
        }
      }

      // Anything else is a font this config does not define — a bare var()
      // reference to the root --f-family, or a real CSS family like
      // `fontFamily: 'monospace'`. Neither has a configured type scale, so size
      // resolution falls back to the default font's. Returning undefined here
      // instead crashed every size variant that reads `font.size`, because each
      // caller passes `extras.font!` straight into resolveTokenSize.
      return fonts[conf.defaultFontToken]
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
        const langKey = `${name}_${lang}`
        return [[name, fonts[langKey]]]
      })
    ),
  }
  fontLanguageCache.set(language, next)
  return next
}
