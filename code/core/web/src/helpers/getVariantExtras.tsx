import { getVariableValue } from '../createVariable'
import type { GenericFonts, GetStyleState } from '../types'
import type { LanguageContextType } from '../views/FontLanguage.types'

const cache = new WeakMap()

export const getVariantExtras = (styleState: GetStyleState) => {
  if (cache.has(styleState)) {
    return cache.get(styleState)
  }

  const { curProps, props, conf, context, theme } = styleState
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
        getVariableValue(styleState.fontFamily || styleState.curProps.fontFamily) ||
        props.fontFamily ||
        getVariableValue(styleState.conf.defaultFont)
      )
    },
    get font() {
      return (
        fonts[this.fontFamily] ||
        (!props.fontFamily ? styleState.conf.defaultFont : undefined)
      )
    },
    // TODO do this in splitstlye
    // we avoid passing in default props for media queries because that would confuse things like SizableText.size:
    props: new Proxy(props, {
      // handles shorthands
      get(target, key) {
        for (const tryKey of [key, conf.inverseShorthands[key as any]]) {
          if (!tryKey) continue
          if (Reflect.has(curProps, tryKey)) return Reflect.get(curProps, tryKey)
          return Reflect.get(target, tryKey)
        }
      },
    }),
  }

  cache.set(styleState, next)

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
      Object.entries(language).map(([name, lang]) => {
        if (lang === 'default') {
          return []
        }
        const langKey = `$${name}_${lang}`
        return [`$${name}`, fonts[langKey]]
      })
    ),
  }
  fontLanguageCache.set(language, next)
  return next
}
