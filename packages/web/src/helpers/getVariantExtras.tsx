import { getVariableValue } from '../createVariable'
import type { GenericFonts, GetStyleState } from '../types'
import type { LanguageContextType } from '../views/FontLanguage.types'

export function getVariantExtras(styleState: GetStyleState) {
  const { curProps, props, conf, context, theme } = styleState
  let fonts = conf.fontsParsed
  if (context?.language) {
    fonts = getFontsForLanguage(conf.fontsParsed, context.language)
  }

  // should be able to just use styleState.fontFamily but no time to test for now
  const fontFamily = getVariableValue(
    styleState.fontFamily || styleState.curProps.fontFamily || styleState.conf.defaultFont
  )

  const font = fonts[fontFamily] || fonts[styleState.conf.defaultFont!]

  const next = {
    fonts,
    tokens: conf.tokensParsed,
    theme,
    fontFamily,
    font,
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
