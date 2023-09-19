import { getVariableValue } from '../createVariable'
import { GenericFonts, GetStyleState } from '../types'
import { LanguageContextType } from '../views/FontLanguage.types'
import { createProxy } from './createProxy'

export function getVariantExtras(styleState: GetStyleState) {
  const { curProps, conf, context, theme } = styleState
  let fonts = conf.fontsParsed
  if (context?.language) {
    fonts = getFontsForLanguage(conf.fontsParsed, context.language)
  }

  // should be able to just use styleState.fontFamily but no time to test for now
  const fontFamily = getVariableValue(
    styleState.fontFamily || styleState.curProps.fontFamily || styleState.conf.defaultFont
  )

  const next = {
    fonts,
    tokens: conf.tokensParsed,
    theme,
    fontFamily,
    font: fonts[fontFamily] || fonts[styleState.conf.defaultFont!],
    // TODO do this in splitstlye
    // we avoid passing in default props for media queries because that would confuse things like SizableText.size:
    props: createProxy(curProps, {
      // handles shorthands
      get(target, key) {
        const shorthand = conf.inverseShorthands[key as any]
        // shorthands before longhand because a styled() with longhand combined with inline shorthand
        // shorthand will always be the overriding key
        if (shorthand && Reflect.has(target, shorthand)) {
          return Reflect.get(target, shorthand)
        }
        if (Reflect.has(target, key)) {
          return Reflect.get(target, key)
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
